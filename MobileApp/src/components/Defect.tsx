import React from 'react';
import {Card, Text} from 'react-native-paper';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {DateFormatting} from '../utils/DateFormatting.ts';

// @ts-ignore
const Defect = ({
  id,
  description,
  imageUrl,
  date,
  locationName,
  navigation,
}) => {
  const handlePress = () => {
    navigation.navigate('Defect', {id: id});
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Card mode="outlined">
        <View style={styles.view}>
          <View style={styles.childView}>
            <Image style={styles.image} source={{uri: imageUrl}} />
          </View>
          <Card.Content style={[styles.content, {flex: 3}]}>
            <View style={{flex: 1}}>
              <Text variant="titleLarge">{locationName}</Text>
              <Text variant="bodyMedium">{description}</Text>
            </View>
            <Text variant="bodyMedium" style={styles.date}>
              {DateFormatting.formatDateTime(date)}
            </Text>
          </Card.Content>
        </View>
      </Card>
    </TouchableOpacity>
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
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  date: {
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
});

export default Defect;
