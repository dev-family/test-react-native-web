import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {useScreenInsets} from '../ui/constants/insets';

type CreateStylesData = {
  insets: ReturnType<typeof useScreenInsets>;
};

type CreateStylesCallback = (
  data: CreateStylesData,
) => Record<string, ViewStyle | TextStyle>;

export class AppStyleSheet {
  public insets: CreateStylesData['insets'] = {
    insetsBottom: 0,
    insetsHorizontal: 0,
    insetsTop: 0,
    insetsTopHeader: 0,
  };

  public init(insets: CreateStylesData['insets']) {
    this.insets = insets;
  }

  public create(func: CreateStylesCallback) {
    const data = func({insets: this.insets});

    return StyleSheet.create(data);
  }
}

export const Styles = new AppStyleSheet();
