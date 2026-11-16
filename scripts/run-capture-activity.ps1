$ErrorActionPreference = "Stop"

$nextProcess = Start-Process -FilePath "node" -ArgumentList "--require ./eperm-patch.js node_modules/next/dist/bin/next start -p 3005" -PassThru

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
    $edgePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
}

$profileDir = "$env:TEMP\edge-activity-$([System.Guid]::NewGuid().ToString('N'))"
New-Item -ItemType Directory -Path $profileDir -Force | Out-Null

$edgeProcess = $null

try {
    Write-Host "Waiting for Next.js on port 3005..."
    $serverReady = $false
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Milliseconds 500
        try {
            $res = Invoke-WebRequest -Uri "http://localhost:3005/" -TimeoutSec 1 -UseBasicParsing -ErrorAction SilentlyContinue
            if ($res -and $res.StatusCode -eq 200) {
                $serverReady = $true
                break
            }
        } catch {}
    }
    if (-not $serverReady) {
        throw "Next.js server on port 3005 failed to respond"
    }
    Write-Host "Next.js server is ready!"

    Write-Host "Starting Edge with remote debugging on port 9225..."
    $edgeProcess = Start-Process -FilePath $edgePath -ArgumentList "--headless=new --remote-debugging-port=9225 --user-data-dir=`"$profileDir`" --no-first-run --no-default-browser-check `"about:blank`"" -PassThru

    $cdpReady = $false
    for ($i = 0; $i -lt 15; $i++) {
        Start-Sleep -Milliseconds 500
        try {
            $testRes = Invoke-RestMethod -Uri "http://127.0.0.1:9225/json" -TimeoutSec 1 -ErrorAction SilentlyContinue
            if ($testRes) {
                $cdpReady = $true
                break
            }
        } catch {}
    }
    if (-not $cdpReady) {
        throw "Edge remote debugging on port 9225 did not become ready"
    }
    Write-Host "Edge CDP ready. Capturing activity page across viewports..."
    pnpm exec tsx scripts/capture-activity-viewports.ts
} finally {
    Write-Host "Cleaning up processes..."
    if ($edgeProcess -and -not $edgeProcess.HasExited) {
        $edgeProcess.Kill()
    }
    if ($nextProcess -and -not $nextProcess.HasExited) {
        $nextProcess.Kill()
    }
    Remove-Item -Recurse -Force $profileDir -ErrorAction SilentlyContinue
    Write-Host "Done!"
}
