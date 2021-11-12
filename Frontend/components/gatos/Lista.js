import React, { useState } from 'react';

import { View, ScrollView } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, ActivityIndicator, Text, Button, FAB, Snackbar } from 'react-native-paper';

import { AspectView, Icon, useSignal, useEmit, useEffect, useRequest, map } from '../../lib';

import settings from '../../settings.json';

import styles from '../../styles/gatos/Lista.json';

function CatCard(props) {
    const { navigation, gato } = props;
    return (
        <View style={styles.cell}>
            <Card style={styles.card} onPress={() => navigation.navigate('Ficha', gato)}>
                <Card.Title title={gato.nome} />
                <AspectView>
                    {gato.foto ? (
                        <Card.Cover style={styles.cover} source={{ uri: gato.foto }} resizeMode="stretch" />
                    ) : (
                        <Icon name="cat" />
                    )}
                </AspectView>
            </Card>
        </View>
    );
}

export default function Lista(props) {
    const { navigation } = props;

    const [getError, setGetError] = useState(false);

    const signal = useSignal('updated-cats');
    const emit = useEmit('updated-cats');

    const { get, response } = useRequest(settings.url);

    useEffect(() => {
        setGetError(true);
        get('/gato/list');
    }, [signal]);

    return (
        <>
            {response.running ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                response.success ? (
                    response.body !== null && response.body.length > 0 ? (
                        <ScrollView>
                            <SafeAreaView style={styles.container}>
                                {map(response.body, (gato) => <CatCard navigation={navigation} gato={gato} />)}
                            </SafeAreaView>
                        </ScrollView>
                    ) : (
                        <View style={styles.center}>
                            <Text>
                                Nenhum gato cadastrado
                            </Text>
                        </View>
                    )
                ) : (
                    <View style={styles.center}>
                        <Button mode="contained" onPress={emit}>
                            Tentar novamente
                        </Button>
                    </View>
                )
            )}
            <FAB style={styles.fab} icon="plus" onPress={() => navigation.navigate('Ficha', null)} />
            {!response.running && !response.success && (
                <Snackbar visible={getError} action={{ label: 'Ok', onPress: () => setGetError(false) }} onDismiss={() => { }}>
                    {response.body.status === 0 ? 'Não foi possível conectar' : `ERROR ${response.body.status}: ${response.body.message}`}
                </Snackbar>
            )}
        </>
    );
}
