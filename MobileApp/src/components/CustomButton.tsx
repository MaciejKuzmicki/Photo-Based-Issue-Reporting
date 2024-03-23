import {Pressable, StyleSheet, Text} from 'react-native';

const CustomButton = ({press, text, type}) => {
  return (
    <Pressable onPress={press} style={[styles.container,
    styles[`container_${type}`],
    ]}>
      <Text style={[styles.text, styles[`text_${type}`]]}>{text}</Text>
    </Pressable>
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
  container_primary: {
    backgroundColor: '#3B71F3',
  },
  container_secondary: {
    backgroundColor: '#e3e3e3',
  },
  text: {
    fontWeight: 'bold',
  },
  text_primary: {
    color: 'white',
  },
  text_secondary: {
    color: 'black',
  },
});
export default CustomButton;
