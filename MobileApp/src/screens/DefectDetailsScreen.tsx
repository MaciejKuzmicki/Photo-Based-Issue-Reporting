import React, {useEffect, useState} from 'react';
import {DefectService} from '../services/DefectService.ts';
import {DefectDetailsDto} from '../DTO/DefectDetailsDto.ts';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Divider, Text} from 'react-native-paper';
import {DateFormatting} from '../utils/DateFormatting.ts';

const DefectDetailsScreen = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [defect, setDefect] = useState<DefectDetailsDto>();
  const {id} = route.params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await DefectService.getDefect(id);
        if (result != null) {
          setDefect(result);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch defect');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handlePress = () => {
    console.log(defect?.location);
    Linking.openURL(defect?.location).catch(err =>
      console.error('Failed to open URL:', defect?.description),
    );
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }
  return (
    <View style={styles.view}>
      <View style={styles.childView}>
        <Image style={styles.image} source={{uri: defect?.imageUrl}} />
      </View>
      <View style={[styles.content, {flex: 3}]}>
        <View style={{flex: 1}}>
          <TouchableOpacity onPress={handlePress}>
            <Text variant="titleLarge">{defect?.locationName}</Text>
          </TouchableOpacity>
          <Divider bold={true} />
          <Text variant="bodyMedium">{defect?.description}</Text>
          <Divider bold={true} />
          <Text variant="bodyMedium">
            {'Fixed: ' + (defect?.isFixed ? 'True' : 'False')}
          </Text>
          <Divider bold={true} />
          <Text variant="bodyMedium">
            {'Category: ' + defect?.defectCategory}
          </Text>
          <Divider bold={true} />
          <Text>
            Reported Date:{' '}
            <Text style={styles.date}>
              {DateFormatting.formatDateTime(defect?.dateReported)}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 15,
    marginLeft: -5,
  },
  childView: {
    flex: 2,
    justifyContent: 'center',
    maxHeight: 300,
    maxWidth: 250,
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    marginRight: 20,
  },
  date: {
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginVertical: 10, // Adjust as needed
  },
});

export default DefectDetailsScreen;
