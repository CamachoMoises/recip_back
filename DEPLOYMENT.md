# recip_back — Deployment Guide (cPanel + LiteSpeed)

## Requirements

- cPanel hosting with LiteSpeed web server
- Node.js 18.x available in cPanel
- MySQL database already created and imported
- GitHub repository with the project

---

## 1. Clone the Repository

Navigate to home directory and initialize git inside the folder cPanel created:

```bash
cd ~/recip_back
git init
git remote add origin https://github.com/CamachoMoises/recip_back.git
git pull origin main
```

---

## 2. Create the `.env` File

```bash
nano ~/recip_back/.env
```

Add your environment variables:

```env
PORT=4000
DB_HOST_CLEVER=localhost
DB_PORT_CLEVER=3306
DB_NAME_CLEVER=your_db_name
DB_USER_CLEVER=your_db_user
DB_PASSWORD_CLEVER=your_db_password
SECRET_KEY=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ODOO_URL=https://odoo.com
ODOO_DB=your_odoo_db
ODOO_USER=your_odoo_user
ODOO_API_KEY=your_odoo_api_key
```

---

## 3. Install Dependencies via cPanel

1. Go to **cPanel → Node.js App Manager**
2. Select your app
3. Click **"Run NPM Install"**

> ⚠️ Do NOT run `npm install` manually — cPanel CloudLinux requires dependencies to be installed through its virtual environment.

---

## 4. Configure Apache/LiteSpeed Proxy

Create or edit the `.htaccess` file in the subdirectory that maps to your app URL:

```bash
nano ~/public_html/backend/.htaccess
```

Add:

```apache
RewriteEngine On
RewriteRule ^(.*)$ http://127.0.0.1:4000/$1 [P,L]
```

> This proxies all traffic from `recip360atc.com/backend` to your Node.js app running on port 4000.

---

## 5. Start the App with PM2

Enter the virtual environment and start with PM2:

```bash
source /home/recipatc/nodevenv/recip_back/18/bin/activate && cd /home/recipatc/recip_back
pm2 start index.js --name recip_back
pm2 save
```

---

## 6. Auto-start on Server Reboot

```bash
pm2 startup
```

Copy and run the command it outputs to enable auto-start.

---

## 7. Verify

Check the app is running:

```bash
pm2 status
```

Then open in browser:
```
http://recip360atc.com/backend
```

---

## Updating the App (after git changes)

```bash
cd ~/recip_back
git checkout -- package-lock.json
git pull origin main
pm2 restart recip_back
```

If new dependencies were added, go to **cPanel → Node.js App Manager → Run NPM Install** before restarting.

---

## Useful PM2 Commands

| Command | Description |
|---|---|
| `pm2 status` | Check if app is running |
| `pm2 logs recip_back` | View live logs |
| `pm2 restart recip_back` | Restart after code changes |
| `pm2 stop recip_back` | Stop the app |
| `pm2 save` | Save current process list |
