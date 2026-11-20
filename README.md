# 🚆 Online Railway Reservation System (ORRS) - PHP & MySQL

A robust, modern web-based Online Railway Reservation System built with **PHP 8.2 & Apache**, styled with **AdminLTE 3 & Bootstrap 4**, and configured for zero-downtime cloud deployment on **Render** with **Aiven Cloud MySQL (SSL)**.

---

## 🌟 Key Features & Modern Upgrades

- **PHP 8.2 Compatibility:** Safe property initialization inside constructors, null-safe query result checks (`$qry instanceof mysqli_result`), and PHP 8.2+ exception handling.
- **Aiven Cloud MySQL SSL:** Pre-configured SSL encryption (`MYSQLI_CLIENT_SSL`, `require_secure_transport=ON`) and 5-digit custom port (e.g., `26284`) support.
- **Render Port 10000 & Reverse Proxy Fixes:** Built-in dynamic `$PORT` binding in `start.sh`, `UseCanonicalName Off`, `UseCanonicalPhysicalPort Off`, and smart trailing slash redirects in `.htaccess` to prevent `:10000` port leakage.
- **1-Click Cloud Database Importer (`db_setup.php`):** A visual web installer to test Aiven connection health, parse and import the database schema (`orrs_db.sql`) with a single click, and verify tables.
- **Dual-Mode Authentication:** AJAX login with smooth preloading and a fallback to traditional POST submission for high reliability.

---

## 🚀 How to Deploy on Render

### Step 1: Create Web Service on Render
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository:
   ```
   https://github.com/1234Adityarajput/online-railway-reservation-system-Demo
   ```
4. Configure the service settings:
   - **Name:** `online-railway-reservation-system` (or any custom name)
   - **Region:** Any (e.g., Oregon, Frankfurt, Singapore)
   - **Branch:** `main`
   - **Runtime:** `Docker` (Render will automatically detect `Dockerfile`)
   - **Instance Type:** Free

---

### Step 2: Configure Environment Variables on Render

In your Render Service Dashboard, navigate to the **Environment** tab and add the following variables:

| Key | Example / Recommended Value | Description |
| :--- | :--- | :--- |
| `DB_SERVER` | `mysql-xxxxx.aivencloud.com` | Hostname from your Aiven MySQL console |
| `DB_PORT` | `26284` | 5-digit custom port from Aiven |
| `DB_USERNAME` | `avnadmin` | MySQL username |
| `DB_PASSWORD` | `<your-aiven-password>` | MySQL password |
| `DB_NAME` | `defaultdb` (or `orrs_db`) | Database name |
| `DB_SSL` | `true` | Enforces SSL connection required by Aiven |
| `BASE_URL` | `https://<your-service>.onrender.com/` | Your live Render application URL |

> **Alternative (Single Connection String):** You can also supply the full Aiven Service URI as `DATABASE_URL` or `SERVICE_URI`:
> `mysql://avnadmin:<password>@mysql-xxxxx.aivencloud.com:26284/defaultdb?ssl-mode=REQUIRED`

---

### Step 3: Run 1-Click Database Setup (`db_setup.php`)

Once Render finishes building and your service shows **Live**:
1. Open the Database Setup tool in your browser:
   ```
   https://<your-service>.onrender.com/db_setup.php
   ```
2. Verify the **MySQL Connection Status** badge shows green (`MySQL Connected`).
3. Click the green **"1-Click Import Database (.SQL)"** button.
4. The tool will automatically:
   - Disable foreign key constraints (`SET FOREIGN_KEY_CHECKS = 0;`)
   - Execute all table creations and seed data from `database/orrs_db.sql`
   - Re-enable foreign key constraints
   - Confirm table row counts and verify the Admin account
5. Click **"Login to Admin"** to access the administration dashboard.

---

## 🛠️ Architecture & Reverse Proxy Fixes

### 1. Reverse Proxy & Port 10000 Stripping
On Render, applications run behind reverse proxies where external traffic arrives on port 80/443, but internal containers listen on `$PORT` (typically `10000`). By default, Apache redirects would append `:10000` to redirected URLs. We resolved this via:
- In `start.sh`:
  ```apache
  ServerName localhost
  UseCanonicalName Off
  UseCanonicalPhysicalPort Off
  ```
- In `.htaccess`:
  ```apache
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteCond %{REQUEST_URI} !/$
  RewriteCond %{HTTP_HOST} ^([^:]+)
  RewriteRule ^(.*)$ %{ENV:PROTO}://%1/$1/ [R=301,L]
  ```
- Direct file paths (`admin/login.php` & `admin/index.php`) in PHP/JavaScript redirects.

### 2. Aiven SSL Integration
Aiven MySQL enforces SSL (`require_secure_transport=ON`). The project initializes MySQLi using:
```php
$mysqli = mysqli_init();
$mysqli->ssl_set(NULL, NULL, NULL, NULL, NULL);
$mysqli->real_connect($host, $user, $pass, $db, $port, NULL, MYSQLI_CLIENT_SSL);
```

---

## 📁 Project Structure

```
├── .dockerignore                  # Excludes build clutter from Docker context
├── .gitignore                     # Git ignore rules
├── .htaccess                      # Trailing slash & reverse-proxy rewrite rules
├── Dockerfile                     # PHP 8.2 Apache production image
├── README.md                      # Complete system documentation
├── db_setup.php                   # 1-Click visual Aiven database installer
├── index.php                      # Client website homepage
├── initialize.php                 # Dynamic environment variable resolver
├── config.php                     # Global database & utility config
├── render.yaml                    # Infrastructure-as-code blueprint
├── start.sh                       # Container entrypoint & Apache configuration
├── admin/                         # Administrator & Staff dashboard
├── classes/                       # DBConnection, SystemSettings, Master, Users, Login
├── database/                      # SQL dump (`orrs_db.sql`)
├── dist/                          # AdminLTE CSS & JS assets
├── inc/                           # Client header, navbar, footer
├── plugins/                       # Bootstrap, jQuery, FontAwesome, DataTables
└── uploads/                       # System logos and user avatars
```

---

## 🔑 Login Credentials

### 1. Administrator Account
- **Admin Login URL:** `https://<your-service>.onrender.com/admin/login.php`
- **Username:** `admin`
- **Password:** `admin123`
- **Access Level:** Full Administrator (Manage Trains, Schedules, Reservations, Inquiries, User Accounts, and System Settings)

### 2. Staff Account
- **Staff Login URL:** `https://<your-service>.onrender.com/admin/login.php`
- **Username:** `slou`
- **Password:** `slou123`
- **Access Level:** Staff (Manage Schedules, View Reservations & Inquiries)
