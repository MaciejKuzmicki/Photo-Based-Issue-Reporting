import {StyleSheet, View} from 'react-native';
import React from 'react';
import { Button } from 'react-native-paper';


// @ts-ignore
const FloatingButton = ({press, text}) => {
  return (
    <View style={styles.button}>
      <Button mode="contained" onPress={press}>
        {text}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 5,
  },
  text: {
    fontWeight: 'bold',
  },
  button: {
    position: 'absolute',
    right: 10,
    bottom: 30,
  },
});

export default FloatingButton;
