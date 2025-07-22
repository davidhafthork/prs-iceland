@echo off
REM PRS Iceland Cleanup Helper for Windows
REM Run from project root: cleanup-helper.bat

echo PRS Iceland Cleanup Helper (Windows)
echo ====================================
echo.

REM Check if we're in the right directory
if not exist "css" (
    echo Error: Please run this script from the project root directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

if not exist "docs" (
    echo Error: Please run this script from the project root directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

REM Create archive directories
echo Creating archive directories...
if not exist "docs\archive\gallery-fixes" mkdir "docs\archive\gallery-fixes"
if not exist "docs\archive\design-fixes" mkdir "docs\archive\design-fixes"
if not exist "docs\archive\css-backups" mkdir "docs\archive\css-backups"

REM Move gallery fix files
echo.
echo Moving gallery fix documentation...
for %%f in (docs\GALLERY-*.md) do (
    if exist "%%f" (
        echo   Moving: %%f
        move "%%f" "docs\archive\gallery-fixes\" >nul
    )
)

REM Move other fix files
echo.
echo Moving other fix documentation...
if exist "docs\ABOUT-SECTION-FIX.md" (
    echo   Moving: docs\ABOUT-SECTION-FIX.md
    move "docs\ABOUT-SECTION-FIX.md" "docs\archive\design-fixes\" >nul
)

if exist "docs\FIX-SUMMARY.md" (
    echo   Moving: docs\FIX-SUMMARY.md
    move "docs\FIX-SUMMARY.md" "docs\archive\design-fixes\" >nul
)

if exist "docs\CLEANUP-COMPLETE.md" (
    echo   Moving: docs\CLEANUP-COMPLETE.md
    move "docs\CLEANUP-COMPLETE.md" "docs\archive\design-fixes\" >nul
)

REM Move backup CSS files
echo.
echo Moving backup CSS files...
for %%f in (docs\backup-*.css) do (
    if exist "%%f" (
        echo   Moving: %%f
        move "%%f" "docs\archive\css-backups\" >nul
    )
)

REM Summary
echo.
echo Cleanup Complete!
echo =================
echo.
echo Files have been organized into:
echo   - docs\archive\gallery-fixes\ (gallery-related fixes)
echo   - docs\archive\design-fixes\ (other fix attempts)
echo   - docs\archive\css-backups\ (CSS backup files)
echo.
echo Next steps:
echo 1. Review the cleanup summary: docs\CLEANUP-SUMMARY-2025.md
echo 2. Start local server: python -m http.server 8000
echo 3. Test the new color system: http://localhost:8000/test/tactical-color-test.html
echo 4. Continue with Phase 2 of the refactoring
echo.
echo Note: Original CSS files in css\ directory are kept for now.
echo They will be removed after the refactoring is complete and tested.
echo.
pause