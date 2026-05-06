from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class LocationPayload(BaseModel):
    device_id: str
    lat: float
    lng: float
    accuracy: float
    mode: str
    battery_level: int
    is_moving: bool
    timestamp: datetime

class AlertPayload(BaseModel):
    device_id: str
    types: List[str]
    lat: float
    lng: float
    accuracy: float
    battery: int
    address: Optional[str] = None
    timestamp: datetime
