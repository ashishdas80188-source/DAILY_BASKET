# DAILYBASKET - Deployment & Hosting Guide

This guide provides step-by-step instructions for deploying the **DAILYBASKET** Full-Stack Grocery E-Commerce platform across various environments (Docker/VPS, Cloud PaaS like Render/Railway/Vercel, or AWS/DigitalOcean).

---

## 🏗️ Architecture Overview

```
[ Clients / Mobile Browsers ]
             │
             ▼
[ Frontend (React + Vite + Nginx) ]  ---> (Port 80 / Vercel CDN)
             │
             ▼ REST API (/api/* with JWT)
[ Backend (Java Spring Boot 3) ]      ---> (Port 8080 / Render Web Service)
             │
             ▼ JDBC
[ PostgreSQL Database (Port 5432) ]   ---> (Neon / Supabase / Render Postgres)
```

---

## 🐳 Option 1: One-Command Docker Compose Deployment (Recommended for VPS / AWS / DigitalOcean)

All Dockerfiles and container definitions are already pre-configured in the repository.

### Prerequisites:
- Docker & Docker Compose installed on your server/machine.

### Steps:
1. Clone your repository to your server:
   ```bash
   git clone <your-repo-url>
   cd DAILY_BASKET
   ```

2. Start all 3 services (PostgreSQL, Spring Boot Backend, and React Nginx Frontend):
   ```bash
   docker compose up --build -d
   ```

3. Verify running containers:
   ```bash
   docker compose ps
   ```

4. **Access your application:**
   - **Frontend:** `http://your-server-ip` or `http://localhost`
   - **Backend REST API:** `http://your-server-ip:8080/api`
   - **Database:** Auto-migrated and seeded with admin and customer credentials.

---

## ☁️ Option 2: Cloud PaaS Deployment (Render / Railway + Vercel)

You can deploy each tier to popular free/starter cloud providers in under 10 minutes:

### 1. Database (Free Managed PostgreSQL on Neon / Render / Supabase)
1. Create a free PostgreSQL instance on **[Neon.tech](https://neon.tech)**, **[Supabase](https://supabase.com)**, or **[Render](https://render.com)**.
2. Note your connection details:
   - `DATABASE_URL`: `jdbc:postgresql://<host>:5432/<db_name>?sslmode=require`
   - `DATABASE_USERNAME`: `<db_username>`
   - `DATABASE_PASSWORD`: `<db_password>`

---

### 2. Backend (Spring Boot on Render or Railway)
1. Push your project to **GitHub**.
2. Go to **[Render.com](https://render.com)** &rarr; Click **New +** &rarr; **Web Service**.
3. Connect your GitHub repository and set:
   - **Root Directory:** `backend`
   - **Runtime:** `Docker` (Render will automatically pick up `backend/Dockerfile`)
   - **Instance Type:** Free / Starter
4. Add the following **Environment Variables**:
   | Key | Value |
   | :--- | :--- |
   | `SPRING_PROFILES_ACTIVE` | `prod` |
   | `DATABASE_URL` | `jdbc:postgresql://<neon-host>:5432/<dbname>?sslmode=require` |
   | `DATABASE_USERNAME` | `<db_username>` |
   | `DATABASE_PASSWORD` | `<db_password>` |
   | `JWT_SECRET` | `9a6747f3c126d7da49be8a2968efc965762043a0ccf72e2c86e0216674e62040f1eb2e4b96ef32697a5a8d014082dc879da7342d48e3829dc72d555003b5ec98` |
   | `CORS_ALLOWED_ORIGINS` | `https://your-frontend.vercel.app,http://localhost:5173` |
5. Click **Create Web Service**. Your backend API URL will be: `https://dailybasket-api.onrender.com`.

---

### 3. Frontend (React on Vercel or Netlify)
1. Go to **[Vercel.com](https://vercel.com)** &rarr; **Add New Project**.
2. Import your GitHub repository.
3. Configure the build settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add **Environment Variable**:
   - `VITE_API_BASE_URL` = `https://dailybasket-api.onrender.com/api` *(or your backend live URL)*
5. Click **Deploy**. Vercel will provide your live URL (e.g. `https://dailybasket.vercel.app`).

---

## 🛠️ Option 3: Manual Production Build on a Linux VPS

### 1. Build & Run Backend:
```bash
cd backend
# Build JAR file
./mvnw clean package -DskipTests

# Run JAR with production properties
java -jar target/dailybasket-backend-1.0.0.jar --spring.profiles.active=prod
```

### 2. Build & Serve Frontend:
```bash
cd frontend
npm install
# Set production backend URL
export VITE_API_BASE_URL=https://your-backend-domain.com/api
npm run build

# Serve dist folder using Nginx or Caddy
sudo cp -r dist/* /var/www/dailybasket/
```

---

## 🔐 Environment Variables Reference

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Web server port | `8080` |
| `DATABASE_URL` | PostgreSQL JDBC connection URL | `jdbc:postgresql://postgres:5432/dailybasket_db` |
| `DATABASE_USERNAME` | Database username | `postgres` |
| `DATABASE_PASSWORD` | Database password | `postgrespassword` |
| `JWT_SECRET` | 256-bit secret key for signing JWTs | *(Pre-generated secure secret)* |
| `JWT_EXPIRATION_MS` | JWT validity duration in milliseconds | `86400000` (24 Hours) |
| `CORS_ALLOWED_ORIGINS`| Allowed frontend origins | `http://localhost,http://localhost:5173` |
| `VITE_API_BASE_URL` | API base path for frontend requests | `/api` (or `http://localhost:8080/api`) |

---

## 👤 Default Seeded Accounts (Live out of the box)

- **Administrator:** `admin@dailybasket.com` / `admin123`
- **Customer:** `customer@dailybasket.com` / `customer123`
