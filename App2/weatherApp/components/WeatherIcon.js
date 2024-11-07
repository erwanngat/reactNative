import React from "react";
import { Image, StyleSheet } from "react-native";

const WeatherIcon = ({ icon }) => (
  <Image
    style={styles.weatherIcon}
    source={{
      uri: `https://openweathermap.org/img/wn/${icon}@2x.png`,
    }}
  />
);

const styles = StyleSheet.create({
  weatherIcon: {
    width: 80,
    height: 80,
    marginVertical: 15,
  },
});

export default WeatherIcon;
