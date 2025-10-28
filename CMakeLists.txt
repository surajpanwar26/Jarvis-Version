cmake_minimum_required(VERSION 3.10)
project(JARVIS_CPP_Server)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find required packages
find_package(CURL REQUIRED)
find_package(jsoncpp REQUIRED)

# Add the executable
add_executable(jarvis_server server.cpp)

# Link libraries
target_link_libraries(jarvis_server 
    PRIVATE CURL::libcurl
    PRIVATE jsoncpp
    PRIVATE ws2_32
)

# Include directories
target_include_directories(jarvis_server 
    PRIVATE ${CURL_INCLUDE_DIRS}
)

# Set output directory
set_target_properties(jarvis_server PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
)
