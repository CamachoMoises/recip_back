#!/bin/bash
source /home/recipatc/nodevenv/recip_back/18/bin/activate
cd /home/recipatc/recip_back
git pull origin main
npm install
pm2 restart recip_back --update-env
pm2 save
echo "✅ Deploy completado"
       