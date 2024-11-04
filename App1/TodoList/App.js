import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [text, onChangeText] = useState("");
  const [goals, setGoals] = useState([
    "Faire les courses",
    "Aller à la salle de sport 3 fois par semaine",
    "Monter à plus de 5000m d'altitude",
    "Acheter mon premier appartement",
    "Perdre 5 kgs",
    "Gagner en productivité",
    "Apprendre un nouveau langage",
    "Faire une mission en freelance",
    "Organiser un meetup autour de la tech",
    "Faire un triathlon",
  ]);

  const renderItem = ({ item, index }) => (
    <View style={styles.item}>
      <Text style={styles.text}>{item}</Text>
      <TouchableOpacity onPress={() => deleteGoalHandler(index)}>
        <Text style={styles.deleteText}>❌</Text>
      </TouchableOpacity>
    </View>
  );

  const deleteGoalHandler = (index) => {
    setGoals((currentGoals) => {
      const updatedGoals = [...currentGoals];
      updatedGoals.splice(index, 1);
      return updatedGoals;
    });
  };

  const addGoalHandler = () => {
    if (text) {
      setGoals((currentGoals) => [...currentGoals, text]);
      onChangeText("");
    } else {
      Alert.alert("Erreur", "Veuillez entrer un objectif.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Liste objectifs</Text>
      </View>
      <StatusBar style="auto" />
      <FlatList
        data={goals}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.addGoal}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          placeholder="Enter a new goal"
        />
        <View style={styles.buttonAddContainer}>
          <Button title="Add a new goal" onPress={addGoalHandler} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  titleText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  container: {
    paddingTop: 50,
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    flex: 1,
  },
  deleteText: {
    fontSize: 20,
    color: "red",
    marginLeft: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  addGoal: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  buttonAddContainer: {
    paddingTop: 18,
    marginLeft: 10,
  },
});