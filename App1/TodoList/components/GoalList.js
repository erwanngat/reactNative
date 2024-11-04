import React from "react";
import { FlatList } from "react-native";
import GoalItem from "./GoalItem";

const GoalList = ({ goals, onDelete }) => (
  <FlatList
    data={goals}
    renderItem={({ item, index }) => (
      <GoalItem item={item} index={index} onDelete={onDelete} />
    )}
    keyExtractor={(item, index) => index.toString()}
  />
);

export default GoalList;
