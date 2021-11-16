import React, { useState } from 'react';

import { View, Image, ScrollView } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { TouchableRipple, Title, Divider, ActivityIndicator, Text, Button, FAB, Snackbar } from 'react-native-paper';

import { Rounded, Icon, useSignal, useEmit, useEffect, useRequest, map } from '../../lib';

import settings from '../../settings.json';

import styles from '../../styles/doadores/Lista.json';

function DonorItem(props) {
    const { navigation, doador } = props;
    return (
        <>
            <TouchableRipple style={styles.itemContainer} onPress={() => navigation.navigate('FichaDoador', doador)}>
                <View style={styles.item}>
                    <Rounded>
                        <View style={styles.photoContainer}>
                            {doador.foto ? (
                                <Image style={styles.photo} source={{ uri: doador.foto }} resizeMode="stretch" />
                            ) : (
                                <Icon name="account" />
                            )}
                        </View>
                    </Rounded>
                    <Title style={styles.name}>
                        {doador.nome}
                    </Title>
                </View>
            </TouchableRipple>
            <Divider />
        </>
    );
}

export default function Lista(props) {
    const { navigation } = props;

    const [getError, setGetError] = useState(false);

    const signal = useSignal('updated-donors');
    const emit = useEmit('updated-donors');

    const { get, response } = useRequest(settings.url);

    useEffect(() => {
        setGetError(true);
        get('/doador/list');
    }, [signal]);

    return (
        <>
            {response.running ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                response.success ? (
                    response.body === null || response.body.length === 0 ? (
                        <View style={styles.center}>
                            <Text>
                                Nenhum doador cadastrado
                            </Text>
                        </View>
                    ) : (
                        <ScrollView>
                            <SafeAreaView style={styles.container}>
                                {map(response.body, (doador) => <DonorItem navigation={navigation} doador={doador} />)}
                            </SafeAreaView>
                        </ScrollView>
                    )
                ) : (
                    <View style={styles.center}>
                        <Button mode="contained" onPress={emit}>
                            Tentar novamente
                        </Button>
                    </View>
                )
            )}
            <FAB style={styles.fab} icon="plus" onPress={() => navigation.navigate('FichaDoador', null)} />
            {!response.running && !response.success && (
                <Snackbar visible={getError} action={{ label: 'Ok', onPress: () => setGetError(false) }} onDismiss={() => { }}>
                    {response.body.status === 0 ? 'Não foi possível conectar ao servidor' : `ERROR ${response.body.status}: ${response.body.message}`}
                </Snackbar>
            )}
        </>
    );
}
