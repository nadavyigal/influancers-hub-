# PowerShell script to push the Influencers Hub project to GitHub

Write-Host "Preparing to push Influencers Hub to GitHub..." -ForegroundColor Cyan

# Check if git is installed
try {
    git --version | Out-Null
    Write-Host "Git is installed. Proceeding..." -ForegroundColor Green
} catch {
    Write-Host "Git is not installed or not in PATH. Please install Git and try again." -ForegroundColor Red
    exit 1
}

# Check if the directory is already a git repository
if (Test-Path ".git") {
    Write-Host "Git repository already initialized." -ForegroundColor Green
} else {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to initialize git repository." -ForegroundColor Red
        exit 1
    }
    Write-Host "Git repository initialized successfully." -ForegroundColor Green
}

# Check if remote origin exists
$remoteExists = git remote -v | Select-String -Pattern "origin"
if ($remoteExists) {
    Write-Host "Remote 'origin' already exists." -ForegroundColor Green
} else {
    Write-Host "Adding remote 'origin'..." -ForegroundColor Yellow
    git remote add origin https://github.com/nadavyigal/influancers-hub-.git
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to add remote 'origin'." -ForegroundColor Red
        exit 1
    }
    Write-Host "Remote 'origin' added successfully." -ForegroundColor Green
}

# Add all files
Write-Host "Adding files to git..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to add files to git." -ForegroundColor Red
    exit 1
}
Write-Host "Files added successfully." -ForegroundColor Green

# Commit changes
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "Initial commit: Influencers Hub platform"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to commit changes." -ForegroundColor Red
    exit 1
}
Write-Host "Changes committed successfully." -ForegroundColor Green

# Determine default branch name
$defaultBranch = git branch --show-current
if (-not $defaultBranch) {
    $defaultBranch = "main"
}
Write-Host "Current branch is: $defaultBranch" -ForegroundColor Cyan

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin $defaultBranch
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to push to GitHub. You might need to authenticate or the repository might not exist." -ForegroundColor Red
    Write-Host "Please create the repository at https://github.com/nadavyigal/influancers-hub- if it doesn't exist." -ForegroundColor Yellow
    exit 1
}
Write-Host "Successfully pushed to GitHub!" -ForegroundColor Green
Write-Host "Your code is now available at: https://github.com/nadavyigal/influancers-hub-" -ForegroundColor Cyan 