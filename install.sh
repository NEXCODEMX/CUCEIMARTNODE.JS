#!/bin/bash

# Script de instalación automatizada para CUCEI MART
# Desarrollado por NEXCODE

echo "╔═══════════════════════════════════════════════╗"
echo "║   CUCEI MART - Instalación Automatizada     ║"
echo "║          Desarrollado por NEXCODE            ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar Node.js
echo -e "${BLUE}[1/6]${NC} Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js no está instalado${NC}"
    echo "Por favor, instala Node.js 18.x o superior desde: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js encontrado: ${NODE_VERSION}${NC}"

# Verificar npm
echo -e "${BLUE}[2/6]${NC} Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm no está instalado${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm encontrado: v${NPM_VERSION}${NC}"

# Instalar dependencias
echo -e "${BLUE}[3/6]${NC} Instalando dependencias..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencias instaladas correctamente${NC}"
else
    echo -e "${RED}✗ Error instalando dependencias${NC}"
    exit 1
fi

# Crear archivo .env si no existe
echo -e "${BLUE}[4/6]${NC} Configurando variables de entorno..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Archivo .env creado${NC}"
    echo -e "${YELLOW}⚠ Por favor, configura las variables en el archivo .env${NC}"
else
    echo -e "${YELLOW}⚠ El archivo .env ya existe${NC}"
fi

# Crear directorio de imágenes si no existe
echo -e "${BLUE}[5/6]${NC} Verificando estructura de directorios..."
mkdir -p public/img
echo -e "${GREEN}✓ Directorios verificados${NC}"

# Resumen de instalación
echo ""
echo -e "${BLUE}[6/6]${NC} Instalación completada"
echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║           Instalación Exitosa                ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Para iniciar el servidor:${NC}"
echo ""
echo "  Modo desarrollo (con auto-reload):"
echo -e "  ${YELLOW}npm run dev${NC}"
echo ""
echo "  Modo producción:"
echo -e "  ${YELLOW}npm start${NC}"
echo ""
echo "El servidor estará disponible en: http://localhost:3000"
echo ""
echo -e "${BLUE}Documentación completa:${NC} README.md"
echo ""
echo "Desarrollado con 💙 por NEXCODE"
echo ""
