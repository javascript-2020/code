


# === CONFIG ===
$Username   = "your-github-username"
$Token      = "ghp_your_token_here"
$BackupRoot = "/work/github/tmp/"
$DateStamp  = Get-Date -Format "yyyy-MM-dd"
$ZipPath    = "/work/github/backup/github_$DateStamp.zip"

# === SETUP ===
if (!(Test-Path $BackupRoot)) {
    New-Item -ItemType Directory -Path $BackupRoot | Out-Null
}
Set-Location $BackupRoot

# === FETCH REPOS ===
$Headers = @{ Authorization = "token $Token" }
$Repos   = Invoke-RestMethod -Uri "https://api.github.com/user/repos?per_page=100" -Headers $Headers

foreach ($Repo in $Repos) {
    $CloneUrl = $Repo.clone_url
    $Name     = $Repo.name
    $Target   = "$BackupRoot\$Name.git"

    if (!(Test-Path $Target)) {
        Write-Host "Backing up $Name..."
        git clone --mirror $CloneUrl $Target
    } else {
        Write-Host "$Name already backed up. Skipping."
    }
}

# === ZIP THE BACKUP ===
Write-Host "`nCompressing backup to $ZipPath..."
Compress-Archive -Path "$BackupRoot\*" -DestinationPath $ZipPath -Force

# === DELETE RAW FOLDERS ===
Write-Host "`nCleaning up raw .git folders..."
Get-ChildItem -Path $BackupRoot -Directory | ForEach-Object {
    Remove-Item $_.FullName -Recurse -Force
}

Write-Host "`n✅ Backup complete. Archive saved as $ZipPath"