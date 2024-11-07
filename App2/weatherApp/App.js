import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import * as Location from "expo-location";
import useWeather from "./hooks/useWeather";
import CurrentWeather from "./components/CurrentWeather";
import WeatherList from "./components/WeatherList";

export default function App() {
  const [location, setLocation] = useState(null);
  const {
    weather,
    currentWeather,
    loading,
    errorMsg,
    fetchWeather,
    fetchCurrentWeather,
  } = useWeather();

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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return `${date.getHours()}:${
      date.getMinutes() < 10 ? "0" : ""
    }${date.getMinutes()}`;
  };

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
            weatherData={groupWeatherByDay(weather.list)}
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
