@echo off
REM JARVIS 2.0 C++ Build Script

echo.
echo ===================================
echo   JARVIS 2.0 C++ Server Build
echo ===================================
echo.

if "%VCPKG_PATH%"=="" (
    echo ❌ Error: VCPKG_PATH environment variable not set
    echo Please set VCPKG_PATH to your vcpkg installation directory
    echo Example: set VCPKG_PATH=C:\vcpkg
    pause
    exit /b 1
)

echo ✓ Using vcpkg from: %VCPKG_PATH%

where cmake >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Error: CMake not found in PATH
    echo Please install CMake from https://cmake.org/download/
    pause
    exit /b 1
)

echo ✓ CMake found

if not exist "build" (
    echo 📁 Creating build directory...
    mkdir build
) else (
    echo 📁 Build directory already exists
)

cd build

echo 🔨 Generating Visual Studio project files...
cmake .. -DCMAKE_TOOLCHAIN_FILE=%VCPKG_PATH%\scripts\buildsystems\vcpkg.cmake -A x64

if %errorlevel% neq 0 (
    echo ❌ CMake generation failed!
    pause
    exit /b 1
)

echo ✓ Project files generated

echo 🏗️  Building JARVIS 2.0 C++ Server (Release mode)...
cmake --build . --config Release

if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo.
echo ✅ Build successful!
echo.
echo 📍 Server executable location:
echo    build\bin\Release\jarvis_server.exe
echo.
echo 🚀 To run the server, execute:
echo    .\build\bin\Release\jarvis_server.exe
echo.
echo 📋 Make sure .env file is configured with API_KEY
echo.

pause
