import React, { useState } from 'react';

import { ScrollView, Image } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Portal, Button, Surface, ActivityIndicator, TouchableRipple, TextInput, HelperText, List, Snackbar } from 'react-native-paper';

import { AspectView, Icon, useCamera } from '../../lib';

import styles from '../../styles/doadores/Ficha.json';

export default function Ficha(props) {
    const { route } = props;

    const doador = route.params;

    const [photoError, setPhotoError] = useState(false);
    const [name, setName] = useState(doador ? doador.nome : '');
    const [nameError, setNameError] = useState(true);
    const [cpf, setCpf] = useState(doador ? doador.nome : '');
    const [cpfError, setCpfError] = useState(true);

    const { camera, photo, Preview } = useCamera(doador ? doador.foto : null);

    function onPressPhoto() {
        camera.activate();
    }

    function onPressPreview() {
        setPhotoError(true);
        camera.take();
        camera.deactivate();
    }

    function onChangeTextCpf(text) {
        setCpf(text);
        setCpfError(!text.trim());
    }

    function onChangeTextName(text) {
        setName(text);
        setNameError(!text.trim());
    }

    return (
        <>
            {camera.active ? (
                <Portal>
                    <Preview style={{ flexGrow: 1 }}>
                        <Button onPress={onPressPreview}>Hey!</Button>
                    </Preview>
                </Portal>
            ) : (
                <ScrollView>
                    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
                        <AspectView style={styles.photoOuter}>
                            <Surface style={styles.photoSurface}>
                                {photo.saving ? (
                                    <ActivityIndicator style={styles.photoInner} size="large" />
                                ) : (
                                    <TouchableRipple style={styles.photoInner} onPress={onPressPhoto}>
                                        {photo.uri === null ? (
                                            <Icon style={styles.icon} name="camera" />
                                        ) : (
                                            <Image style={styles.photo} source={{ uri: photo.uri }} resizeMode="stretch" />
                                        )}
                                    </TouchableRipple>
                                )}
                            </Surface>
                        </AspectView>
                        <TextInput style={styles.input} label="CPF" value={cpf} error={cpfError} onChangeText={onChangeTextCpf} />
                        {cpfError && (
                            <HelperText style={styles.error} type="error">
                                CPF é obrigatório
                            </HelperText>
                        )}
                        <TextInput style={styles.input} label="Nome" value={name} error={nameError} onChangeText={onChangeTextName} />
                        {nameError && (
                            <HelperText style={styles.error} type="error">
                                Nome é obrigatório
                            </HelperText>
                        )}
                        <List.Accordion title="Favorecidos" left={(props) => <List.Icon {...props} icon="cat" />}>
                        </List.Accordion>
                    </SafeAreaView>
                </ScrollView>
            )}
            {!photo.saving && !photo.valid && (
                <Snackbar visible={photoError} action={{ label: 'Ok', onPress: () => setPhotoError(false) }} onDismiss={() => { }}>
                    {camera.allowed ? 'Não foi possível salvar a foto.' : 'Não foi possível acessar a câmera.'}
                </Snackbar>
            )}
        </>
    );
}
