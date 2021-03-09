import { DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import {DefaultTheme as NavigationDefaultTheme} from '@react-navigation/native';
import merge from 'deepmerge';

export const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);

export const theme = {
  ...CombinedDefaultTheme,
  colors: {
    ...CombinedDefaultTheme.colors,
    primary: '#c15050',
    secondary: '#414757',
    error: '#f13a59',
  },
};
