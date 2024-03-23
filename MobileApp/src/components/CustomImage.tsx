import { Dimensions, Image, StyleSheet } from "react-native";

// @ts-ignore
const CustomImage = ({source}) => {
  return <Image style={styles.image} source={{uri: source}} />;
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  image: {
    marginBottom: 20,
    borderRadius: 30,
    width: screenWidth * 0.6,
    height: screenHeight * 0.28,
  },
});
export default CustomImage;
