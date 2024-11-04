import React from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

const GoalInput = ({ text, onChangeText, onAddGoal }) => (
  <View style={styles.addGoal}>
    <TextInput
      style={styles.input}
      onChangeText={onChangeText}
      value={text}
      placeholder="Enter a new goal"
    />
    <View style={styles.buttonAddContainer}>
      <Button title="Add a new goal" onPress={onAddGoal} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  addGoal: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  buttonAddContainer: {
    paddingTop: 10,
    marginLeft: 10,
  },
});

export default GoalInput;
