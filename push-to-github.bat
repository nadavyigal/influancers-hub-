@echo off
echo Preparing to push Influencers Hub to GitHub...

REM Check if git is installed
git --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Git is not installed or not in PATH. Please install Git and try again.
    exit /b 1
)
echo Git is installed. Proceeding...

REM Check if the directory is already a git repository
if exist ".git" (
    echo Git repository already initialized.
) else (
    echo Initializing git repository...
    git init
    if %ERRORLEVEL% neq 0 (
        echo Failed to initialize git repository.
        exit /b 1
    )
    echo Git repository initialized successfully.
)

REM Check if remote origin exists
git remote -v | findstr "origin" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo Remote 'origin' already exists.
) else (
    echo Adding remote 'origin'...
    git remote add origin https://github.com/nadavyigal/influancers-hub-.git
    if %ERRORLEVEL% neq 0 (
        echo Failed to add remote 'origin'.
        exit /b 1
    )
    echo Remote 'origin' added successfully.
)

REM Add all files
echo Adding files to git...
git add .
if %ERRORLEVEL% neq 0 (
    echo Failed to add files to git.
    exit /b 1
)
echo Files added successfully.

REM Commit changes
echo Committing changes...
git commit -m "Initial commit: Influencers Hub platform"
if %ERRORLEVEL% neq 0 (
    echo Failed to commit changes.
    exit /b 1
)
echo Changes committed successfully.

REM Determine default branch name
for /f "tokens=*" %%a in ('git branch --show-current') do set defaultBranch=%%a
if "%defaultBranch%"=="" (
    set defaultBranch=main
)
echo Current branch is: %defaultBranch%

REM Push to GitHub
echo Pushing to GitHub...
git push -u origin %defaultBranch%
if %ERRORLEVEL% neq 0 (
    echo Failed to push to GitHub. You might need to authenticate or the repository might not exist.
    echo Please create the repository at https://github.com/nadavyigal/influancers-hub- if it doesn't exist.
    exit /b 1
)
echo Successfully pushed to GitHub!
echo Your code is now available at: https://github.com/nadavyigal/influancers-hub-

pause 