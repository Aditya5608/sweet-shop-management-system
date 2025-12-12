# Sweet Shop Management System 🍬

This project is a full-stack Sweet Shop Management System built as part of the **Incubyte AI Kata Assessment**.

It allows users to register, log in, browse sweets, purchase items, and enables admins to manage sweet inventory.

---

## 🚀 Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Protected routes

### 🍭 Sweet Inventory
- View all available sweets
- Search sweets by name, category, and price range
- Purchase sweets with automatic quantity update
- Out-of-stock handling with disabled purchase button

### 🧑‍💼 Admin Panel
- Add new sweets
- Delete sweets (with confirmation)
- Restock sweets
- Real-time inventory updates

### 🎨 UI & UX
- Responsive React UI
- Pagination for sweets listing
- Smooth UI animations using Framer Motion
- Clean and intuitive dashboard

---

## 🛠️ Tech Stack

### Backend
- Python
- FastAPI
- SQLAlchemy
- SQLite
- JWT Authentication
- Pytest (testing)

### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- React Router
- Framer Motion

---

## ⚙️ How to Run Locally

### Backend Setup

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload

Backend will run at:

http://127.0.0.1:8000


Swagger Docs:

http://127.0.0.1:8000/docs

Frontend Setup
cd frontend
npm install
npm run dev


Frontend will run at:

http://localhost:5173

🧪 Testing

Backend tests are written using pytest

Tests validate authentication and inventory operations

To run tests:

cd backend
pytest


While full Red–Green–Refactor TDD cycles may not be explicitly reflected in commit history, tests were used to validate core functionality.

🤖 My AI Usage (Mandatory Disclosure)

AI tools such as ChatGPT were used to assist with:

Understanding the problem statement

Designing application architecture

Debugging errors

Improving UI/UX and code quality

All final implementation decisions and understanding of the system are my own.
AI was used strictly as a learning and productivity aid.
