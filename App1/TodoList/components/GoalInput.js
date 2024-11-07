import React from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const GoalInput = ({ text, onChangeText, onAddGoal }) => (
  <View style={styles.addGoal}>
    <TextInput
      style={styles.input}
      onChangeText={onChangeText}
      value={text}
      placeholder="Enter a new goal"
    />
    <View style={styles.buttonAddContainer}>
      <TouchableOpacity onPress={onAddGoal} activeOpacity={0.7}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Add a new goal</Text>
        </View>
      </TouchableOpacity>
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
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default GoalInput;
