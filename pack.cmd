@echo off
CALL del *.tgz >nul 2>&1
CALL npm pack
ECHO Package packed