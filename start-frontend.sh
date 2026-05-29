#!/bin/bash
# Arranca el frontend de la app de recetas usando el Node del sistema
export PATH="/usr/bin:/usr/local/bin:$PATH"
cd /home/exodous/app-recetas/frontend
echo "Node: $(node --version)"
echo "npm: $(npm --version)"
npx expo start --web