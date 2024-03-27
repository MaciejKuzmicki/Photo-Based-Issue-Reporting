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
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 2}}>
          <Image style={{resizeMode: 'center'}} source={{uri: imageUrl}} />
        </View>
        <Card.Content style={{flex: 3}}>
          <Text variant="titleLarge">{location}</Text>
          <Text variant="bodyMedium">{description}</Text>
          <Text variant="bodyMedium">
            {DateFormatting.formatDateTime(date)}
          </Text>
        </Card.Content>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    resizeMode: 'center',
    borderRadius: 15,
    marginLeft: 5,
  },
});
export default Defect;
