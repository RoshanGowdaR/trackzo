# 🚀 Deploying BuildFlow ERP on Hostinger (with Neon Cloud PostgreSQL)

This guide walks you through hosting **BuildFlow ERP** on Hostinger (hPanel / cPanel / VPS) connected to your free **Neon Cloud PostgreSQL Database**.

---

## ⚡ Cloud Database Credentials (Configured)

Your application is connected to Neon Cloud PostgreSQL:
```env
DATABASE_URL=postgresql://neondb_owner:npg_OXz0Nn4sMqLm@ep-billowing-shadow-aytd3uoj.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Default Login Credentials:
- **Email**: `admin@buildflow.com` (or any custom email)
- **Password**: `admin123` (or any custom password - new users automatically register!)

---

## 📋 Step-by-Step Hostinger Setup Guide

### 🛠️ Step 1: Upload Project Files to Hostinger
1. Compress your `buildflow-erp` directory (excluding `node_modules` and `.next`).
2. Log into Hostinger **hPanel** -> **File Manager**.
3. Upload and extract the project files into your domain directory (e.g. `public_html`).
4. Ensure `.env` is uploaded with your `DATABASE_URL`.

---

### ⚙️ Step 2: Configure Node.js Application in Hostinger hPanel

1. Log into **Hostinger hPanel**.
2. Go to **Websites** -> **Node.js** (or **Advanced** -> **Node.js Application**).
3. Click **Create Application**.
4. Configure settings:
   - **Node.js Version**: Select **18.x** or **20.x**
   - **Application Mode**: `Production`
   - **Application Root**: `public_html` (or your project subfolder)
   - **Application Startup File**: `server.js`
   - **Application URL**: `https://yourdomain.com`
5. Click **Create**.

---

### 📦 Step 3: Set Environment Variables in Hostinger

In Hostinger hPanel under **Environment Variables** (or in your uploaded `.env` file):
- `DATABASE_URL` = `postgresql://neondb_owner:npg_OXz0Nn4sMqLm@ep-billowing-shadow-aytd3uoj.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require`
- `NODE_ENV` = `production`
- `PORT` = `8000` (or hostinger default port)

---

### 🚀 Step 4: Run NPM Install & Restart
1. Under the Node.js App card in Hostinger hPanel, click **Run NPM Install** (or run `npm install --production --legacy-peer-deps` via Hostinger SSH).
2. Click **Restart Application**.
3. Visit `https://yourdomain.com/api/health` to verify:
   ```json
   {
     "status": "✅ Server running",
     "port": 8000,
     "database": "Neon Cloud PostgreSQL Database ⚡"
   }
   ```

---

## 🎉 Features Active
- **Cloud Database Persistence**: All projects, clients, materials, expenses, and logs are stored safely in Neon Cloud PostgreSQL.
- **Authentication**: Existing users and new users log in securely without changing any UI design.
- **Zero Local Dependency**: Any changes made on Hostinger or locally sync automatically across all devices.
