import React, { useState } from 'react';

import { ScrollView } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityIndicator, TouchableRipple, Snackbar } from 'react-native-paper';

import { AspectView, Icon, useStorage } from '../../lib';

import styles from '../../styles/doadores/Ficha.json';

export default function Ficha(props) {
    const { navigation, route } = props;

    const doador = route.params;

    const [photoError, setPhotoError] = useState(false);

    const { take, file } = useStorage(doador ? doador.foto : null);

    function onPressPhoto() {
        setPhotoError(true);
        take(true);
    }

    return (
        <>
            <ScrollView>
                <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
                    <AspectView style={styles.photoOuter}>
                        {file.loading ? (
                            <ActivityIndicator style={styles.photoInner} size="large" />
                        ) : (
                            <TouchableRipple style={styles.photoInner} onPress={onPressPhoto}>
                                {file.uri === null ? (
                                    <Icon name="camera" />
                                ) : (
                                    <Image style={styles.photo} source={{ uri: file.uri }} resizeMode="stretch" />
                                )}
                            </TouchableRipple>
                        )}
                    </AspectView>
                </SafeAreaView>
            </ScrollView>
            {!file.loading && !file.valid && (
                <Snackbar visible={photoError} action={{ label: 'Ok', onPress: () => setPhotoError(false) }} onDismiss={() => { }}>
                    Não foi possível carregar.
                </Snackbar>
            )}
        </>
    );
}
