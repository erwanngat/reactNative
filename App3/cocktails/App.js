import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const CocktailListScreen = ({ setFavorites, favorites }) => {
  const navigation = useNavigation();
  const [cocktails, setCocktails] = useState([]);
  const [loading, setLoading] = useState(true);
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
    const isFavorite = favorites.some((fav) => fav.idDrink === item.idDrink);

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("CocktailDetails", { cocktailId: item.idDrink })
        }
      >
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

          {isFavorite && (
            <FontAwesome
              name="star"
              size={24}
              color="#FFD700"
              style={styles.favoriteIcon}
            />
          )}
        </View>
      </TouchableOpacity>
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

  return (
    <View style={styles.container}>
      <FlatList
        data={cocktails}
        keyExtractor={(item) => item.idDrink}
        renderItem={renderCocktail}
      />
    </View>
  );
};

const CocktailDetailsScreen = ({ route, favorites, setFavorites }) => {
  const { cocktailId } = route.params;
  const [cocktail, setCocktail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCocktailDetails = async () => {
      try {
        const response = await axios.get(
          `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktailId}`
        );
        setCocktail(response.data.drinks[0]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cocktail details:", err);
      }
    };

    fetchCocktailDetails();
  }, [cocktailId]);

  const toggleFavorite = (cocktail) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((fav) => fav.idDrink === cocktail.idDrink)) {
        return prevFavorites.filter((fav) => fav.idDrink !== cocktail.idDrink);
      } else {
        return [...prevFavorites, cocktail];
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading cocktail details...</Text>
      </View>
    );
  }

  if (!cocktail) {
    return (
      <View style={styles.centered}>
        <Text>Could not load cocktail details.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{cocktail.strDrink}</Text>
      <Image source={{ uri: cocktail.strDrinkThumb }} style={styles.image} />
      <Text style={styles.instructions}>{cocktail.strInstructions}</Text>

      <TouchableOpacity
        onPress={() => toggleFavorite(cocktail)}
        style={styles.favoriteIcon}
      >
        <FontAwesome
          name={
            favorites.some((fav) => fav.idDrink === cocktail.idDrink)
              ? "star"
              : "star-o"
          }
          size={24}
          color={
            favorites.some((fav) => fav.idDrink === cocktail.idDrink)
              ? "#FFD700"
              : "#ccc"
          }
        />
      </TouchableOpacity>
    </View>
  );
};

const FavoriteCocktailsScreen = ({ favorites, navigation }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.idDrink}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CocktailDetails", {
                cocktailId: item.idDrink,
              })
            }
          >
            <View style={styles.card}>
              <Text style={styles.name}>{item.strDrink}</Text>
              <Image
                source={{ uri: item.strDrinkThumb }}
                style={styles.image}
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};


const Stack = createStackNavigator();

const App = () => {
  const [favorites, setFavorites] = useState([]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CocktailList">
        <Stack.Screen
          name="CocktailList"
          component={(props) => (
            <CocktailListScreen
              {...props}
              setFavorites={setFavorites}
              favorites={favorites}
            />
          )}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("FavoriteCocktails")}
                style={styles.favoriteIcon}
              >
                <FontAwesome name="star" size={24} color="#FFD700" />
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="CocktailDetails"
          component={(props) => (
            <CocktailDetailsScreen
              {...props}
              favorites={favorites}
              setFavorites={setFavorites}
            />
          )}
        />

        <Stack.Screen name="FavoriteCocktails">
          {(props) => (
            <FavoriteCocktailsScreen {...props} favorites={favorites} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
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
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: "center",
  },
  imageLoader: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  favoriteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default App;