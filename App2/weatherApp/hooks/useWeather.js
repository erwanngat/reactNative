import { useState } from "react";
import axios from "axios";

const API_KEY = "027aab9182874bd06c881a033c3aed4f";
const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";
const CURRENT_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return {
    weather,
    currentWeather,
    loading,
    errorMsg,
    fetchWeather,
    fetchCurrentWeather,
  };
};

export default useWeather;
