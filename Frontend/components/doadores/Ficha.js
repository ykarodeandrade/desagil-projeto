import React, { useState } from 'react';

import { ScrollView, Image, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Portal, ActivityIndicator, FAB, Surface, TouchableRipple, TextInput, HelperText, List, Button, Snackbar, Dialog, Paragraph } from 'react-native-paper';

import { Rounded, AspectView, Icon, useEmit, useEffect, useCamera, useRequest } from '../../lib';

import settings from '../../settings.json';

import styles from '../../styles/doadores/Ficha.json';

export default function Ficha(props) {
    const { navigation, route } = props;

    const doador = route.params;

    const [photoError, setPhotoError] = useState(false);
    const [name, setName] = useState(doador ? doador.nome : '');
    const [nameError, setNameError] = useState(typeof name !== 'string' || !name.trim());
    const [cpf, setCpf] = useState(doador ? doador.cpf : '');
    const [cpfError, setCpfError] = useState(typeof cpf !== 'string' || !cpf.trim());
    const [registerError, setRegisterError] = useState(false);
    const [removeError, setRemoveError] = useState(false);
    const [removeVisible, setRemoveVisible] = useState(false);

    const emit = useEmit('updated-donors');

    const { camera, photo, Preview } = useCamera(doador ? doador.foto : null);

    const { post, put, response: registerResponse } = useRequest(settings.url);
    const { del, response: removeResponse } = useRequest(settings.url);

    function onPressPhoto() {
        camera.activate();
    }

    function onPressPreview() {
        setPhotoError(true);
        camera.take();
    }

    function onChangeTextCpf(text) {
        setCpf(text);
        setCpfError(!text.trim());
    }

    function onChangeTextName(text) {
        setName(text);
        setNameError(!text.trim());
    }

    function onPressRegister() {
        setRegisterError(true);
        const body = {
            cpf: cpf,
            nome: name,
            foto: photo.uri,
            chavesGatos: null,
        };
        if (doador) {
            put('/doador', body);
        } else {
            post('/doador', body);
        }
    }

    function onDismissRemove() {
        setRemoveVisible(false);
    }

    function onConfirmRemove() {
        onDismissRemove();
        setRemoveError(true);
        del(`/doador?cpf=${doador.cpf}`);
    }

    useEffect(() => {
        if ((registerResponse.success && registerResponse.body !== null) || (removeResponse.success && removeResponse.body !== null)) {
            emit();
            navigation.navigate('ListaDoadores');
        } else {
            navigation.setOptions({ title: doador ? doador.nome : 'Novo doador' });
        }
    }, [registerResponse, removeResponse]);

    return (
        <>
            {camera.active ? (
                <Portal>
                    <Preview style={styles.preview}>
                        {photo.taking ? (
                            <ActivityIndicator size="large" />
                        ) : (
                            <FAB icon="camera" onPress={onPressPreview} />
                        )}
                    </Preview>
                </Portal>
            ) : (
                <ScrollView>
                    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
                        <AspectView style={styles.photoAspect}>
                            <Rounded>
                                <Surface style={styles.photoSurface}>
                                    {photo.saving ? (
                                        <ActivityIndicator style={styles.photoContainer} size="large" />
                                    ) : (
                                        <TouchableRipple style={styles.photoContainer} onPress={onPressPhoto}>
                                            {photo.uri === null ? (
                                                <Icon style={styles.photoIcon} name="camera" />
                                            ) : (
                                                <Image style={styles.photoImage} source={{ uri: photo.uri }} resizeMode="stretch" />
                                            )}
                                        </TouchableRipple>
                                    )}
                                </Surface>
                            </Rounded>
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
                        <List.Accordion style={styles.input} title="Favorecidos" left={(props) => <List.Icon {...props} icon="cat" />}>
                        </List.Accordion>
                        <View style={styles.buttonContainer}>
                            <Button style={styles.button} mode="outlined" disabled={nameError || cpfError || registerResponse.running || removeResponse.running} loading={registerResponse.running} onPress={onPressRegister}>
                                {doador ? 'Atualizar' : 'Cadastrar'}
                            </Button>
                            {doador && (
                                <Button style={styles.button} mode="outlined" disabled={registerResponse.running || removeResponse.running} loading={removeResponse.running} onPress={() => setRemoveVisible(true)}>
                                    Remover
                                </Button>
                            )}
                        </View>
                    </SafeAreaView>
                </ScrollView>
            )}
            {!photo.saving && !photo.valid && (
                <Snackbar visible={photoError} action={{ label: 'Ok', onPress: () => setPhotoError(false) }} onDismiss={() => { }}>
                    {camera.allowed ? 'Não foi possível salvar a foto.' : 'Não foi possível acessar a câmera.'}
                </Snackbar>
            )}
            {!registerResponse.running && !registerResponse.success && (
                <Snackbar visible={registerError} action={{ label: 'Ok', onPress: () => setRegisterError(false) }} onDismiss={() => { }}>
                    {registerResponse.body.status === 0 ? 'Não foi possível conectar ao servidor' : `ERROR ${registerResponse.body.status}: ${registerResponse.body.message}`}
                </Snackbar>
            )}
            {!removeResponse.running && !removeResponse.success && (
                <Snackbar visible={removeError} action={{ label: 'Ok', onPress: () => setRemoveError(false) }} onDismiss={() => { }}>
                    {removeResponse.body.status === 0 ? 'Não foi possível conectar ao servidor' : `ERROR ${removeResponse.body.status}: ${removeResponse.body.message}`}
                </Snackbar>
            )}
            {doador && (
                <Portal>
                    <Dialog visible={removeVisible} onDismiss={onDismissRemove}>
                        <View>
                            <Dialog.Title>
                                {`Remover ${doador.nome}?`}
                            </Dialog.Title>
                            <Dialog.Content>
                                <Paragraph>
                                    Esta operação não pode ser desfeita.
                                </Paragraph>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={onDismissRemove}>
                                    Cancelar
                                </Button>
                                <Button onPress={onConfirmRemove}>
                                    Ok
                                </Button>
                            </Dialog.Actions>
                        </View>
                    </Dialog>
                </Portal>
            )}
        </>
    );
}
