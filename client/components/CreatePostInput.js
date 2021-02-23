import React, {memo} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {TextInput as Input, Card} from 'react-native-paper';
import {theme} from '../core/theme';

const CreatePostInput = ({...props}) => {
  return (
        <Input
          style={styles.input}
          selectionColor={theme.colors.primary}
          underlineColor="transparent"
          mode="outlined"
          multiline
          numberOfLines={6}
          {...props}
        />
  );
};

const styles = StyleSheet.create({
input: {
    backgroundColor: theme.colors.surface,
    marginBottom: 16,
  },
});

export default memo(CreatePostInput);
