# scripts/verify-viewports.ps1
$ErrorActionPreference = "Stop"

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
}

$screenshotDir = "e:\syauqi\zyba_baru\screenshots\p0-fondasi"
$artifactDir = "C:\Users\user\.gemini\antigravity\brain\5d3a96b3-8079-4892-abbc-61555dec3330\p0-fondasi"

New-Item -ItemType Directory -Force -Path $screenshotDir | Out-Null
New-Item -ItemType Directory -Force -Path $artifactDir | Out-Null

$port = 3005
Write-Host "Starting next start on port $port..."
$serverProcess = Start-Process -FilePath "node" -ArgumentList "node_modules/next/dist/bin/next start -p $port" -PassThru -NoNewWindow

try {
    # Wait for server to be responsive
    $ready = $false
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Seconds 1
        try {
            $resp = Invoke-WebRequest -Uri "http://localhost:$port/dashboard" -UseBasicParsing -TimeoutSec 2
            if ($resp.StatusCode -eq 200) {
                $ready = $true
                break
            }
        } catch {
            # Still starting
        }
    }

    if (-not $ready) {
        throw "Server did not become ready in 30 seconds"
    }

    Write-Host "Server is ready! Capturing screenshots..."

    $viewports = @(
        @{ Width = 375; Height = 667; Name = "viewport-375-mobile" },
        @{ Width = 768; Height = 1024; Name = "viewport-768-tablet" },
        @{ Width = 1280; Height = 800; Name = "viewport-1280-desktop" }
    )

    foreach ($vp in $viewports) {
        $outFile = Join-Path $screenshotDir "$($vp.Name).png"
        $artFile = Join-Path $artifactDir "$($vp.Name).png"
        $windowSize = "$($vp.Width),$($vp.Height)"
        
        Write-Host "Capturing $($vp.Name) at $windowSize..."
        $proc = Start-Process -FilePath $chromePath -ArgumentList "--headless=new --screenshot=`"$outFile`" --window-size=$windowSize --hide-scrollbars http://localhost:$port/dashboard" -PassThru -Wait
        
        Copy-Item -Path $outFile -Destination $artFile -Force
        Write-Host "Saved: $outFile"
    }

    Write-Host "All screenshots successfully captured!"
} finally {
    Write-Host "Stopping Next.js server..."
    if ($serverProcess -and -not $serverProcess.HasExited) {
        Stop-Process -Id $serverProcess.Id -Force
    }
}

