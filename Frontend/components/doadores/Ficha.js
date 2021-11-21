import React, { useState } from 'react';

import { ScrollView, Image, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { TouchableRipple, Text, Divider, Portal, ActivityIndicator, FAB, Surface, TextInput, HelperText, List, IconButton, Dialog, Paragraph, Button, Snackbar } from 'react-native-paper';

import { Rounded, AspectView, Icon, useEmit, useEffect, useCamera, useRequest, map } from '../../lib';

import settings from '../../settings.json';

import styles from '../../styles/doadores/Ficha.json';

function CatItem(props) {
    const gato = props.gato;
    return (
        <>
            <TouchableRipple style={styles.catItem} onPress={() => props.onPress(gato)}>
                <Text>{gato.nome}</Text>
            </TouchableRipple>
            <Divider />
        </>
    );
}

export default function Ficha(props) {
    const { navigation, route } = props;

    const doador = route.params;

    const [photoError, setPhotoError] = useState(false);
    const [cpf, setCpf] = useState(doador ? doador.cpf : '');
    const [cpfError, setCpfError] = useState(typeof cpf !== 'string' || cpfInvalid(cpf));
    const [name, setName] = useState(doador ? doador.nome : '');
    const [nameError, setNameError] = useState(typeof name !== 'string' || nameInvalid(name));
    const [catKeys, setCatKeys] = useState(doador && doador.chavesGatos instanceof Array ? doador.chavesGatos : []);
    const [registerError, setRegisterError] = useState(false);
    const [removeError, setRemoveError] = useState(false);
    const [addVisible, setAddVisible] = useState(false);
    const [removeVisible, setRemoveVisible] = useState(false);

    const emit = useEmit('updated-donors');

    const { camera, photo, Preview } = useCamera(doador ? doador.foto : null);

    const { post, put, response: registerResponse } = useRequest(settings.url);
    const { del, response: removeResponse } = useRequest(settings.url);

    const { get: donorCatGet, skip: donorCatSkip, response: donorCatResponse } = useRequest(settings.url);
    const { get: otherCatGet, response: otherCatResponse } = useRequest(settings.url);

    function getDonorCats() {
        if (catKeys.length === 0) {
            donorCatSkip([]);
        } else {
            donorCatGet(`/gato/list?keys=${catKeys.join(',')}`);
        }
    }

    function getOtherCats() {
        if (catKeys.length === 0) {
            otherCatGet('/gato/list');
        } else {
            otherCatGet(`/gato/list?other=true&keys=${catKeys.join(',')}`);
        }
    }

    function cpfInvalid(cpf) {
        return !cpf.trim();
    }

    function nameInvalid(name) {
        return !name.trim();
    }

    function onPressPhoto() {
        camera.activate();
    }

    function onPressPreview() {
        setPhotoError(true);
        camera.take();
    }

    function onChangeTextCpf(text) {
        setCpf(text);
        setCpfError(cpfInvalid(text));
    }

    function onChangeTextName(text) {
        setName(text);
        setNameError(nameInvalid(text));
    }

    function onPressAddCat() {
        getOtherCats();
        setAddVisible(true);
    }

    function onDismissAddCat() {
        setAddVisible(false);
    }

    function onConfirmAddCat(gato) {
        onDismissAddCat();
        setCatKeys([...catKeys, gato.key]);
        donorCatSkip([...donorCatResponse.body, gato]);
    }

    function onPressRemoveCat(gato) {
        setCatKeys(catKeys.filter((x) => x !== gato.key));
        donorCatSkip(donorCatResponse.body.filter((x) => x !== gato));
    }

    function onPressRegister() {
        setRegisterError(true);
        const body = {
            cpf: cpf,
            nome: name,
            foto: photo.uri,
            chavesGatos: catKeys,
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

    useEffect(() => {
        getDonorCats();
    }, []);

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
                        <List.Accordion style={styles.list} title="Favorecidos">
                            {donorCatResponse.running ? (
                                <ActivityIndicator style={styles.listIndicator} size="small" />
                            ) : (
                                <>
                                    {donorCatResponse.success ? (
                                        <>
                                            {donorCatResponse.body !== null && (
                                                map(donorCatResponse.body, (gato) => <List.Item style={styles.listItem} title={gato.nome} right={(props) => <TouchableRipple onPress={() => onPressRemoveCat(gato)}><List.Icon {...props} style={styles.listIcon} icon="minus-circle-outline" /></TouchableRipple>} />)
                                            )}
                                            <IconButton style={styles.listButton} icon="plus-circle-outline" onPress={onPressAddCat} />
                                        </>
                                    ) : (
                                        <List.Item style={styles.listItem} title="Tentar novamente" onPress={getDonorCats} right={(props) => <List.Icon {...props} style={styles.listIcon} icon="refresh" />} />
                                    )}
                                    <Portal>
                                        <Dialog visible={addVisible} onDismiss={onDismissAddCat}>
                                            <Dialog.Title>
                                                Adicionar favorecido
                                            </Dialog.Title>
                                            <Dialog.Content>
                                                {otherCatResponse.running ? (
                                                    <ActivityIndicator style={styles.photoContainer} size="large" />
                                                ) : (
                                                    otherCatResponse.success ? (
                                                        otherCatResponse.body !== null && otherCatResponse.body.length > 0 ? (
                                                            <>
                                                                <Divider />
                                                                {map(otherCatResponse.body, (gato) => <CatItem gato={gato} onPress={onConfirmAddCat} />)}
                                                            </>
                                                        ) : (
                                                            <Paragraph>Todos os gatos já favorecidos.</Paragraph>
                                                        )
                                                    ) : (
                                                        <Paragraph>Não foi possível conectar ao servidor.</Paragraph>
                                                    )
                                                )}
                                            </Dialog.Content>
                                            <Dialog.Actions>
                                                <Button onPress={onDismissAddCat}>
                                                    Fechar
                                                </Button>
                                            </Dialog.Actions>
                                        </Dialog>
                                    </Portal>
                                </>
                            )}
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
            {!donorCatResponse.running && !donorCatResponse.success && (
                <Snackbar visible={registerError} action={{ label: 'Ok', onPress: () => setRegisterError(false) }} onDismiss={() => { }}>
                    {donorCatResponse.body.status === 0 ? 'Não foi possível conectar ao servidor' : `ERROR ${donorCatResponse.body.status}: ${donorCatResponse.body.message}`}
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
