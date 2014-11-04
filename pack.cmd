@echo off
CALL del *.tgz >nul 2>&1
#CALL npm version patch
ECHO Version set
CALL npm pack
ECHO Package packed