import firebase_admin
from firebase_admin import credentials, messaging
import math
from database import supabase

# Initialize Firebase
# cred = credentials.Certificate("firebase_credentials.json")
# firebase_admin.initialize_app(cred)

def haversine(lat1, lon1, lat2, lon2):
    R = 6371000  # radius of Earth in meters
    phi_1 = math.radians(lat1)
    phi_2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi_1) * math.cos(phi_2) * \
        math.sin(delta_lambda / 2.0) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

async def send_fcm_alert(alert_type: str, payload):
    # Stub for FCM logic
    print(f"Sending FCM Alert: {alert_type} for device {payload.device_id}")
    pass
    
def check_geofence(device_id: str, lat: float, lng: float):
    # Fetch geofence for device
    try:
        res = supabase.table("geofences").select("*").eq("device_id", device_id).eq("is_active", True).execute()
        geofences = res.data
        if geofences:
            for gf in geofences:
                distance = haversine(lat, lng, gf['center_lat'], gf['center_lng'])
                if distance > gf['radius_meters']:
                    print(f"Geofence breached! Distance: {distance}m")
                    # logic to debounce and send FCM
    except Exception as e:
        print(f"Error checking geofence: {e}")
