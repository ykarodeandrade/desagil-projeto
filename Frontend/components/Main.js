import React from 'react';

import { View } from 'react-native';

import { AspectImage } from '../lib';

import styles from '../styles/Main.json';

export default function Main(props) {
    return (
        <View style={styles.container}>
            <AspectImage style={styles.image} basis="width" source={require('../img/1.jpg')} />
        </View>
    );
}
