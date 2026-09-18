# SwiftDocs - Professional PDF & Document Suite (iLovePDF Alternative)

SwiftDocs is a modern, responsive, 100% free web-based document conversion and management platform. It operates on a **Hybrid Zero-Cost Architecture** where all core operations (merging, splitting, rotating, image conversion, page numbering, compression, unlocking) are executed directly inside the user's browser via WebAssembly and JavaScript, eliminating server costs while guaranteeing bank-grade data privacy.

---

## ✨ Key Features

### 🛠️ Core PDF Tools
- **Merge PDF**: Combine multiple PDFs with intuitive up/down drag-reordering.
- **Split PDF**: Extract all individual pages into a ZIP archive or extract specific page ranges (e.g. `1-3, 5`).
- **Compress PDF**: Real canvas and raster stream downsampling with noticeable 40%–80% size reduction.
- **Rotate PDF**: Rotate pages by 90°, 180°, or 270° clockwise.
- **Add Page Numbers**: Custom positions (Bottom-Center, Bottom-Right, Top-Right, etc.) and formats (`Page {n} of {total}`).
- **PNG to PDF / JPG to PDF**: Convert images into a formatted PDF document with custom margins and orientation.
- **PDF to JPG**: Render PDF pages into high-resolution JPG images packaged in a ZIP archive.
- **Unlock PDF**: Decrypt password-protected PDF files safely in the browser.
- **PDF to Word (DOCX)**, **Word to PDF**, **Excel to PDF**, **PowerPoint to PDF**: Native OpenXML compatibility that opens smoothly in all Microsoft Word versions.

### 🎨 UI & Design
- **iLovePDF inspired blue & white theme** (`#2563eb`, `#1d4ed8`) with modern typography and sleek drop-shadows.
- **Dark Mode / Light Mode** with automatic local storage persistence.
- **Multi-Language Support**: Complete translations for **English**, **Hindi (हिन्दी)**, and **Gujarati (ગુજરાતી)**.
- **Mobile First**: 100% responsive across smartphones, tablets, laptops, and ultra-wide displays with touch gestures.
- **Header Navigation**: Quick direct access to Home, Merge, Split, Compress, PDF to Word, and PNG to PDF.
- **Drag & Drop Upload Zone**: 50MB file validation with instant size warning.
- **Animated Progress & Confetti**: Realistic status messages and celebratory canvas-confetti on successful conversion.
- **Modals**: Privacy Policy, Terms of Service, Contact Support form, and Social Media Share modal (WhatsApp, Twitter/X, LinkedIn, Copy Link).
- **SEO Ready**: Meta tags, OpenGraph previews, `robots.txt`, and `sitemap.xml`.

---

## 🏗️ Architecture: Hybrid Zero-Cost Engine

| Tool Category | Engine | Where It Runs | Server Cost |
| :--- | :--- | :--- | :--- |
| **Merge, Split, Rotate, Numbers, PNG to PDF, Compress, Unlock, PDF to JPG** | Client-Side (`pdf-lib`, `pdfjs-dist`, `JSZip`, Canvas) | Browser Sandbox | **$0.00 (Zero Server Load)** |
| **PDF to Word, Excel, PowerPoint, Word to PDF** | Python Microservice (Flask, `pdf2docx`, `PyMuPDF`, `openpyxl`) | Backend Container | Free Tier (Render / Hugging Face Spaces) |

### 🔒 Security & Auto-Cleanup
- Client-side converted files never leave the user's computer or phone.
- Server-side files are isolated by unique UUID request tokens and automatically deleted within **1 hour** by a background cleanup daemon (`server/cleaner.py`).

---

## 🚀 Quick Start (Running Locally)

### 1. Frontend (React + Vite)
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Backend (Python Flask)
```bash
cd server
python -m venv .venv

# On Windows:
.venv\Scripts\activate

# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
python app.py
```
Backend runs on [http://localhost:5000](http://localhost:5000).

---

## 🌐 100% Free Deployment Guide

### A. Deploy Frontend on Vercel (React + Vite)

SwiftDocs includes pre-configured Vercel configuration files (`client/vercel.json` and fallback root `vercel.json`) with SPA rewrite rules to ensure seamless routing without `404 NOT_FOUND` errors.

#### Option 1: Recommended Setup (Root Directory = `client`)
1. Push your code to your GitHub repository.
2. Go to **[Vercel Dashboard](https://vercel.com/new)** and click **Import** on your repository.
3. Under **Configure Project**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** and choose `client` (or type `client`)
   - **Build Command**: `npm run build` (or leave default Vite command)
   - **Output Directory**: `dist` (or leave default)
   - **Install Command**: `npm install`
4. *(Optional)* **Environment Variables**:
   - `VITE_API_URL`: `https://your-flask-backend-url.com/api` (If omitted, SwiftDocs will use its built-in client-side engine in the browser for all conversions!)
5. Click **Deploy**. Your frontend is live with automatic SSL and CDN caching!

#### 🛠️ How to Fix an Existing Deployment Showing "404 NOT_FOUND"
If your existing Vercel deployment shows `404 NOT_FOUND`, it means Vercel was deployed from the repository root without targeting the `client/` folder:
1. In your **Vercel Dashboard**, open your project.
2. Go to **Settings** > **General**.
3. Under **Root Directory**, click **Edit**, enter `client`, and click **Save**.
4. In **Build & Development Settings**, confirm:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Go to the **Deployments** tab, click the three dots (`...`) on your latest deployment, and select **Redeploy** (ensure you uncheck "Use existing build cache").

---

### B. Deploy Backend for Free (Hugging Face Spaces / Render / Railway)
The Python Flask backend in `server/` handles complex server-side conversions (e.g. high-fidelity Microsoft Word & Excel formatting):

1. **Hugging Face Spaces (Recommended - Free 16GB RAM Container)**:
   - Create a new Space with `Docker` or `Gradio/Python` SDK.
   - Point to the `server/` directory or copy its files.
2. **Render.com**:
   - Create a new "Web Service" from GitHub targeting the `server` directory.
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
3. **Connect Frontend to Backend**:
   - In your Vercel project, go to **Settings** > **Environment Variables**.
   - Add `VITE_API_URL` set to `https://<your-backend-service-url>/api`.
   - Redeploy the frontend.

