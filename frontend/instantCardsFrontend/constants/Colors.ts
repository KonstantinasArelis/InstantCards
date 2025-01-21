/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// const tintColorLight = '#0a7ea4';
// const tintColorDark = '#fff';

const tintColorLight = 'rgb(232, 219, 255)';
const tintColorDark = 'rgb(152, 98, 252)';

const primaryColor = 'rgb(140,78,255)';
const white = 'rgb(255, 255, 255)';

export const Colors = {
  light: {
    text: primaryColor,
    background: white,
    tint: tintColorLight,
    icon: 'rgb(104, 112, 118)',
    // tabIconDefault: '#687076',
    tabIconDefault: 'rgb(217, 200, 255)',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: white,
    background: primaryColor,
    tint: tintColorDark,
    icon: 'rgb(155, 161, 166)',
    tabIconDefault: 'rgb(155, 161, 166)',
    tabIconSelected: tintColorDark,
  },
};
