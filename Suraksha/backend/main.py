from fastapi import FastAPI, BackgroundTasks
from models import LocationPayload, AlertPayload
from database import supabase
from services import check_geofence, send_fcm_alert

app = FastAPI(title="Suraksha API")

@app.post("/location")
async def receive_location(payload: LocationPayload, background_tasks: BackgroundTasks):
    # Store in Supabase
    try:
        supabase.table("location_events").insert({
            "device_id": payload.device_id,
            "lat": payload.lat,
            "lng": payload.lng,
            "accuracy": payload.accuracy,
            "mode": payload.mode,
            "battery_level": payload.battery_level,
            "is_moving": payload.is_moving,
            "timestamp": payload.timestamp.isoformat()
        }).execute()
        
        # Check Geofence
        background_tasks.add_task(check_geofence, payload.device_id, payload.lat, payload.lng)
        
    except Exception as e:
        print(f"Error inserting location: {e}")
        return {"status": "error", "message": str(e)}

    return {"status": "ok"}

@app.get("/latest/{device_id}")
async def get_latest_location(device_id: str):
    try:
        res = supabase.table("location_events") \
            .select("*") \
            .eq("device_id", device_id) \
            .order("timestamp", desc=True) \
            .limit(1) \
            .execute()
        return res.data[0] if res.data else None
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/alerts")
async def create_alert(payload: AlertPayload):
    for alert_type in payload.types:
        # Insert into Supabase alerts table
        try:
            supabase.table("alerts").insert({
                "device_id": payload.device_id,
                "type": alert_type,
                "payload": payload.model_dump(),
                "sent_at": payload.timestamp.isoformat()
            }).execute()
            # Fire FCM based on type
            await send_fcm_alert(alert_type, payload)
        except Exception as e:
            print(f"Error creating alert: {e}")
            return {"status": "error", "message": str(e)}
    return {"status": "ok", "count": len(payload.types)}
