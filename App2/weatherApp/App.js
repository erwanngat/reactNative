import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import CurrentWeather from "./components/CurrentWeather";
import WeatherList from "./components/WeatherList";

const API_KEY = "027aab9182874bd06c881a033c3aed4f";
const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";
const CURRENT_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weather, setWeather] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(false);

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
      fetchCurrentWeather(location.coords.latitude, location.coords.longitude);
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
          lang: "en",
        },
      });

      if (response.data && response.data.list) {
        setWeather(response.data);
      } else {
        setErrorMsg("No weather data available");
      }
    } catch (error) {
      setErrorMsg("Error fetching weather data");
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentWeather = async (latitude, longitude) => {
    try {
      const response = await axios.get(CURRENT_WEATHER_URL, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: API_KEY,
          units: "metric",
          lang: "en",
        },
      });

      if (response.data) {
        setCurrentWeather(response.data);
      } else {
        setErrorMsg("No current weather data available");
      }
    } catch (error) {
      setErrorMsg("Error fetching current weather data");
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return `${date.getHours()}:${
      date.getMinutes() < 10 ? "0" : ""
    }${date.getMinutes()}`;
  };

  // Fonction pour grouper les prévisions par jour
  const groupWeatherByDay = (weatherData) => {
    const groupedData = [];
    let currentDay = null;
    let dayData = [];

    weatherData.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const day = date.getDate();
      if (currentDay !== day) {
        if (currentDay !== null) {
          groupedData.push(dayData);
        }
        currentDay = day;
        dayData = [item];
      } else {
        dayData.push(item);
      }
    });

    if (dayData.length) {
      groupedData.push(dayData);
    }

    return groupedData;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Weather at {weather ? weather.city.name : "Loading..."}
      </Text>

      {loading ? (
        <Text style={styles.loadingText}>Downloading weather...</Text>
      ) : weather ? (
        <ScrollView style={styles.scrollView}>
          <CurrentWeather weather={currentWeather} formatDate={formatDate} />
          <WeatherList
            weatherData={groupWeatherByDay(weather.list)} // Passe la fonction ici
            formatDate={formatDate}
          />
        </ScrollView>
      ) : (
        <Text style={styles.errorText}>
          {errorMsg || "Waiting for weather data..."}
        </Text>
      )}

      <Button
        title="Refresh weather"
        color="#4CAF50"
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
    backgroundColor: "#f4f4f4",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  title: {
    paddingTop: 15,
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
  },
  errorText: {
    fontSize: 18,
    color: "#f44336",
    textAlign: "center",
    marginTop: 20,
  },
});
