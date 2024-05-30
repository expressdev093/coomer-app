import React from "react";
import { Model } from "../../../typings";
import { FlatList } from "react-native";
import { ProfileListItem } from "./profile-list.item";

type Props = {
  links: Model[];
  onModelPress: (model: Model) => void;
};

export const SubList: React.FC<Props> = ({ links, onModelPress }) => {
  return (
    <FlatList
      data={links}
      keyExtractor={(item, index) => `${index}_${item.id}`}
      renderItem={({ item }) => (
        <ProfileListItem model={item} onModelPress={onModelPress} />
      )}
    />
  );
};
