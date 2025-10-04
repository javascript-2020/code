

# Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
# Unblock-File -Path "C:\work\github-backup-files.ps1"


# === CONFIG ===
$Username   = Read-Host -Prompt "Enter GitHub UserName"
$Token      = Read-Host -Prompt "Enter your GitHub Personal Access Token"
$BackupRoot = "/work/github/backup/"
$BackupTmp = "$($BackupRoot)tmp/"
$DateStamp  = Get-Date -Format "yyyy-MM-dd_HH-mm"
$ZipPath = "$($BackupRoot)github-files_$DateStamp.zip"

# === SETUP ===
if (!(Test-Path $BackupRoot)) {
    New-Item -ItemType Directory -Path $BackupRoot -Force | Out-Null
}
if (!(Test-Path $BackupTmp)) {
    New-Item -ItemType Directory -Path $BackupTmp -Force | Out-Null
}
Set-Location $BackupRoot

# === FETCH REPOS ===
$Headers = @{ Authorization = "token $Token" }
$Repos   = Invoke-RestMethod -Uri "https://api.github.com/user/repos?per_page=100" -Headers $Headers

$ExcludedRepos = @("test-repo","demo-project")
$Repos = $Repos | Where-Object { $ExcludedRepos -notcontains $_.name }

foreach ($Repo in $Repos) {
  
    $Name       = $Repo.name
    $Branch     = $Repo.default_branch
    $FullName   = $Repo.full_name  # e.g., "username/reponame"
    $ZipUrl     = "https://api.github.com/repos/$FullName/zipball/$Branch"
    $OutFile    = "$BackupTmp$Name-$Branch.zip"

    Write-Host "Downloading $Name ($DefaultRef)..."
    Invoke-WebRequest -Uri $ZipUrl -OutFile $OutFile
}

# === ZIP THE WHOLE BATCH ===
Write-Host "`nCompressing all repo zips into $ZipPath..."
Compress-Archive -Path "$BackupRoot\*" -DestinationPath $ZipPath -Force

# === CLEANUP ===
Write-Host "`nCleaning up individual repo zips..."
Get-ChildItem -Path $BackupTmp -Filter *.zip | Remove-Item -Force

Write-Host "`nBackup complete. Archive saved as $ZipPath"





