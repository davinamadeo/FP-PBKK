# Digital Asset Manager (Google Drive Mini)

Aplikasi manajemen aset digital berbasis web yang memungkinkan pengguna untuk menyimpan, mengorganisir, dan mengelola file digital dengan mudah. Dibangun dengan **NestJS** (Backend) dan **Next.js** (Frontend).

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

---

## Tentang Project

**Digital Asset Manager** adalah aplikasi web yang terinspirasi dari Google Drive untuk mengelola file digital secara efisien. Aplikasi ini dikembangkan sebagai Final Project dengan memenuhi **6 requirement wajib**:

| Requirement | Status | Implementasi |
|-------------|--------|--------------|
| CRUD | ✅ | Folder, Files, Tags, Users |
| Email | ✅ | Notifikasi saat register & upload |
| File Upload | ✅ | Upload PDF, Foto, Dokumen via Multer |
| Auth + Role | ✅ | JWT Authentication (Admin/User) |
| Search & Filter | ✅ | Search by name, type, tag, date |
| 6+ Features | ✅ | 8 fitur utama |

---

## Fitur Utama

### 1. Authentication (Login & Register)
- Registrasi akun dengan validasi email
- Login menggunakan JWT (JSON Web Token)
- Password di-hash menggunakan bcrypt
- Email notifikasi saat berhasil registrasi

### 2. Upload File Digital
- Upload berbagai jenis file (PDF, Gambar, Dokumen)
- Penyimpanan file di folder `/uploads`
- Metadata tersimpan di database:
  - Nama file
  - Tipe file (MIME type)
  - Ukuran file
  - Path lokasi
  - Folder tujuan
  - Pemilik file
- Email notifikasi saat file berhasil di-upload

### 3. Manajemen Folder (CRUD)
- Membuat folder baru
- Rename folder
- Hapus folder beserta isinya
- Pindahkan file antar folder
- Folder bersifat privat per user

### 4. Search & Filtering
- **Search berdasarkan:**
  - Nama file
  - Deskripsi
  - Tag
- **Filter berdasarkan:**
  - Tipe file (image/pdf/document)
  - Rentang tanggal (today, week, month)
  - Ukuran file (small/medium/large)
- Pagination: `?page=1&limit=20`

### 5. Tagging System
- Tambah multiple tags ke file
- Hapus tag dari file
- Cari file berdasarkan tag
- Manajemen tag (CRUD)

### 6. Preview File
- Preview gambar langsung di browser
- PDF menggunakan embedded viewer
- Informasi file lengkap:
  - Owner
  - Tanggal upload
  - Ukuran
  - Tags

### 8. Email Notifications
- Email selamat datang saat register
- Email notifikasi saat upload file

---

## Tech Stack

### Backend
- **Framework:** NestJS
- **Database:** SQLite + Prisma ORM
- **Authentication:** JWT + Passport
- **File Upload:** Multer
- **Email:** Nodemailer
- **Validation:** class-validator

### Frontend
- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **State Management:** React Context

---

## Instalasi

### Prerequisites
- Node.js v18+
- npm atau yarn
- Git

### Clone Repository

```bash
git clone https://github.com/username/digital-asset-manager.git
cd digital-asset-manager
```

### Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Setup Database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

---

## Konfigurasi Environment

### Backend (`backend/.env`)

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=youremail@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=youremail@gmail.com

# App
PORT=3001
NODE_ENV=development
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

> **Catatan:** Untuk Gmail, gunakan App Password. Aktifkan 2FA terlebih dahulu di Google Account.

---

## Menjalankan Aplikasi

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```
Server berjalan di `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Aplikasi berjalan di `http://localhost:3000`

---

## API Endpoints

### Authentication
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/auth/register` | Registrasi user baru |
| POST | `/auth/login` | Login user |
| GET | `/auth/me` | Get current user profile |

### Files
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/files` | Get semua files user |
| POST | `/files/upload` | Upload file baru |
| GET | `/files/:id` | Get detail file |
| PATCH | `/files/:id` | Update file |
| DELETE | `/files/:id` | Hapus file |
| GET | `/files/search?q=` | Search files |

### Folders
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/folders` | Get semua folders |
| POST | `/folders` | Buat folder baru |
| GET | `/folders/:id` | Get folder dengan files |
| PATCH | `/folders/:id` | Update folder |
| DELETE | `/folders/:id` | Hapus folder |

### Tags
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/tags` | Get semua tags |
| POST | `/tags` | Buat tag baru |
| POST | `/files/:id/tags` | Tambah tag ke file |
| DELETE | `/files/:id/tags/:tagId` | Hapus tag dari file |

---

## Screenshots

### Landing page
<img width="2556" height="1468" alt="image" src="https://github.com/user-attachments/assets/3338ba73-d6a2-4e42-93be-90643a6f7b03" />  

### Dashboard
<img width="2559" height="1465" alt="image" src="https://github.com/user-attachments/assets/d7661236-a147-4092-87a9-bb34347c863d" />  

### File Manager
<img width="2559" height="1469" alt="image" src="https://github.com/user-attachments/assets/054828cb-5950-40c4-98c1-8125f9475174" />  

### Upload Modal
<img width="2559" height="1469" alt="image" src="https://github.com/user-attachments/assets/693e8dbf-b2bd-436b-8172-0821230c1e8d" />

---

## 👨‍💻 Kontributor

| Nama | Role | GitHub |
|------|------|--------|
| Davin Amadeo | Full Stack Developer | [@davinamadeo](https://github.com/davinamadeo) |
