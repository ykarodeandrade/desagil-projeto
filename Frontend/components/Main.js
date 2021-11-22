import React, { useState } from 'react';

import { View } from 'react-native';

import { Portal, Text, Button, Snackbar } from 'react-native-paper';

import { useScanner } from '../lib';

import styles from '../styles/Main.json';

export default function Main(props) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);

    const { scanner, Preview } = useScanner();

    function onBarCodeScanned(result) {
        setData(result.data);
        scanner.deactivate();
    }

    function onPress() {
        setError(true);
        scanner.activate();
    }

    return (
        <>
            {scanner.active ? (
                <Portal>
                    <Preview style={styles.preview} onBarCodeScanned={onBarCodeScanned} />
                </Portal>
            ) : (
                <View style={styles.container}>
                    {data && (
                        <Text style={styles.input}>
                            {data}
                        </Text>
                    )}
                    <Button style={styles.input} onPress={onPress}>
                        Escanear
                    </Button>
                </View>
            )}
            {scanner.broken && (
                <Snackbar visible={error} action={{ label: 'Ok', onPress: () => setError(false) }} onDismiss={() => { }}>
                    Não foi possível acessar a câmera.
                </Snackbar>
            )}
        </>
    );
}
