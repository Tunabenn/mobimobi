"""
Mobimobi Kurumsal API Servisi
Starlette + Uvicorn + SQLite
"""

import os
import uuid
import sqlite3
from datetime import datetime
from starlette.applications import Starlette
from starlette.routing import Route, Mount
from starlette.responses import JSONResponse
from starlette.staticfiles import StaticFiles
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware

# Directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Database Initialization
DB_PATH = os.path.join(BASE_DIR, "leads.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS quote_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            phone TEXT NOT NULL,
            quantity TEXT,
            notes TEXT,
            photo_filename TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

init_db()

# Route: Healthcheck
async def health(request):
    return JSONResponse({"status": "healthy", "service": "Mobimobi API"})

# Route: Handle Photo Quote Submission
async def upload_quote(request):
    try:
        form = await request.form()
        phone = form.get("phone", "").strip()
        quantity = form.get("quantity", "1")
        notes = form.get("notes", "")
        photo = form.get("photo")

        if not phone:
            return JSONResponse({"success": False, "error": "Telefon numarası gereklidir."}, status_code=400)

        filename = None
        if photo and hasattr(photo, "filename") and photo.filename:
            # Generate secure unique filename
            ext = os.path.splitext(photo.filename)[1].lower()
            if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
                return JSONResponse({"success": False, "error": "Geçersiz dosya formatı. Sadece JPG, PNG veya WEBP yükleyebilirsiniz."}, status_code=400)
            
            filename = f"mobilya_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:6]}{ext}"
            file_path = os.path.join(UPLOAD_DIR, filename)
            
            # Save file content
            content = await photo.read()
            with open(file_path, "wb") as f:
                f.write(content)

        # Save to SQLite Database
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO quote_requests (phone, quantity, notes, photo_filename)
            VALUES (?, ?, ?, ?)
        """, (phone, quantity, notes, filename))
        lead_id = cursor.lastrowid
        conn.commit()
        conn.close()

        file_url = f"/uploads/{filename}" if filename else None

        return JSONResponse({
            "success": True,
            "message": "Fiyat talebiniz ve fotoğrafınız başarıyla alındı!",
            "lead_id": lead_id,
            "photo_url": file_url
        })

    except Exception as e:
        return JSONResponse({"success": False, "error": str(e)}, status_code=500)

# Route: Get Leads (Admin View)
async def list_leads(request):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM quote_requests ORDER BY id DESC LIMIT 50")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return JSONResponse({"leads": rows})

# Middleware: Enable CORS for frontend requests
middleware = [
    Middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
]

# Starlette Application Routes
routes = [
    Route("/api/health", health, methods=["GET"]),
    Route("/api/upload-quote", upload_quote, methods=["POST"]),
    Route("/api/leads", list_leads, methods=["GET"]),
    Mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads"),
]

app = Starlette(debug=True, routes=routes, middleware=middleware)

if __name__ == "__main__":
    import uvicorn
    print("🚀 Mobimobi API başlatılıyor: http://127.0.0.1:8000")
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
