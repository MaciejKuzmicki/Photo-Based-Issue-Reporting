import {Button, Card, Text} from 'react-native-paper';
import {DateFormatting} from '../utils/DateFormatting.ts';
import {Dimensions, Image, StyleSheet, View} from 'react-native';

const Defect = ({
  id,
  description,
  location,
  imageUrl,
  isFixed,
  defectCategory,
  date,
}) => {
  return (
    <Card mode="outlined">
      <View style={styles.view}>
        <View style={styles.childView}>
          <Image style={styles.image} source={{uri: imageUrl}} />
        </View>
        <Card.Content style={{flex: 3}}>
          <Text variant="titleLarge">{location}</Text>
          <Text variant="bodyMedium">{description}</Text>
          <Text variant="bodyMedium" style={{fontWeight: 'bold'}}>
            {DateFormatting.formatDateTime(date)}
          </Text>
        </Card.Content>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 15,
    marginLeft: 5,
  },
  childView: {
    flex: 2,
    justifyContent: 'center',
    maxHeight: 250,
    maxWidth: 250,
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default Defect;
