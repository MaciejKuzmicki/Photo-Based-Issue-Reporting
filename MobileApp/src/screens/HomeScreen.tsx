import {useEffect, useState} from 'react';
import {DefectDto} from '../DTO/DefectDto.ts';
import {DefectService} from '../services/DefectService.ts';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Defect from '../components/Defect.tsx';
import CustomButton from '../components/CustomButton.tsx';
import FloatingButton from '../components/FloatingButton.tsx';

// @ts-ignore
const HomeScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [defects, setDefects] = useState<DefectDto[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await DefectService.getMyDefects();

        if (result != null) {
          setDefects(result);
        }
      } catch (error) {
        Alert.alert('Error', 'XD');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <ActivityIndicator />;
  }
  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}}>
        {defects.map(item => (
          <Defect
            key={item.id}
            id={item.id}
            description={item.description}
            location={item.location}
            imageUrl={item.imageUrl}
            isFixed={item.isFixed}
            defectCategory={item.defectCategory}
            date={item.dateReported}
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
