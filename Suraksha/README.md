# Suraksha

Suraksha is a family safety app to track elderly individuals who live alone. The platform is designed to run silently with near-zero battery impact on the tracked phone, with features to escalate to high-accuracy GPS tracking, fall detection, and emergency triggers.

## Project Structure

- `backend/`
  - **FastAPI** service using Python 3.11.
  - Integration with **Supabase** (PostgreSQL) for location and alert storage.
  - Includes a 6-hour digest task scheduler (`APScheduler`).
  - Contains `schema.sql` to initialize your Supabase DB.
- `mobile/`
  - **React Native** app built with **Expo SDK 51** (Bare workflow).
  - Handles smart background location using `expo-task-manager` and `expo-location`.
  - Fall detection implementation via `expo-sensors`.
  - Advanced 909 dial interceptor using native Android `BroadcastReceiver` and `DeviceEventEmitter`.
  - "Admin" vs "Tracked" role support.

## Getting Started

### 1. Supabase Setup
- Create a new project in Supabase.
- Run the SQL script found in `backend/schema.sql` in the Supabase SQL editor.
- Get your Supabase URL and Anon Key.

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Activate venv: .\venv\Scripts\activate (Windows) or source venv/bin/activate (Mac/Linux)
pip install -r requirements.txt
```
Create a `.env` file in the `backend/` directory:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```
Run the FastAPI backend:
```bash
uvicorn main:app --reload
```

### 3. Mobile Setup
```bash
cd mobile
npm install
```
Since the app uses a native Android BroadcastReceiver for the 909 interceptor, you must use the Expo bare workflow to build it:
```bash
npx expo run:android
```

### Notes
- Add a valid `alert.mp3` file to `mobile/assets/` to ensure the loud alarm feature works properly.
- FCM (Firebase Cloud Messaging) integration logic is stubbed in `backend/services.py` and requires your `firebase_credentials.json` to enable push notifications to the Admin.
