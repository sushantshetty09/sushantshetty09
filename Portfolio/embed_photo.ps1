#!/usr/bin/env pwsh
# Run this after placing IMG_20260415_010048.jpg in the Portfolio folder.
# It'll embed the photo as base64 directly in index.html.

$portfolioDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$imgPath = Join-Path $portfolioDir "IMG_20260415_010048.jpg"
$htmlPath = Join-Path $portfolioDir "index.html"

if (-not (Test-Path $imgPath)) {
    Write-Host "ERROR: Photo not found at: $imgPath" -ForegroundColor Red
    Write-Host "Please copy IMG_20260415_010048.jpg into the Portfolio folder and run this script again."
    exit 1
}

Write-Host "Reading image..." -ForegroundColor Cyan
$bytes = [IO.File]::ReadAllBytes($imgPath)
$b64 = [Convert]::ToBase64String($bytes)
$dataUrl = "data:image/jpeg;base64,$b64"

Write-Host "Reading HTML..." -ForegroundColor Cyan
$html = [IO.File]::ReadAllText($htmlPath)

# Replace the src attribute
$old = 'src="IMG_20260415_010048.jpg"'
$new = "src=`"$dataUrl`""

if ($html.Contains($old)) {
    $html = $html.Replace($old, $new)
    [IO.File]::WriteAllText($htmlPath, $html, [Text.Encoding]::UTF8)
    Write-Host "SUCCESS: Photo embedded as base64 in index.html!" -ForegroundColor Green
    Write-Host "File size: $([Math]::Round((Get-Item $htmlPath).Length / 1MB, 1)) MB"
} else {
    Write-Host "Could not find the placeholder src in HTML. Already embedded?" -ForegroundColor Yellow
}
