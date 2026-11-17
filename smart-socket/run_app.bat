@echo off
set "PATH=C:\src\flutter\bin;%PATH%"
set "JAVA_TOOL_OPTIONS=-Djava.net.preferIPv4Stack=true"

echo ========================================================
echo   Launching Smart Socket Flutter App
echo ========================================================
echo.

flutter devices

echo.
echo Launching on Android Emulator (emulator-5554)...
echo (To target a different device, press Ctrl+C and run: flutter run -d chrome)
echo.

flutter run -d emulator-5554

pause
