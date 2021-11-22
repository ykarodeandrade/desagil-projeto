import React, { useState } from 'react';

import { View } from 'react-native';

import { ActivityIndicator, Text, Button, Snackbar } from 'react-native-paper';

import { useGPS } from '../lib';

import styles from '../styles/Main.json';

export default function Main(props) {
    const [error, setError] = useState(false);

    const { gps } = useGPS(null);

    function onPress() {
        setError(true);
        gps.update();
    }

    return (
        <>
            <View style={styles.container}>
                {gps.updating ? (
                    <ActivityIndicator style={styles.input} size="small" />
                ) : (
                    gps.location && (
                        <Text style={styles.input}>
                            {JSON.stringify(gps.location, null, 2)}
                        </Text>
                    )
                )}
                <Button style={styles.input} onPress={onPress}>
                    Atualizar
                </Button>
            </View>
            {!gps.updating && gps.broken && (
                <Snackbar visible={error} action={{ label: 'Ok', onPress: () => setError(false) }} onDismiss={() => { }}>
                    {gps.allowed ? 'Não foi possível atualizar a localização.' : 'Não foi possível acessar o GPS.'}
                </Snackbar>
            )}
        </>
    );
}
