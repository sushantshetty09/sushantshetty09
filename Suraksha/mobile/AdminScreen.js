import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Linking } from 'react-native';
import axios from 'axios';

const BACKEND_URL = 'http://10.0.2.2:8000';
const MOM_DEVICE_ID = 'mom_device_001';

export default function AdminScreen() {
  const [latestLocation, setLatestLocation] = useState(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/latest/${MOM_DEVICE_ID}`);
        setLatestLocation(res.data);
      } catch (err) {
        console.log('Error fetching latest location', err);
      }
    };
    
    fetchLatest();
    const interval = setInterval(fetchLatest, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const handleCallMom = () => {
    // Note: Admin FCM notification deep link handles this automatically as well
    Linking.openURL('tel:+91XXXXXXXXXX');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Panel: Mom's Status</Text>
      
      {latestLocation ? (
        <View style={styles.card}>
          <Text style={styles.title}>Last Seen</Text>
          <Text>Time: {new Date(latestLocation.timestamp).toLocaleString()}</Text>
          <Text>Lat: {latestLocation.lat}</Text>
          <Text>Lng: {latestLocation.lng}</Text>
          <Text>Battery: {latestLocation.battery_level}%</Text>
          <Text>Mode: {latestLocation.mode} | Moving: {latestLocation.is_moving ? 'Yes' : 'No'}</Text>
          <Text style={styles.mapStub}>[Map Component Here]</Text>
        </View>
      ) : (
        <Text>Loading mom's status...</Text>
      )}

      <TouchableOpacity style={styles.callButton} onPress={handleCallMom}>
         <Text style={styles.callButtonText}>Call Mom Now</Text>
      </TouchableOpacity>

      <Text style={{marginTop: 20}}>* FCM Push Notifications will alert you for emergencies and 6hr digests.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 3
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  mapStub: {
    marginTop: 20,
    height: 150,
    backgroundColor: '#e0e0e0',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#888'
  },
  callButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center'
  },
  callButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  }
});
