$ErrorActionPreference = "Stop"

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
}

Write-Host "Launching Chrome in background with remote debugging on port 9222..."
$chromeProcess = Start-Process -FilePath $chromePath -ArgumentList "--headless=new --remote-debugging-port=9222 --user-data-dir=`"$env:TEMP\chrome-p2-profile`" `"about:blank`"" -PassThru

try {
    Start-Sleep -Seconds 2
    Write-Host "Executing CDP capture script..."
    pnpm exec tsx scripts/capture-p2-screens.ts
} finally {
    Write-Host "Cleaning up Chrome browser..."
    if ($chromeProcess -and -not $chromeProcess.HasExited) {
        Stop-Process -Id $chromeProcess.Id -Force
    }
}
