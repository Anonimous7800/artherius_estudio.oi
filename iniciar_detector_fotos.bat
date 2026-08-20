@echo off
title DETECTOR AUTOMATICO DE RENDERS - ARTHERIUS STUDIO
color 0A
echo ========================================================
echo   ARTHERIUS STUDIO // DETECTOR AUTOMATICO DE FOTOS
echo ========================================================
echo.
echo Escaneando la carpeta "renders de participantes"...
echo Cada vez que pegues o agregues una foto, se actualizara
echo automaticamente la pagina de participantes al instante.
echo.
echo Presiona Ctrl + C para detener.
echo.
node watch_renders.js
pause
