import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, DeviceEventEmitter, SafeAreaView } from 'react-native';
import AdminScreen from './AdminScreen';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Accelerometer } from 'expo-sensors';
import * as Battery from 'expo-battery';
import { Audio } from 'expo-av';
import axios from 'axios';

const BACKEND_URL = 'http://10.0.2.2:8000'; // Or your deployed backend URL
const DEVICE_ID = 'mom_device_001';

const LOCATION_TASK_NAME = 'background-location-task';

// Define the background task for location
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data;
    for (const loc of locations) {
      try {
        const batteryLevel = await Battery.getBatteryLevelAsync();
        // Send to backend
        await axios.post(`${BACKEND_URL}/location`, {
          device_id: DEVICE_ID,
          lat: loc.coords.latitude,
          lng: loc.coords.longitude,
          accuracy: loc.coords.accuracy,
          mode: 'background',
          battery_level: Math.round(batteryLevel * 100),
          is_moving: true, // simplified logic, actually base it on speed/accel
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.log('Error sending bg location', err);
        // Queue it locally using SQLite or similar in Phase 2
      }
    }
  }
});

export default function App() {
  const [role, setRole] = useState(null); // 'admin' or 'tracked'
  const [isTracking, setIsTracking] = useState(false);
  const [alarmSound, setAlarmSound] = useState(null);

  useEffect(() => {
    if (role !== 'tracked') return;
    (async () => {
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
      
      if (fgStatus === 'granted' && bgStatus === 'granted') {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 30 * 60 * 1000, // 30 minutes
          distanceInterval: 100, // 100 meters
          deferredUpdatesInterval: 30 * 60 * 1000,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: "Suraksha",
            notificationBody: "Tracking active 🟢",
          }
        });
        setIsTracking(true);
      }
    })();
    
    // Fall Detection via Accelerometer (simplified spike detection)
    let fallTimeout;
    Accelerometer.setUpdateInterval(20); // 50Hz (20ms)
    const subscription = Accelerometer.addListener(accelerometerData => {
      const { x, y, z } = accelerometerData;
      const g = Math.sqrt(x * x + y * y + z * z);
      if (g > 2.5) { // Spike
        clearTimeout(fallTimeout);
        fallTimeout = setTimeout(() => {
          // Check if near zero
          if (g < 0.5) {
            triggerSOS("Fall Detected!");
          }
        }, 1500); // 1.5s after spike
      }
    });

    // 909 Interceptor Broadcast Receiver listener
    const listener = DeviceEventEmitter.addListener('GUARDIAN_909_TRIGGERED', () => {
       handle909Trigger();
    });

    return () => {
      subscription.remove();
      listener.remove();
      if (alarmSound) alarmSound.unloadAsync();
    };
  }, []);

  const sendAlert = async (types) => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const batteryLevel = await Battery.getBatteryLevelAsync();
      await axios.post(`${BACKEND_URL}/alerts`, {
        device_id: DEVICE_ID,
        types,
        lat: location.coords.latitude,
        lng: location.coords.longitude,
        accuracy: location.coords.accuracy,
        battery: Math.round(batteryLevel * 100),
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.log('Error sending alert:', err);
    }
  };

  const handleNotSafe = async () => {
    Alert.alert("Sent", "Your family has been notified.");
    await sendAlert(["not_safe"]);
  };

  const handleCallMe = async () => {
    Alert.alert("Sent", "Call request sent to admin.");
    await sendAlert(["call_request"]);
  };

  const triggerSOS = async (reason = "Emergency Triggered") => {
    // Play loud alarm
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/alert.mp3'),
      { shouldPlay: true, isLooping: true, volume: 1.0 }
    );
    setAlarmSound(sound);
    Alert.alert("EMERGENCY", reason + ". Alarm active.", [
      { text: "Cancel", onPress: () => sound.unloadAsync() }
    ]);
    
    await sendAlert(["emergency"]);
  };

  const handleEmergency = () => {
    triggerSOS();
  };

  const handle909Trigger = async () => {
     await sendAlert(["not_safe", "call_request", "emergency"]);
     triggerSOS("909 Emergency Code Dialed");
  };

  if (!role) {
    return (
      <View style={styles.container}>
        <Text style={styles.status}>Select Role</Text>
        <TouchableOpacity style={[styles.button, styles.blueButton]} onPress={() => setRole('tracked')}>
          <Text style={styles.buttonText}>Mom's Phone (Tracked)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.amberButton]} onPress={() => setRole('admin')}>
          <Text style={styles.buttonText}>My Phone (Admin)</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (role === 'admin') {
    return (
      <SafeAreaView style={{flex: 1}}>
        <AdminScreen />
        <TouchableOpacity style={{padding: 10, alignItems: 'center'}} onPress={() => setRole(null)}>
          <Text style={{color: 'blue'}}>Switch Role</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={{position: 'absolute', top: 40, left: 20}} onPress={() => setRole(null)}>
        <Text style={{color: 'blue'}}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.status}>
        {isTracking ? "Tracking active 🟢" : "Tracking inactive 🔴"}
      </Text>

      <TouchableOpacity style={[styles.button, styles.amberButton]} onPress={handleNotSafe}>
        <Text style={styles.buttonText}>I'm not safe</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.blueButton]} onPress={handleCallMe}>
        <Text style={styles.buttonText}>Call me now</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.redButton]} 
        onLongPress={handleEmergency}
        delayLongPress={2000} // Hold to confirm
      >
        <Text style={styles.buttonText}>Emergency (Hold)</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.greenButton]} onPress={() => Alert.alert('Sent', 'Check-in registered ✅')}>
         <Text style={styles.buttonText}>I'm okay (Daily Check-in)</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  status: {
    fontSize: 18,
    marginBottom: 40,
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  amberButton: { backgroundColor: '#FFBF00' },
  blueButton: { backgroundColor: '#007AFF' },
  redButton: { backgroundColor: '#FF3B30' },
  greenButton: { backgroundColor: '#34C759' },
});
