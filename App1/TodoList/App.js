import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import GoalInput from "./components/GoalInput";
import GoalList from "./components/GoalList";
import useGoals from "./hooks/useGoals";

const backgroundImage = require("./assets/bg-image.jpg");

export default function App() {
  const { goals, text, setText, deleteGoalHandler, addGoalHandler } = useGoals();

  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>List of objectives</Text>
      </View>
      <StatusBar style="auto" />
      <GoalList goals={goals} onDelete={deleteGoalHandler} />
      <GoalInput
        text={text}
        onChangeText={setText}
        onAddGoal={addGoalHandler}
      />
    </ImageBackground>
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
});
