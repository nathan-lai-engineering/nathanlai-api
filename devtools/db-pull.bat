@echo off
echo Opening temporary SSH tunnel to Hetzner Postgres...
start "db-tunnel" /min ssh -i "C:\Users\nlai2\Desktop\Repos\hetzner" -N -L 5432:localhost:5432 root@5.78.198.252

echo Waiting for tunnel to establish...
timeout /t 3 /nobreak >nul

echo Running npm run db:pull...
call npm run db:pull

echo Closing tunnel...
taskkill /FI "WINDOWTITLE eq db-tunnel*" /T /F >nul 2>&1

echo Done.
pause
