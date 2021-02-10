import {createContext} from 'react';
import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
  } from '@react-navigation/native';
  import{DarkTheme as PaperDarkTheme, DefaultTheme as PaperDefaultTheme, Provider as PaperProvider} from 'react-native-paper'
  import merge from 'deepmerge';
  
//theming
export const CombinedDefaultTheme = merge(PaperDefaultTheme,NavigationDefaultTheme);
export const CombinedDarkTheme = merge(PaperDarkTheme,NavigationDarkTheme);


export const PreferencesContext = createContext({
    toggleTheme: () => {},
  isThemeDark: false,
})