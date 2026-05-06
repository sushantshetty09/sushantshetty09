$ErrorActionPreference = "Stop"
$sdkDir = "C:\Users\susha\AppData\Local\Android\Sdk"

Write-Host "Creating Android SDK Directory..."
if (!(Test-Path $sdkDir)) {
    New-Item -ItemType Directory -Force -Path $sdkDir | Out-Null
}

$cmdlineToolsDir = "$sdkDir\cmdline-tools"
if (!(Test-Path $cmdlineToolsDir)) {
    New-Item -ItemType Directory -Force -Path $cmdlineToolsDir | Out-Null
}

$zipPath = "$env:TEMP\cmdline-tools.zip"
if (!(Test-Path "$cmdlineToolsDir\latest\bin\sdkmanager.bat")) {
    Write-Host "Downloading Android Command Line Tools..."
    Invoke-WebRequest -Uri "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip" -OutFile $zipPath
    
    Write-Host "Extracting..."
    Expand-Archive -Path $zipPath -DestinationPath $cmdlineToolsDir -Force
    
    # Rename cmdline-tools to latest
    if (Test-Path "$cmdlineToolsDir\latest") {
        Remove-Item -Recurse -Force "$cmdlineToolsDir\latest"
    }
    Rename-Item -Path "$cmdlineToolsDir\cmdline-tools" -NewName "latest"
}

$env:ANDROID_HOME = $sdkDir
$sdkmanager = "$cmdlineToolsDir\latest\bin\sdkmanager.bat"

Write-Host "Accepting licenses and installing SDK packages (this may take a few minutes)..."
# Accept licenses automatically
cmd.exe /c "echo y | $sdkmanager `"platform-tools`" `"platforms;android-34`" `"build-tools;34.0.0`""

Write-Host "SDK Installation Complete! Please restart your terminal so ANDROID_HOME is recognized."
