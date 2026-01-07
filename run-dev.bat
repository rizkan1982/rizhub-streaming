@echo off
echo ╔═══════════════════════════════════════════╗
echo ║  🎬 LustPress Cinema - Development Mode  ║
echo ╚═══════════════════════════════════════════╝
echo.
echo Starting backend and frontend servers...
echo.

REM Start backend in new window
start "Backend Server" cmd /k "cd backend && npm run start:dev"

REM Wait 3 seconds
timeout /t 3 /nobreak >nul

REM Start frontend in new window
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting!
echo 📝 Check the new windows for server logs
echo.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause >nul

