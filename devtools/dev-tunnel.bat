@echo off
echo Opening SSH tunnel to Hetzner Postgres (localhost:5432 -^> node's loopback:5432)
echo Leave this window open while developing locally. Press Ctrl+C to close the tunnel.
where ssh
ssh -v -i "C:\Users\nlai2\Desktop\Repos\hetzner" -N -L 5432:localhost:5432 root@5.78.198.252
pause
