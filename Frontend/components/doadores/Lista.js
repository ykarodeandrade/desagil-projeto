import React from 'react';

import { View } from 'react-native';

import { FAB } from 'react-native-paper';

import styles from '../../styles/doadores/Lista.json';

export default function Lista(props) {
    const { navigation } = props;

    return (
        <>
            <View style={styles.container}>
            </View>
            <FAB style={styles.fab} icon="plus" onPress={() => navigation.navigate('FichaDoador', null)} />
        </>
    );
}
