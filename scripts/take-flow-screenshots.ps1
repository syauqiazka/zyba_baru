$ErrorActionPreference = "Stop"

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
    $edgePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
}

$profileDir = "$env:TEMP\edge-flow-$([System.Guid]::NewGuid().ToString('N'))"
New-Item -ItemType Directory -Path $profileDir -Force | Out-Null

$edgeProcess = $null

try {
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
    Write-Host "Edge CDP ready. Capturing flow verification across viewports..."
    pnpm exec tsx scripts/capture-verification-flow.ts
} finally {
    Write-Host "Cleaning up Edge process..."
    if ($edgeProcess -and -not $edgeProcess.HasExited) {
        $edgeProcess.Kill()
    }
    Remove-Item -Recurse -Force $profileDir -ErrorAction SilentlyContinue
    Write-Host "Done!"
}
