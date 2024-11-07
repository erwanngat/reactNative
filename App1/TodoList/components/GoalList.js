import React from "react";
import { FlatList } from "react-native";
import GoalItem from "./GoalItem";

const GoalList = ({ goals, onDelete, onEdit }) => (
  <FlatList
    data={goals}
    renderItem={({ item, index }) => (
      <GoalItem item={item} index={index} onDelete={onDelete} onEdit={onEdit} />
    )}
    keyExtractor={(item, index) => index.toString()}
  />
);

export default GoalList;
