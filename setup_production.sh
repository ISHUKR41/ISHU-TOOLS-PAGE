#!/bin/bash

# Ishu Tools - Production Setup Script
# This script sets up the production environment for Ishu Tools

echo "========================================="
echo "Ishu Tools - Production Setup"
echo "========================================="
echo ""

# Check Python version
echo "Checking Python version..."
python_version=$(python --version 2>&1 | awk '{print $2}')
echo "Python version: $python_version"

if [[ ! "$python_version" =~ ^3\.(9|10|11|12) ]]; then
    echo "⚠️  Warning: Python 3.9+ is recommended"
fi

echo ""

# Install Python dependencies
echo "Installing Python dependencies..."
cd backend
pip install --upgrade pip
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Python dependencies installed successfully"
else
    echo "❌ Error installing Python dependencies"
    exit 1
fi

echo ""

# Check for system dependencies
echo "Checking system dependencies..."

# Check for Tesseract
if command -v tesseract &> /dev/null; then
    tesseract_version=$(tesseract --version 2>&1 | head -n 1)
    echo "✅ Tesseract OCR: $tesseract_version"
else
    echo "⚠️  Tesseract OCR not found (required for OCR tools)"
    echo "   Install: https://github.com/tesseract-ocr/tesseract"
fi

# Check for Poppler (pdfinfo/pdftoppm)
if command -v pdfinfo &> /dev/null; then
    poppler_version=$(pdfinfo -v 2>&1 | head -n 1)
    echo "✅ Poppler: $poppler_version"
else
    echo "⚠️  Poppler not found (required for PDF to image conversion)"
    echo "   Install: https://poppler.freedesktop.org/"
fi

# Check for LibreOffice
if command -v soffice &> /dev/null || command -v libreoffice &> /dev/null; then
    echo "✅ LibreOffice found"
else
    echo "⚠️  LibreOffice not found (required for Office conversions)"
    echo "   Install: https://www.libreoffice.org/download/"
fi

echo ""
echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Start the backend server:"
echo "   cd backend && python run.py"
echo ""
echo "2. Test the API:"
echo "   curl http://localhost:8000/health"
echo ""
echo "3. Check implementation status:"
echo "   cat ../IMPLEMENTATION_STATUS.md"
echo ""
echo "========================================="
