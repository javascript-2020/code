


# === CONFIG ===
$Username   = "your-github-username"
$Token      = Read-Host -Prompt "Enter your GitHub Personal Access Token"
$BackupRoot = "/work/github/tmp/"
$DateStamp  = Get-Date -Format "yyyy-MM-dd_HH-mm"
$ZipPath    = "/work/github/backup/github-files_$DateStamp.zip"

# === SETUP ===
if (!(Test-Path $BackupRoot)) {
    New-Item -ItemType Directory -Path $BackupRoot | Out-Null
}
Set-Location $BackupRoot

# === FETCH REPOS ===
$Headers = @{ Authorization = "token $Token" }
$Repos   = Invoke-RestMethod -Uri "https://api.github.com/user/repos?per_page=100" -Headers $Headers

foreach ($Repo in $Repos) {
    #$Name       = $Repo.name
    #$DefaultRef = $Repo.default_branch
    #$ZipUrl     = "https://github.com/$Username/$Name/archive/refs/heads/$DefaultRef.zip"
    #$OutFile    = "$BackupRoot$Name-$DefaultRef.zip"


    #Write-Host "`nrepo archive $($Repo.archive_url)"
    #$RawUrl = $Repo.archive_url -replace '{/archive_format}{/ref}', "zipball/$($Repo.default_branch)"
    #Write-Host "`nrawurl $RawUrl"
    #$OutFile = "$BackupRoot$($Repo.name)-$($Repo.default_branch).zip"
    #Write-Host "`noutfile $OutFile"
    
    
    $Name       = $Repo.name
    $Branch     = $Repo.default_branch
    $FullName   = $Repo.full_name  # e.g., "username/reponame"
    $ZipUrl     = "https://api.github.com/repos/$FullName/zipball/$Branch"
    $OutFile    = "$BackupRoot$Name-$Branch.zip"

    
    
    
    
    #Write-Host "Downloading $($Repo.name)..."
    #Invoke-WebRequest -Uri $RawUrl -Headers $Headers -OutFile $OutFile




    Write-Host "Downloading $Name ($DefaultRef)..."
    Invoke-WebRequest -Uri $ZipUrl -OutFile $OutFile
}

# === ZIP THE WHOLE BATCH ===
Write-Host "`nCompressing all repo zips into $ZipPath..."
Compress-Archive -Path "$BackupRoot\*" -DestinationPath $ZipPath -Force

# === CLEANUP ===
Write-Host "`nCleaning up individual repo zips..."
Get-ChildItem -Path $BackupRoot -Filter *.zip | Remove-Item -Force

Write-Host "`nBackup complete. Archive saved as $ZipPath"