import React from "react";
import { View, Text, StyleSheet } from "react-native";
import WeatherIcon from "./WeatherIcon";

const CurrentWeather = ({ weather, formatDate }) => {
  if (!weather) return null;

  return (
    <View style={styles.currentWeather}>
      <Text style={styles.currentWeatherTitle}>Current weather</Text>
      <Text style={styles.currentTemp}>{Math.round(weather.main.temp)}°C</Text>
      <Text style={styles.currentDescription}>
        {weather.weather[0].description}
      </Text>
      <WeatherIcon icon={weather.weather[0].icon} />
      <Text>{formatDate(weather.dt)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  currentWeather: {
    alignItems: "center",
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  currentTemp: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#333",
  },
  currentDescription: {
    fontSize: 20,
    color: "#666",
  },
  currentWeatherTitle: {
    padding: 5,
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default CurrentWeather;
