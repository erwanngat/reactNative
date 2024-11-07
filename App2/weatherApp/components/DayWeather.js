import React from "react";
import { View, Text, StyleSheet } from "react-native";
import WeatherIcon from "./WeatherIcon";

const DayWeather = ({ dayData, formatDate }) => {
  return (
    <View style={styles.weatherCard}>
      <WeatherIcon icon={dayData.weather[0].icon} />
      <Text style={styles.weatherText}>{Math.round(dayData.main.temp)}°C</Text>
      <Text style={styles.weatherText}>{dayData.weather[0].description}</Text>
      <Text style={styles.weatherText}>{formatDate(dayData.dt)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  weatherCard: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "#ffffff",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    width: 130,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  weatherText: {
    fontSize: 16,
    marginVertical: 5,
    color: "#444",
  },
});

export default DayWeather;
