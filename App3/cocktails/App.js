import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import axios from "axios";

const App = () => {
  const [cocktails, setCocktails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});

  const fetchCocktailsByLetter = async (letter) => {
    try {
      const response = await axios.get(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`
      );
      return response.data.drinks || [];
    } catch (err) {
      console.error(`Error with letter ${letter}: `, err);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllCocktails = async () => {
      setLoading(true);
      let allCocktails = [];
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

      for (let i = 0; i < alphabet.length; i++) {
        const letter = alphabet[i];
        const cocktailsForLetter = await fetchCocktailsByLetter(letter);
        allCocktails = [...allCocktails, ...cocktailsForLetter];
      }

      allCocktails.sort((a, b) => a.strDrink.localeCompare(b.strDrink));

      setCocktails(allCocktails);
      setLoading(false);
    };

    fetchAllCocktails();
  }, []);

  const handleImageLoad = (id) => {
    setLoadedImages((prevState) => ({ ...prevState, [id]: true }));
  };

  const renderCocktail = ({ item }) => {
    const imageUrl = item.strDrinkThumb
      ? `${item.strDrinkThumb}/preview`
      : null;
    const isImageLoaded = loadedImages[item.idDrink];

    return (
      <View style={styles.card}>
        {!isImageLoaded && (
          <ActivityIndicator
            size="small"
            color="#0000ff"
            style={styles.imageLoader}
          />
        )}

        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            onLoad={() => handleImageLoad(item.idDrink)}
            onError={() => handleImageLoad(item.idDrink)}
          />
        )}
        <Text style={styles.name}>{item.strDrink}</Text>
        <Text style={styles.instructions}>{item.strInstructions}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading cocktails...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cocktail List</Text>
      <FlatList
        data={cocktails}
        keyExtractor={(item) => item.idDrink}
        renderItem={renderCocktail}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: "#f4f4f9",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    paddingTop: 15,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4f4f4f",
    marginTop: 10,
  },
  instructions: {
    fontSize: 14,
    color: "#7a7a7a",
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  imageLoader: {
    position: "absolute",
    top: 20,
    left: 20,
  },
});

export default App;
