import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Modal,
  Button,
  TextInput,
} from "react-native";
import GoalInput from "./components/GoalInput";
import GoalList from "./components/GoalList";
import useGoals from "./hooks/useGoals";

const backgroundImage = require("./assets/bg-image.jpg");

export default function App() {
  const {
    goals,
    text,
    setText,
    deleteGoalHandler,
    addGoalHandler,
    editGoalHandler,
    saveGoalHandler,
    editingGoal,
  } = useGoals();

  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>List of objectives</Text>
      </View>
      <StatusBar style="auto" />

      <GoalList
        goals={goals}
        onDelete={deleteGoalHandler}
        onEdit={editGoalHandler}
      />

      <Modal
        visible={editingGoal !== null}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Edit objectif</Text>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="New objectif"
            />
            <Button title="Save" onPress={saveGoalHandler} />
            <Button
              title="Cancel"
              onPress={() => {
                setText("");
                setEditingGoal(null);
              }}
            />
          </View>
        </View>
      </Modal>

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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});
