import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import * as Location from "expo-location";
import axios from "axios";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = "027aab9182874bd06c881a033c3aed4f";
  const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?";

  useEffect(() => {
    const getLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      fetchWeather(location.coords.latitude, location.coords.longitude);
    };

    getLocationPermission();
  }, []);

  const fetchWeather = async (latitude, longitude) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await axios.get(BASE_URL, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: API_KEY,
          units: "metric",
          lang: "fr",
        },
      });

      setWeather(response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.coords.latitude}\nLongitude: ${location.coords.longitude}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather at your location</Text>

      {loading ? (
        <Text>downloading weather...</Text>
      ) : weather ? (
        <View>
          <Image
            style={styles.weatherIcon}
            source={{
              uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
              }}
          />
          <Text style={styles.weatherText}>City: {weather.name}</Text>
          <Text style={styles.weatherText}>Temp: {weather.main.temp}°C</Text>
          <Text style={styles.weatherText}>Condition: {weather.weather[0].main}</Text>
          <Text style={styles.weatherText}>Details: {weather.weather[0].description}</Text>
        </View>
      ) : (
        <Text>{text}</Text>
      )}

      <Button
        title="Refresh weather"
        onPress={() =>
          fetchWeather(location.coords.latitude, location.coords.longitude)
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  weatherText: {
    fontSize: 18,
    marginVertical: 5,
  },
  weatherIcon: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});
