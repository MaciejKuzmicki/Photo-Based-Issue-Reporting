import {useEffect, useState} from 'react';
import {DefectDto} from '../DTO/DefectDto.ts';
import {DefectService} from '../services/DefectService.ts';
import {ActivityIndicator, Alert, ScrollView, View} from 'react-native';
import Defect from '../components/Defect.tsx';
import FloatingButton from '../components/FloatingButton.tsx';

// @ts-ignore
const HomeScreen = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [defects, setDefects] = useState<DefectDto[]>([]);

  useEffect(() => {
    if (route.params?.shouldRefresh) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const result = await DefectService.getMyDefects();
          if (result != null) {
            setDefects(result);
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to fetch defects');
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
      navigation.setParams({shouldRefresh: false});
    }
  }, [route.params?.shouldRefresh]);

  if (isLoading) {
    return <ActivityIndicator />;
  }
  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}}>
        {defects.map(item => (
          <Defect
            navigation={navigation}
            key={item.id}
            id={item.id}
            description={item.description}
            imageUrl={item.imageUrl}
            date={item.dateReported}
            locationName={item.locationName}
          />
        ))}
      </ScrollView>
      <FloatingButton
        press={() => navigation.navigate('AddDefect')}
        text="Add new defect"
      />
    </View>
  );
};

export default HomeScreen;
