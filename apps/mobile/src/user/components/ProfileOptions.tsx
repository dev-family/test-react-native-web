import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {ProfileItem, ProfileItemProps} from './ProfileItem';
import {Colors} from '../../ui/constants/colors';
import {BlurView} from 'expo-blur';

type ProfileOptionProps = {
  options: ProfileItemProps[];
  style?: StyleProp<ViewStyle>;
};

export const ProfileOptions: React.FC<ProfileOptionProps> = ({
  options,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {options.map((option, index) => (
        <ProfileItem
          key={option.title}
          {...option}
          withBorderBottom={index !== options.length - 1}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.dark,
  },
});
