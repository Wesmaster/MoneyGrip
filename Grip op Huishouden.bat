@echo off
if not exist C:\GoH\database\NUL mkdir C:\GoH\database
cd C:/GoH
curl -LJO https://raw.github.com/WesMaster/goh/develop/docker-compose.yml
docker-compose up -d
timeout /t 20
start chrome.exe "http://localhost:86"