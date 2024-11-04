import { useState } from "react";
import { Alert } from "react-native";

const useGoals = () => {
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
  const [text, setText] = useState("");

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
      setText("");
    } else {
      Alert.alert("Erreur", "Please enter a goal.");
    }
  };

  return {
    goals,
    text,
    setText,
    deleteGoalHandler,
    addGoalHandler,
  };
};

export default useGoals;
