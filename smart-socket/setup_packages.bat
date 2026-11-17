@echo off
echo ========================================================
echo   AIoT Smart Socket - Downloading Flutter Packages
echo ========================================================
echo.

where flutter >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Flutter SDK found in PATH.
    echo Running flutter pub get...
    flutter pub get
    echo.
    echo [SUCCESS] Packages downloaded successfully!
) else (
    echo [!] Flutter was not found directly in your system PATH.
    echo.
    echo Searching common Flutter installation paths...
    if exist "C:\flutter\bin\flutter.bat" (
        echo Found Flutter at C:\flutter\bin\flutter.bat
        C:\flutter\bin\flutter.bat pub get
    ) else if exist "C:\src\flutter\bin\flutter.bat" (
        echo Found Flutter at C:\src\flutter\bin\flutter.bat
        C:\src\flutter\bin\flutter.bat pub get
    ) else if exist "%USERPROFILE%\flutter\bin\flutter.bat" (
        echo Found Flutter at %USERPROFILE%\flutter\bin\flutter.bat
        %USERPROFILE%\flutter\bin\flutter.bat pub get
    ) else if exist "%USERPROFILE%\development\flutter\bin\flutter.bat" (
        echo Found Flutter at %USERPROFILE%\development\flutter\bin\flutter.bat
        %USERPROFILE%\development\flutter\bin\flutter.bat pub get
    ) else (
        echo.
        echo Flutter SDK is not yet installed or added to PATH.
        echo To install Flutter on Windows:
        echo   1. Download Flutter SDK from https://docs.flutter.dev/get-started/install/windows
        echo   2. Extract to C:\src\flutter (or C:\flutter)
        echo   3. Add C:\flutter\bin to your User Environment PATH variable
        echo   4. Re-run this script to download all packages.
    )
)

echo.
pause

