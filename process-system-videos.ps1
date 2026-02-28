param(
    [switch]$Mobile
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$rawDir = Join-Path $root "assets/system-evolution/raw"
$outputDir = Join-Path $root "public/frames/system-evolution"
$outputSmDir = Join-Path $root "public/frames-sm/system-evolution"

function Assert-LastExitCode([string]$ToolName) {
    if ($LASTEXITCODE -ne 0) {
        throw "$ToolName failed with exit code $LASTEXITCODE"
    }
}

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    throw "Missing dependency: ffmpeg"
}

if (-not (Get-Command cwebp -ErrorAction SilentlyContinue)) {
    throw "Missing dependency: cwebp"
}

New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

Write-Host "Merging clips into cinematic master..."
Push-Location $rawDir
$runtimeMerge = Join-Path $rawDir "merge-runtime.txt"
@(
    "file 'making-of-panel.mp4'"
    "file 'panel-to-inverter.mp4'"
    "file 'inverter-to-battery.mp4'"
    "file 'battery-to-system.mp4'"
) | Set-Content -Path $runtimeMerge -Encoding ASCII

ffmpeg -y -f concat -safe 0 -i "merge-runtime.txt" -c copy "system-evolution-master.mp4" | Out-Null
Assert-LastExitCode "ffmpeg (merge)"
Remove-Item -Path $runtimeMerge -Force -ErrorAction SilentlyContinue
Pop-Location

Write-Host "Extracting 1920px PNG frames at 30fps..."
Get-ChildItem -Path $rawDir -Filter "frame_*.png" -ErrorAction SilentlyContinue | Remove-Item -Force
Push-Location $rawDir
ffmpeg -y -i "system-evolution-master.mp4" -vf "fps=30,scale=1920:-1" -frames:v 600 "frame_%04d.png" | Out-Null
Assert-LastExitCode "ffmpeg (extract)"
Pop-Location

Write-Host "Converting PNG -> WebP and moving to /public/frames/system-evolution..."
Get-ChildItem -Path $outputDir -Filter "frame_*.webp" -ErrorAction SilentlyContinue | Remove-Item -Force
Get-ChildItem -Path $rawDir -Filter "frame_*.png" | ForEach-Object {
    $target = Join-Path $outputDir ($_.BaseName + ".webp")
    cwebp -quiet -q 80 $_.FullName -o $target | Out-Null
    Assert-LastExitCode "cwebp (convert $($_.Name))"
}
Get-ChildItem -Path $rawDir -Filter "frame_*.png" -ErrorAction SilentlyContinue | Remove-Item -Force

if ($Mobile) {
    New-Item -ItemType Directory -Force -Path $outputSmDir | Out-Null
    Get-ChildItem -Path $outputSmDir -Filter "frame_*.webp" -ErrorAction SilentlyContinue | Remove-Item -Force

    Write-Host "Generating optional mobile sequence at 1280px..."
    Push-Location $rawDir
    ffmpeg -y -i "system-evolution-master.mp4" -vf "fps=30,scale=1280:-1" -frames:v 600 "frame_%04d.webp" | Out-Null
    Assert-LastExitCode "ffmpeg (mobile extract)"
    Pop-Location

    Get-ChildItem -Path $rawDir -Filter "frame_*.webp" | Move-Item -Destination $outputSmDir -Force
}

Write-Host "Done. Frames available at /public/frames/system-evolution"
