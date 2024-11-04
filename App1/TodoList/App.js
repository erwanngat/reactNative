import React from "react";
import { StyleSheet, Text, View } from "react-native";
import GoalInput from "./components/GoalInput";
import GoalList from "./components/GoalList";
import { StatusBar } from "expo-status-bar";
import useGoals from "./hooks/useGoals";

export default function App() {
  const { goals, text, setText, deleteGoalHandler, addGoalHandler } =
    useGoals();

  return (
    <View style={styles.container}>
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
});
