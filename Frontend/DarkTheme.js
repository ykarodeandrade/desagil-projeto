import DefaultTheme from './DefaultTheme';

export default {
    ...DefaultTheme,
    dark: true,
    mode: 'adaptive',
    colors: {
        primary: '#bb86fc',
        secondary: '#000000',
        accent: '#03dac6',
        background: '#121212',
        card: 'rgb(18, 18, 18)',
        surface: '#121212',
        error: '#cf6679',
        onSurface: '#ffffff',
        text: '#ffffff',
        border: 'rgb(39, 39, 41)',
        disabled: 'rgba(255, 255, 255, 0.38)',
        placeholder: 'rgba(255, 255, 255, 0.54)',
        backdrop: 'rgba(0, 0, 0, 0.5)',
        notification: '#ff80ab',
    },
    screenOptions: {
        headerStyle: {
            backgroundColor: '#bb86fc',
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
            color: '#000000',
        },
    },
};
