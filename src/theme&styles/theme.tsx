type ColorTheme = {
  primary: string; //brand color
  background: string; //background color for the screens.
  card: string; //such as headers, tab bars etc.
  text: string;
  border: string; //border color of header and tab bar
  cardBackground: string;
  textColor?: string;
  notification: string;
  colors: {
    expense: string;
  };
};

type ThemeTypes = {
  dark: boolean;
  colors: ColorTheme;
};
export const Colors_Light: ThemeTypes = {
  dark: false,
  colors: {
    primary: '#595DE5',
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#000000',
    border: '#000000',
    cardBackground: '#FBFBFE',
    textColor: '#1C1E6A',
    notification: '#FFFFFF',
    colors: {
      expense: '#E0392D',
    },
  },
};

export const Colors_Dark: ThemeTypes = {
  dark: true,
  colors: {
    primary: '#595DE5',
    background: '#fff',
    card: '#FFFFFF',
    text: '#000000',
    border: '#000000',
    cardBackground: '#FBFBFE',
    notification: '#FFFFFF',
    colors: {
      expense: '#e0392d',
    },
  },
};

export const ColorsTheme = {
  expense: {
    borderColor: '#e0392d',
  },
  backgroundBanner: '#f1f1f1',
  primary: '#595DE5',
};
