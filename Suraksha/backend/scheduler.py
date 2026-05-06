from apscheduler.schedulers.asyncio import AsyncIOScheduler
from database import supabase
from services import send_fcm_alert
from datetime import datetime, timedelta

scheduler = AsyncIOScheduler()

async def send_six_hour_digest():
    print("Running 6-hour digest...")
    # Fetch devices where role = 'tracked'
    try:
        devices_res = supabase.table("devices").select("*").eq("role", "tracked").execute()
        devices = devices_res.data
        
        six_hours_ago = datetime.utcnow() - timedelta(hours=6)
        
        for device in devices:
            events_res = supabase.table("location_events") \
                .select("*") \
                .eq("device_id", device['device_id']) \
                .gte("timestamp", six_hours_ago.isoformat()) \
                .execute()
                
            events = events_res.data
            if not events:
                print(f"No events for {device['device_id']}")
                # Alert: No activity detected
                continue
                
            # Summarize
            is_moving_events = [e for e in events if e.get('is_moving')]
            avg_battery = sum(e.get('battery_level', 100) for e in events) / len(events) if events else 100
            
            summary = {
                "went_out": len(is_moving_events) > 0,
                "avg_battery": avg_battery,
                "event_count": len(events)
            }
            
            class StubPayload:
                def __init__(self, device_id, summary_data):
                    self.device_id = device_id
                    self.summary_data = summary_data
            
            await send_fcm_alert("digest", StubPayload(device['device_id'], summary))
            
    except Exception as e:
        print(f"Error in digest: {e}")

# Start scheduler
# scheduler.add_job(send_six_hour_digest, 'interval', hours=6)
# scheduler.start()
