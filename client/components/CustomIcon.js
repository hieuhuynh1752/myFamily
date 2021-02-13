import * as React from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const CustomIcon = (props) => {
  return (
    <View>
      <Icon
        name={props.name}
        size={props.size}
      />
    </View>
  );
};

export default CustomIcon;