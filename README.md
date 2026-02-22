# accessiBILL


Our service give users more clarity into public policy, including bills, ballots, and initiatives. We support speech-to-text, image, and PDF uploads. 


## How to Run AccessiBILL Locally

This project has:

Frontend → React + Vite

Backend → FastAPI + Gemini API

Both must run at the same time.

### Project Structure
```
project-root/
│
├── frontend/   # React app
└── backend/    # FastAPI server
```

### 1. Run the Backend (FastAPI)
#### Step 1 — Navigate to backend folder
```
cd backend
```

#### Step 2 — Create virtual environment (first time only)
```
python -m venv venv
```

##### Activate it:

Mac/Linux

```
source venv/bin/activate
```

Windows

```
venv\Scripts\activate
```


You should see (venv) in your terminal.

#### Step 3 — Install dependencies (first time only)


```
pip install fastapi uvicorn python-dotenv google-generativeai
```


#### Step 4 — Add your Gemini API key

##### Create a file in /backend:

```
.env
```

Add:

```
GEMINI_API_KEY=your_actual_key_here
```

⚠️ Do not commit this file.


#### Step 5 — Start backend server

```
python -m uvicorn main:app --reload --port 8000
```

##### You should see:

```
Uvicorn running on http://127.0.0.1:8000
```

##### Test it:

```
http://localhost:8000/docs
```


### 2. Run the Frontend (React + Vite)

Open a new terminal window.

#### Step 1 — Navigate to frontend

```
cd frontend
```

#### Step 2 — Install dependencies (first time only)

```
npm install
```


#### Step 3 — Start frontend

```
npm run dev
```

You should see something like:

```
VITE vX.X.X  ready in XXXms

➜  Local:   http://localhost:8080/
```

Open that URL in your browser.

### How It Connects

Frontend sends requests to: `http://localhost:8000/personalize`

Backend handles the request and calls Gemini securely.

#### Quick Testing Workflow

* Start backend

* Confirm /docs works

* Start frontend

* Submit a test bill + user context

Confirm results render.


#### Common Issues
❌ process is not defined

Use `import.meta.env` instead of `process.env` in Vite.

❌ Module not found fastapi

Make sure your virtual environment is activated before running backend.

❌ Failed to fetch

Backend is not running or wrong port.

#### Stopping Servers

Stop either server with:

`CTRL + C`
