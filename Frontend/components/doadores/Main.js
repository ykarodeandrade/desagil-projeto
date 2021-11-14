import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { useTheme } from 'react-native-paper';

import Lista from './Lista';
import Ficha from './Ficha';

import styles from '../../styles/doadores/Main.json';

const Stack = createStackNavigator();

export default function Main(props) {
    const theme = useTheme();

    return (
        <Stack.Navigator initialRouteName="ListaDoadores" screenOptions={theme.screenOptions}>
            <Stack.Screen name="ListaDoadores" component={Lista} options={{ headerShown: false }} />
            <Stack.Screen name="FichaDoador" component={Ficha} />
        </Stack.Navigator>
    );
}
