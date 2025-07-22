@echo off
REM AGGRESSIVE CLEANUP - PRS Iceland
REM This will archive 30+ documentation files!

echo ============================================
echo    AGGRESSIVE CLEANUP - PRS Iceland
echo ============================================
echo.
echo WARNING: This will archive 30+ documentation files!
echo Only essential files for refactoring will remain.
echo.
set /p confirm="Are you sure? Type YES to continue: "
if not "%confirm%"=="YES" (
    echo Cleanup cancelled.
    pause
    exit /b
)

echo.
echo Creating archive directories...

REM Create all archive directories at once
mkdir "docs\archive" 2>nul
mkdir "docs\archive\old-fixes" 2>nul
mkdir "docs\archive\gallery-attempts" 2>nul
mkdir "docs\archive\css-backups" 2>nul
mkdir "docs\archive\demos" 2>nul
mkdir "docs\archive\old-plans" 2>nul
mkdir "docs\archive\old-docs" 2>nul
mkdir "docs\archive\scripts" 2>nul
mkdir "docs\archive\test-files" 2>nul
mkdir "docs\archive\workflow" 2>nul

echo.
echo Moving files to archive...

REM Move fix-related files
echo   - Moving fix documentation...
if exist "docs\ABOUT-SECTION-FIX.md" move "docs\ABOUT-SECTION-FIX.md" "docs\archive\old-fixes\" >nul 2>&1
if exist "docs\FIX-SUMMARY.md" move "docs\FIX-SUMMARY.md" "docs\archive\old-fixes\" >nul 2>&1
if exist "docs\CLEANUP-COMPLETE.md" move "docs\CLEANUP-COMPLETE.md" "docs\archive\old-fixes\" >nul 2>&1

REM Move all gallery files
echo   - Moving gallery documentation (11 files)...
for %%f in (docs\GALLERY-*.md) do (
    if exist "%%f" move "%%f" "docs\archive\gallery-attempts\" >nul 2>&1
)

REM Move CSS backups
echo   - Moving CSS backup files...
for %%f in (docs\backup-*.css) do (
    if exist "%%f" move "%%f" "docs\archive\css-backups\" >nul 2>&1
)

REM Move demo files
echo   - Moving demo files...
if exist "docs\google-sheets-demo.html" move "docs\google-sheets-demo.html" "docs\archive\demos\" >nul 2>&1
if exist "docs\template-google-docs.html" move "docs\template-google-docs.html" "docs\archive\demos\" >nul 2>&1

REM Move old planning docs
echo   - Moving old planning documentation...
if exist "docs\CSS-ARCHITECTURE.md" move "docs\CSS-ARCHITECTURE.md" "docs\archive\old-plans\" >nul 2>&1
if exist "docs\DATA-FIRST-IMPLEMENTATION.md" move "docs\DATA-FIRST-IMPLEMENTATION.md" "docs\archive\old-plans\" >nul 2>&1
if exist "docs\FINAL-STRUCTURE.md" move "docs\FINAL-STRUCTURE.md" "docs\archive\old-plans\" >nul 2>&1
if exist "docs\REFACTORING-NOTES.md" move "docs\REFACTORING-NOTES.md" "docs\archive\old-plans\" >nul 2>&1

REM Move README files
echo   - Moving old README files...
if exist "docs\README-GOOGLE-SHEETS.md" move "docs\README-GOOGLE-SHEETS.md" "docs\archive\old-docs\" >nul 2>&1
if exist "docs\README-NAVIGATION.md" move "docs\README-NAVIGATION.md" "docs\archive\old-docs\" >nul 2>&1

REM Move scripts
echo   - Moving scripts...
if exist "docs\cleanup-helper.sh" move "docs\cleanup-helper.sh" "docs\archive\scripts\" >nul 2>&1

REM Move subdirectories
echo   - Moving subdirectories...
if exist "docs\test-files" (
    xcopy "docs\test-files\*" "docs\archive\test-files\" /E /I /Y >nul 2>&1
    rmdir "docs\test-files" /S /Q 2>nul
)
if exist "docs\workflow" (
    xcopy "docs\workflow\*" "docs\archive\workflow\" /E /I /Y >nul 2>&1
    rmdir "docs\workflow" /S /Q 2>nul
)

REM Create archive README
echo   - Creating archive README...
(
echo # Documentation Archive
echo.
echo This archive contains all historical documentation from the PRS Iceland project.
echo Archived on: %date% %time%
echo.
echo ## Contents:
echo - `old-fixes/` - Various fix attempts and patches
echo - `gallery-attempts/` - All gallery-related fixes (11+ files^)
echo - `css-backups/` - CSS backup files
echo - `demos/` - Demo HTML files
echo - `old-plans/` - Previous architecture plans
echo - `old-docs/` - Old README files
echo - `scripts/` - Utility scripts
echo - `test-files/` - Test file directory
echo - `workflow/` - Workflow documentation
echo.
echo These files are preserved for reference but are no longer actively used.
) > "docs\archive\README.md"

echo.
echo ============================================
echo          CLEANUP COMPLETE!
echo ============================================
echo.
echo Remaining files in docs/:
echo.
dir /B docs\*.md 2>nul | findstr /V "^archive$"
echo.
echo All other files have been moved to docs\archive\
echo.
echo Next steps:
echo 1. Review remaining files in docs\
echo 2. Continue with Phase 2 of refactoring
echo 3. Delete archive after project completion (optional)
echo.
pause