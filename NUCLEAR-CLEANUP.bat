@echo off
REM NUCLEAR CLEANUP - Remove ALL clutter from PRS Iceland project
REM This will move/delete all unnecessary files

echo ================================================
echo    NUCLEAR CLEANUP - PRS Iceland
echo    Removing ALL clutter from project root
echo ================================================
echo.

REM Create archive directories if they don't exist
mkdir docs\archive\root-clutter 2>nul
mkdir docs\archive\old-scripts 2>nul
mkdir docs\archive\old-tests 2>nul

echo Moving clutter from root directory...

REM Move all those annoying .md files from root to archive
move FIX-IMAGES-CORS.md docs\archive\root-clutter\ 2>nul
move FIXES-APPLIED.md docs\archive\root-clutter\ 2>nul
move IMAGES-FIXED.md docs\archive\root-clutter\ 2>nul
move MANUAL-IMAGE-FIX.md docs\archive\root-clutter\ 2>nul
move QUICK-START.md docs\archive\root-clutter\ 2>nul
move SUCCESS.md docs\archive\root-clutter\ 2>nul
move TYPOGRAPHY-UPDATE.md docs\archive\root-clutter\ 2>nul
move WEBSITE-STATUS.md docs\archive\root-clutter\ 2>nul

REM Move all those random scripts
move download-images.ps1 docs\archive\old-scripts\ 2>nul
move download-images.sh docs\archive\old-scripts\ 2>nul
move download-real-images.bat docs\archive\old-scripts\ 2>nul
move fix-image-paths.js docs\archive\old-scripts\ 2>nul
move setup.bat docs\archive\old-scripts\ 2>nul
move start-website.bat docs\archive\old-scripts\ 2>nul
move server.js docs\archive\old-scripts\ 2>nul
move server.py docs\archive\old-scripts\ 2>nul

REM Move test HTML files that shouldn't be in root
move create-real-placeholders.html docs\archive\old-tests\ 2>nul
move generate-placeholders.html docs\archive\old-tests\ 2>nul

REM Delete the cleanup scripts themselves (no longer needed)
del cleanup-helper.bat 2>nul
del aggressive-cleanup.bat 2>nul

REM Clean up test directory duplicates
if exist test\brand-color-fix-test.html del test\brand-color-fix-test.html 2>nul
if exist test\logo-color-fix-test.html del test\logo-color-fix-test.html 2>nul
if exist test\logo-fix-test.html del test\logo-fix-test.html 2>nul
if exist test\logo-test.html del test\logo-test.html 2>nul

echo.
echo Cleaning up CSS directory...

REM Move temporary CSS fixes to archive
mkdir css\archive 2>nul
move css\logo-currentcolor-fix.css css\archive\ 2>nul
move css\logo-fix.css css\archive\ 2>nul

echo.
echo Final cleanup...

REM Remove any .bak or .tmp files
del /S *.bak 2>nul
del /S *.tmp 2>nul

REM Clean up docs folder
move docs\AGGRESSIVE-CLEANUP.md docs\archive\ 2>nul
move docs\cleanup-helper.sh docs\archive\old-scripts\ 2>nul

echo.
echo ================================================
echo    CLEANUP COMPLETE!
echo ================================================
echo.
echo Your project is now CLEAN!
echo.
echo Root directory now contains only:
dir /B /A:-D | findstr /V /I "\.git"
echo.
echo All clutter has been moved to:
echo - docs\archive\root-clutter\
echo - docs\archive\old-scripts\
echo - docs\archive\old-tests\
echo.
pause