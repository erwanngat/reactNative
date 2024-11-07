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
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(false);


  const API_KEY = "027aab9182874bd06c881a033c3aed4f";
  const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";
  const CURRENT_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

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
        <Text style={styles.loadingText}>Downloading weather...</Text>
      ) : weather ? (
        <ScrollView style={styles.scrollView}>
          {currentWeather && (
            <View style={styles.currentWeather}>
              <Text style={styles.currentWeatherTitle}>Current weather</Text>
              <Text style={styles.currentTemp}>
                {Math.round(currentWeather.main.temp)}°C
              </Text>
              <Text style={styles.currentDescription}>
                {currentWeather.weather[0].description}
              </Text>
              {renderWeatherIcon(currentWeather.weather[0].icon)}
              <Text>{formatDate(currentWeather.dt)}</Text>
            </View>
          )}

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
  weatherText: {
    fontSize: 16,
    marginVertical: 5,
    color: "#444",
  },
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
  weatherIcon: {
    width: 80,
    height: 80,
    marginVertical: 15,
  },
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
  currentWeatherTitle: {
    padding: 5,
    fontSize: 20,
    fontWeight: "bold",
  },
});
