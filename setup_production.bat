@echo off
REM Ishu Tools - Production Setup Script for Windows
REM This script sets up the production environment for Ishu Tools

echo =========================================
echo Ishu Tools - Production Setup
echo =========================================
echo.

REM Check Python version
echo Checking Python version...
python --version
if %ERRORLEVEL% NEQ 0 (
    echo Error: Python not found. Please install Python 3.9+
    pause
    exit /b 1
)
echo.

REM Install Python dependencies
echo Installing Python dependencies...
cd backend
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

if %ERRORLEVEL% EQU 0 (
    echo [32mPython dependencies installed successfully[0m
) else (
    echo [31mError installing Python dependencies[0m
    pause
    exit /b 1
)

echo.

REM Check for system dependencies
echo Checking system dependencies...

REM Check for Tesseract
where tesseract >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [32mTesseract OCR found[0m
) else (
    echo [33mTesseract OCR not found (required for OCR tools)[0m
    echo    Download: https://github.com/UB-Mannheim/tesseract/wiki
)

REM Check for Poppler
where pdfinfo >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [32mPoppler found[0m
) else (
    echo [33mPoppler not found (required for PDF to image conversion)[0m
    echo    Download: https://github.com/oschwartz10612/poppler-windows/releases
)

REM Check for LibreOffice
where soffice >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [32mLibreOffice found[0m
) else (
    echo [33mLibreOffice not found (required for Office conversions)[0m
    echo    Download: https://www.libreoffice.org/download/
)

echo.
echo =========================================
echo Setup Complete!
echo =========================================
echo.
echo Next steps:
echo 1. Start the backend server:
echo    cd backend ^&^& python run.py
echo.
echo 2. Test the API:
echo    curl http://localhost:8000/health
echo.
echo 3. Check implementation status:
echo    type ..\IMPLEMENTATION_STATUS.md
echo.
echo =========================================
pause
