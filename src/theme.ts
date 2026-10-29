import { Platform } from 'react-native';
const theme = {
  colors: { text: '#24292e', muted: '#586069', primary: '#0366d6', background: '#e1e4e8', surface: '#ffffff', appBar: '#24292e', error: '#b42335', border: '#8c959f' },
  fontFamily: Platform.select({ android: 'Roboto', ios: 'Arial', default: 'System' }),
};
export default theme;
