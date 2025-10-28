#include <iostream>
#include <string>
#include <map>
#include <vector>
#include <cstring>
#include <thread>
#include <mutex>
#include <chrono>
#include <sstream>
#include <fstream>
#include <algorithm>
#include <cstdlib>
#include <winsock2.h>
#include <ws2tcpip.h>
#include <json/json.h>
#include <curl/curl.h>

#pragma comment(lib, "ws2_32.lib")

// Global variables
const int PORT = 8080;
std::string API_KEY = "";
std::string API_URL = "";
std::string API_MODEL = "llama-3.3-70b-versatile";
std::mutex response_mutex;
std::string last_response = "";

// Knowledge base
std::map<std::string, std::string> knowledge_base = {
    {"machine learning", "Machine Learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed."},
    {"python", "Python is a high-level, interpreted programming language known for its simplicity and readability."},
    {"artificial intelligence", "Artificial Intelligence (AI) is the simulation of human intelligence processes by computer systems."},
    {"cloud computing", "Cloud Computing is the delivery of computing services over the internet."},
    {"blockchain", "Blockchain is a distributed ledger technology that maintains records in immutable chains."},
    {"internet", "The Internet is a global system of interconnected computer networks."},
    {"database", "A Database is an organized collection of structured data."},
    {"api", "An API is a set of protocols that allows different software applications to communicate."},
    {"cybersecurity", "Cybersecurity encompasses technologies to protect computers and data from digital attacks."},
    {"india", "India is a South Asian country and the world's most populous democracy."},
    {"taj mahal", "The Taj Mahal is an iconic ivory-white marble mausoleum in Agra, India."},
    {"paris", "Paris is the capital and largest city of France."},
    {"london", "London is the capital and largest city of the United Kingdom."},
    {"tokyo", "Tokyo is the capital of Japan and the world's most populous metropolitan area."}
};

// Load environment variables
void load_env() {
    std::ifstream env_file(".env");
    std::string line;
    while (std::getline(env_file, line)) {
        if (line.find("API_KEY=") != std::string::npos) {
            API_KEY = line.substr(8);
        } else if (line.find("API_URL=") != std::string::npos) {
            API_URL = line.substr(8);
        }
    }
    
    if (API_KEY.empty()) {
        std::cout << "⚠️  Warning: API_KEY not set. Please configure it in .env file." << std::endl;
    }
}

// Callback for CURL response
size_t write_callback(void* contents, size_t size, size_t nmemb, std::string* userp) {
    userp->append((char*)contents, size * nmemb);
    return size * nmemb;
}

// Generate smart response from knowledge base
std::string generate_smart_response(const std::string& query) {
    std::string lower_query = query;
    std::transform(lower_query.begin(), lower_query.end(), lower_query.begin(), ::tolower);
    
    for (const auto& [key, value] : knowledge_base) {
        if (lower_query.find(key) != std::string::npos) {
            return value;
        }
    }
    
    return "That's an interesting question! I can help with topics related to geography, technology, and science.";
}

// Generate AI response using Groq API
std::string generate_ai_response(const std::string& query) {
    if (API_KEY.empty() || API_URL.empty()) {
        std::cout << "⚠️ AI service not configured. Using local knowledge base..." << std::endl;
        return generate_smart_response(query);
    }
    
    CURL* curl = curl_easy_init();
    if (!curl) {
        return generate_smart_response(query);
    }
    
    try {
        Json::Value root;
        root["model"] = API_MODEL;
        
        Json::Value messages(Json::arrayValue);
        Json::Value system_msg;
        system_msg["role"] = "system";
        system_msg["content"] = "You are JARVIS 2.0, an intelligent and helpful AI assistant.";
        messages.append(system_msg);
        
        Json::Value user_msg;
        user_msg["role"] = "user";
        user_msg["content"] = query;
        messages.append(user_msg);
        
        root["messages"] = messages;
        root["temperature"] = 0.7;
        root["max_tokens"] = 512;
        
        Json::StreamWriterBuilder writer;
        std::string json_payload = Json::writeString(writer, root);
        
        struct curl_slist* headers = nullptr;
        headers = curl_slist_append(headers, "Content-Type: application/json");
        std::string auth_header = "Authorization: Bearer " + API_KEY;
        headers = curl_slist_append(headers, auth_header.c_str());
        
        std::string response_body;
        
        curl_easy_setopt(curl, CURLOPT_URL, API_URL.c_str());
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_payload.c_str());
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response_body);
        curl_easy_setopt(curl, CURLOPT_TIMEOUT, 15L);
        
        CURLcode res = curl_easy_perform(curl);
        
        curl_slist_free_all(headers);
        curl_easy_cleanup(curl);
        
        if (res != CURLE_OK) {
            return generate_smart_response(query);
        }
        
        Json::CharReaderBuilder reader;
        Json::Value json_response;
        std::string errors;
        std::istringstream stream(response_body);
        
        if (!Json::parseFromStream(reader, stream, &json_response, &errors)) {
            return generate_smart_response(query);
        }
        
        if (json_response.isMember("choices") && json_response["choices"].isArray() && json_response["choices"].size() > 0) {
            return json_response["choices"][0]["message"]["content"].asString();
        }
        
        return generate_smart_response(query);
        
    } catch (const std::exception& e) {
        return generate_smart_response(query);
    }
}

// Simple HTTP response formatter
std::string format_http_response(const std::string& content_type, const std::string& body) {
    std::ostringstream response;
    response << "HTTP/1.1 200 OK\r\n";
    response << "Content-Type: " << content_type << "\r\n";
    response << "Content-Length: " << body.length() << "\r\n";
    response << "Access-Control-Allow-Origin: *\r\n";
    response << "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n";
    response << "Access-Control-Allow-Headers: Content-Type\r\n";
    response << "Connection: close\r\n";
    response << "\r\n";
    response << body;
    return response.str();
}

// Handle client connection
void handle_client(SOCKET client_socket) {
    char buffer[4096];
    int recv_result = recv(client_socket, buffer, sizeof(buffer) - 1, 0);
    
    if (recv_result > 0) {
        buffer[recv_result] = '\0';
        std::string request(buffer);
        
        if (request.find("POST /start") != std::string::npos) {
            Json::Value response;
            response["status"] = "started";
            response["message"] = "JARVIS 2.0 is ready with AI Knowledge Base!";
            
            Json::StreamWriterBuilder writer;
            std::string json_str = Json::writeString(writer, response);
            std::string http_response = format_http_response("application/json", json_str);
            
            send(client_socket, http_response.c_str(), http_response.length(), 0);
        }
        else if (request.find("POST /chat") != std::string::npos) {
            size_t body_start = request.find("\r\n\r\n");
            if (body_start != std::string::npos) {
                std::string body = request.substr(body_start + 4);
                
                Json::CharReaderBuilder reader;
                Json::Value json_body;
                std::string errors;
                std::istringstream stream(body);
                
                if (Json::parseFromStream(reader, stream, &json_body, &errors)) {
                    std::string message = json_body["message"].asString();
                    
                    std::string ai_response = generate_ai_response(message);
                    
                    Json::Value response;
                    response["response"] = ai_response;
                    response["status"] = "success";
                    response["source"] = "AI Knowledge Base 🧠";
                    
                    Json::StreamWriterBuilder writer;
                    std::string json_str = Json::writeString(writer, response);
                    std::string http_response = format_http_response("application/json", json_str);
                    
                    send(client_socket, http_response.c_str(), http_response.length(), 0);
                }
            }
        }
        else if (request.find("POST /stop") != std::string::npos) {
            Json::Value response;
            response["status"] = "stopped";
            response["message"] = "Chatbot stopped successfully";
            
            Json::StreamWriterBuilder writer;
            std::string json_str = Json::writeString(writer, response);
            std::string http_response = format_http_response("application/json", json_str);
            
            send(client_socket, http_response.c_str(), http_response.length(), 0);
        }
        else if (request.find("GET /health") != std::string::npos) {
            Json::Value response;
            response["status"] = "healthy";
            response["ai_model"] = "Groq llama-3.3-70b-versatile";
            response["version"] = "2.0";
            
            Json::StreamWriterBuilder writer;
            std::string json_str = Json::writeString(writer, response);
            std::string http_response = format_http_response("application/json", json_str);
            
            send(client_socket, http_response.c_str(), http_response.length(), 0);
        }
        else if (request.find("OPTIONS") != std::string::npos) {
            std::string http_response = "HTTP/1.1 200 OK\r\n";
            http_response += "Access-Control-Allow-Origin: *\r\n";
            http_response += "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n";
            http_response += "Access-Control-Allow-Headers: Content-Type\r\n";
            http_response += "Content-Length: 0\r\n";
            http_response += "Connection: close\r\n\r\n";
            
            send(client_socket, http_response.c_str(), http_response.length(), 0);
        }
    }
    
    closesocket(client_socket);
}

int main() {
    load_env();
    
    WSADATA wsa_data;
    if (WSAStartup(MAKEWORD(2, 2), &wsa_data) != 0) {
        std::cerr << "WSAStartup failed" << std::endl;
        return 1;
    }
    
    SOCKET server_socket = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (server_socket == INVALID_SOCKET) {
        std::cerr << "Socket creation failed" << std::endl;
        WSACleanup();
        return 1;
    }
    
    sockaddr_in server_addr;
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(PORT);
    server_addr.sin_addr.s_addr = inet_addr("127.0.0.1");
    
    if (bind(server_socket, (sockaddr*)&server_addr, sizeof(server_addr)) == SOCKET_ERROR) {
        std::cerr << "Bind failed" << std::endl;
        closesocket(server_socket);
        WSACleanup();
        return 1;
    }
    
    if (listen(server_socket, SOMAXCONN) == SOCKET_ERROR) {
        std::cerr << "Listen failed" << std::endl;
        closesocket(server_socket);
        WSACleanup();
        return 1;
    }
    
    std::cout << "\n✨ JARVIS 2.0 AI Expert System Server (C++) ✨" << std::endl;
    std::cout << "🚀 Running on http://localhost:" << PORT << std::endl;
    std::cout << "🧠 AI Engine: Groq API (llama-3.3-70b-versatile)" << std::endl;
    std::cout << "⚡ Lightning Fast Responses - Powered by Groq" << std::endl;
    std::cout << "🔧 Press Ctrl+C to stop the server\n" << std::endl;
    
    while (true) {
        SOCKET client_socket = accept(server_socket, nullptr, nullptr);
        if (client_socket != INVALID_SOCKET) {
            std::thread client_thread(handle_client, client_socket);
            client_thread.detach();
        }
    }
    
    closesocket(server_socket);
    WSACleanup();
    
    return 0;
}
