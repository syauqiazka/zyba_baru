$ErrorActionPreference = "Stop"

$chromePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
}

$profileDir = "$env:TEMP\chrome-overhaul-$([System.Guid]::NewGuid().ToString('N'))"
New-Item -ItemType Directory -Path $profileDir -Force | Out-Null

Write-Host "Starting Chrome from $chromePath with profile in $profileDir on port 9225..."
$chromeProcess = Start-Process -FilePath $chromePath -ArgumentList "--headless=new --remote-debugging-port=9225 --user-data-dir=`"$profileDir`" --no-first-run --no-default-browser-check `"about:blank`"" -PassThru

try {
    $maxRetries = 10
    $ready = $false
    for ($i = 0; $i -lt $maxRetries; $i++) {
        Start-Sleep -Seconds 1
        try {
            $testRes = Invoke-RestMethod -Uri "http://127.0.0.1:9225/json" -TimeoutSec 1 -ErrorAction Stop
            if ($testRes) {
                $ready = $true
                break
            }
        } catch {}
    }
    if (-not $ready) {
        throw "Chrome debugging port 9225 did not become ready in time"
    }
    Write-Host "Chrome debugging port ready. Running capture script..."
    pnpm exec tsx scripts/capture-all-screens.ts
} finally {
    Write-Host "Shutting down Chrome..."
    if ($chromeProcess -and -not $chromeProcess.HasExited) {
        $chromeProcess.Kill()
    }
}

