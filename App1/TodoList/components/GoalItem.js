import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const GoalItem = ({ item, index, onDelete, onEdit }) => (
  <View style={styles.item}>
    <Text style={styles.text}>{item}</Text>
    <TouchableOpacity onPress={() => onEdit(index)}>
      <Text style={styles.icon}>✏️</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onDelete(index)}>
      <Text style={styles.deleteText}>❌</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
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
});

export default GoalItem;
