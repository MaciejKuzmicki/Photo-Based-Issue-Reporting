import {Button, Card, Text} from 'react-native-paper';

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
    <Card>
      <Card.Cover source={{uri: `${imageUrl}`}} />
      <Card.Content>
        <Text variant="titleLarge">{description}</Text>
        <Text variant="bodyMedium">{date}</Text>
      </Card.Content>
    </Card>
  );
};

export default Defect;
