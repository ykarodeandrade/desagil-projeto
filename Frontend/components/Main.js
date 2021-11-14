import React from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { useTheme } from 'react-native-paper';

import { Icon } from '../lib';

import Gatos from './gatos/Main';
import Doadores from './doadores/Main';

import styles from '../styles/Main.json';

const Tab = createMaterialBottomTabNavigator();

export default function Main(props) {
    const theme = useTheme();

    return (
        <Tab.Navigator initialRouteName="Doadores" screenOptions={theme.screenOptions}>
            <Tab.Screen name="Gatos" component={Gatos} options={{ tabBarIcon: ({ color }) => <Icon name="cat" color={color} /> }} />
            <Tab.Screen name="Doadores" component={Doadores} options={{ tabBarIcon: ({ color }) => <Icon name="charity" color={color} /> }} />
        </Tab.Navigator>
    );
}
