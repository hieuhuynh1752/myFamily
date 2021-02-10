import React, {
  createContext,
  useCallback,
  useMemo,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
import {
  configureFonts,
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import merge from 'deepmerge';
import AsyncStorage from '@react-native-community/async-storage';

//fonts
const fontConfig = {
  default: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'normal',
    },
  },
};

export const CombinedDefaultTheme = merge(
  PaperDefaultTheme,
  NavigationDefaultTheme,
);
export const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

export const ThemeContext = createContext({
  toggleTheme: () => {},
  isThemeDark: false,
});

export const ThemeContextProvider = (props) => {
  //theme-setup
  const [isThemeDark, setIsThemeDark] = useState(false);
  //theming
  const CustomDefaultTheme = {
    ...CombinedDefaultTheme,
    fonts: configureFonts(fontConfig),
    roundness: 30,
    colors: {
      ...CombinedDefaultTheme.colors,
      matcha: '#99bbad',
      accent: '#ebd8b7',
      milo: '#c6a9a3',
      primary: '#a4ebf3',
    },
  };

  // const CustomPaperDarkTheme = {
  //   ...PaperDarkTheme,
  //   fonts: configureFonts(fontConfig),
  //   roundness: 30,
  //   // colors:{
  //   //   ...PaperDefaultTheme.colors,
  //   //   primary: "#99bbad",
  //   //   accent: "#ebd8b7",
  //   //   milo: "#c6a9a3",

  //   // }
  // };

  let theme = isThemeDark ? CombinedDarkTheme : CustomDefaultTheme;

  const toggleTheme = useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const preferences = useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark],
  );
  //end of theme-setup

  useEffect(() => {
    AsyncStorage.setItem(
      '@preferences',
      JSON.stringify(preferences.isThemeDark),
    );
  }, [preferences]);

  useEffect(() => {
    const getStorageItem = async () => {
      let savedPreferences = await AsyncStorage.getItem(
        '@preferences',
        (error, value) => {
          JSON.parse(value);
        },
      );
      //console.log(savedState);
      if (savedPreferences !== null) {
        setIsThemeDark(savedPreferences);
      }
    };
    getStorageItem();
  }, []);

  return (
    <ThemeContext.Provider value={preferences}>
      <PaperProvider value={theme}>
        <NavigationContainer value={theme} props={theme}>
          {props.children}
        </NavigationContainer>
      </PaperProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
