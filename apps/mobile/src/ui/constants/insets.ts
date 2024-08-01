import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const insetsTop = 18;
const insetsBottom = 15;

export const Layout = {width, height, insetsBottom, insetsTop};

export const useScreenInsets = () => {
  const insets = useSafeAreaInsets();

  const insetsBottom = Math.max(Layout.insetsBottom, insets.bottom);

  const insetsTop = Math.max(insets.top, Layout.insetsTop);

  const insetsHorizontal = 14;
  const headerHeight = 40;
  const insetsTopHeader = insetsTop + headerHeight;

  const tabBarHeight = 35;

  const insetsTabBar = tabBarHeight + insetsBottom + 20;

  return {
    insetsBottom,
    insetsTop,
    insetsHorizontal,
    headerHeight,
    tabBarHeight,
    insetsTopHeader,
    insetsTabBar,
  };
};
