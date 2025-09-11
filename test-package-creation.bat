@echo off
echo ========================================
echo Simple Package Creator Test
echo ========================================
echo.

echo Current directory: %cd%
echo Script location: %~dp0
echo.

set "source_dir=%~dp0"
set "package_name=test-package"
set "dest_dir=%source_dir%%package_name%"

echo Source: %source_dir%
echo Destination: %dest_dir%
echo.

REM Test basic operations
echo Testing basic file operations...

REM Create test directory
if exist "%dest_dir%" (
    echo Removing existing test directory...
    rmdir /s /q "%dest_dir%"
)

echo Creating test directory...
mkdir "%dest_dir%"

if exist "%dest_dir%" (
    echo ✅ Directory created successfully
) else (
    echo ❌ Failed to create directory
    pause
    exit /b 1
)

REM Test copying a simple file
echo Testing file copy...
echo Test content > "%dest_dir%\test.txt"

if exist "%dest_dir%\test.txt" (
    echo ✅ File copy works
) else (
    echo ❌ File copy failed
)

REM Test frontend directory exists
if exist "%source_dir%frontend" (
    echo ✅ Frontend directory found
) else (
    echo ❌ Frontend directory not found
)

REM Test backend directory exists
if exist "%source_dir%backend" (
    echo ✅ Backend directory found
) else (
    echo ❌ Backend directory not found
)

echo.
echo Test completed. Press any key to continue...
pause

REM Clean up test
rmdir /s /q "%dest_dir%"
echo Test directory cleaned up.
