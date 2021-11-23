import React from 'react';

import { View } from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';

import { IconButton, Title, useTheme } from 'react-native-paper';

import TelaA from './TelaA';
import TelaB from './TelaB';

import styles from '../styles/Main.json';

const Drawer = createDrawerNavigator();

export default function Main(props) {
    const theme = useTheme();

    // Essas atribuições abaixo não são estritamente
    // necessárias. Eu as incluí para usar as cores do
    // tema, mas nada impede de fazer tudo hardcoded.
    const headerStyle = {
        ...theme.screenOptions.headerStyle,
        ...styles.header,
    };
    const headerTintColor = theme.screenOptions.headerTintColor;
    const headerTitleStyle = theme.screenOptions.headerTitleStyle;

    // Esta é a atribuição que realmente interessa.
    // A variável screenOptions deve ser passada como
    // prop do Navigator, independente de qual seja.
    const screenOptions = {

        // Esta linha não é estritamente necessária.
        // Eu a incluí para usar os estilos do tema,
        // mas nada impede de fazer tudo hardcoded.
        ...theme.screenOptions,

        // Esta é a parte que realmente interessa. O return
        // pode ter o código que você quiser. Esse código
        // será usado como header de todas as telas. Note
        // que os parâmetros navigation e route posseum
        // informações como o nome da tela e ações como
        // abrir a gaveta (neste caso específico do drawer).
        header: ({ navigation, route }) => {
            return (
                <View style={headerStyle}>
                    <IconButton icon="menu" color={headerTintColor} onPress={navigation.openDrawer} />
                    <Title style={headerTitleStyle}>{route.name}</Title>
                </View>
            );
        },

        // Se você quiser fazer um botão de voltar, pode
        // usar "arrow-left" como nome do ícone e usar
        // navigation.goBack como a função do onPress.

    };

    return (
        <Drawer.Navigator initialRouteName="TelaA" screenOptions={screenOptions}>
            <Drawer.Screen name="TelaA" component={TelaA} />
            <Drawer.Screen name="TelaB" component={TelaB} />
        </Drawer.Navigator>
    );
}
