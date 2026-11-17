Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  AIoT Smart Socket - Downloading Flutter Packages" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$flutterCmd = Get-Command flutter -ErrorAction SilentlyContinue

if ($flutterCmd) {
    Write-Host "[OK] Flutter found in PATH ($($flutterCmd.Source))." -ForegroundColor Green
    Write-Host "Running flutter pub get..." -ForegroundColor Yellow
    flutter pub get
    Write-Host "[SUCCESS] Packages downloaded successfully!" -ForegroundColor Green
    exit 0
}

$commonPaths = @(
    "C:\flutter\bin\flutter.bat",
    "C:\src\flutter\bin\flutter.bat",
    "$HOME\flutter\bin\flutter.bat",
    "$HOME\development\flutter\bin\flutter.bat",
    "$env:LOCALAPPDATA\flutter\bin\flutter.bat"
)

$found = $null
foreach ($path in $commonPaths) {
    if (Test-Path $path) {
        $found = $path
        break
    }
}

if ($found) {
    Write-Host "[OK] Found Flutter SDK at $found" -ForegroundColor Green
    Write-Host "Running pub get..." -ForegroundColor Yellow
    & $found pub get
    Write-Host "[SUCCESS] Packages downloaded successfully!" -ForegroundColor Green
} else {
    Write-Host "[!] Flutter command not found in PATH." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To install Flutter on Windows:" -ForegroundColor White
    Write-Host "  1. Download Flutter SDK: https://docs.flutter.dev/get-started/install/windows" -ForegroundColor White
    Write-Host "  2. Extract to C:\src\flutter or C:\flutter" -ForegroundColor White
    Write-Host "  3. Add C:\flutter\bin to your User Environment PATH variable" -ForegroundColor White
    Write-Host "  4. Run 'flutter pub get' inside the smart-socket folder" -ForegroundColor White
}

