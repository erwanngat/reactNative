import React from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import DayWeather from "./DayWeather";

const WeatherList = ({ weatherData, formatDate }) => {
  return (
    <View style={styles.scrollView}>
      {weatherData.map((dailyWeather, index) => {
        const day = new Date(dailyWeather[0].dt * 1000).toLocaleDateString();
        return (
          <View style={styles.dayWeather} key={index}>
            <Text style={styles.dayTitle}>{day}</Text>
            <FlatList
              data={dailyWeather}
              renderItem={({ item }) => (
                <DayWeather dayData={item} formatDate={formatDate} />
              )}
              keyExtractor={(item, index) => index.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
    marginBottom: 30,
  },
  dayWeather: {
    marginBottom: 40,
    width: "100%",
    paddingHorizontal: 10,
  },
  dayTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
});

export default WeatherList;
