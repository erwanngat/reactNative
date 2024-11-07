import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = "027aab9182874bd06c881a033c3aed4f";
  const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

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

  const renderWeatherIcon = (icon) => (
    <Image
      style={styles.weatherIcon}
      source={{
        uri: `https://openweathermap.org/img/wn/${icon}@2x.png`,
      }}
    />
  );

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
        <Text>Downloading weather...</Text>
      ) : weather ? (
        <ScrollView style={styles.scrollView}>
          {groupWeatherByDay(weather.list).map((dailyWeather, index) => {
            const day = new Date(
              dailyWeather[0].dt * 1000
            ).toLocaleDateString();
            return (
              <View style={styles.dayWeather} key={index}>
                <Text style={styles.dayTitle}>{day}</Text>
                <FlatList
                  data={dailyWeather}
                  renderItem={({ item }) => (
                    <View style={styles.weatherCard}>
                      {renderWeatherIcon(item.weather[0].icon)}
                      <Text style={styles.weatherText}>
                        {Math.round(item.main.temp)}°C
                      </Text>
                      <Text style={styles.weatherText}>
                        {item.weather[0].description}
                      </Text>
                      <Text style={styles.weatherText}>
                        {formatDate(item.dt)}
                      </Text>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <Text>{errorMsg || "Waiting for weather data..."}</Text>
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
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  title: {
    paddingTop: 25,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  weatherText: {
    fontSize: 18,
    marginVertical: 5,
  },
  weatherIcon: {
    width: 50,
    height: 50,
    marginVertical: 10,
  },
  scrollView: {
    width: "100%",
    marginBottom: 20,
  },
  dayWeather: {
    marginBottom: 30,
    width: "100%",
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  weatherCard: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
    width: 120,
  },
});
