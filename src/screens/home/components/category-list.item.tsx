import React from "react";
import { Category, Model } from "../../../typings";
import { StyleSheet, Text, View } from "react-native";
import { SubList } from "./sub-list";

type Props = {
  category: Category;
  onModelPress: (model: Model) => void;
};

export const CategoryListItem: React.FC<Props> = ({
  category,
  onModelPress,
}) => {
  return (
    <View>
      <Text style={styles.title}>{category.category}</Text>
      <SubList links={category.links} onModelPress={onModelPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    backgroundColor: "blue",
    color: "white",
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
});
