import React, { useState } from 'react';

import { ScrollView, Image, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityIndicator, TouchableRipple, TextInput, HelperText, Button, Snackbar, Portal, Dialog, Paragraph } from 'react-native-paper';

import { AspectView, Icon, DropDown, DateTimePicker, useEmit, useEffect, useStorage, useRequest } from '../../lib';

import settings from '../../settings.json';

import styles from '../../styles/gatos/Ficha.json';

export default function Ficha(props) {
    const { navigation, route } = props;

    const gato = route.params;

    const [photoError, setPhotoError] = useState(false);
    const [name, setName] = useState(gato ? gato.nome : '');
    const [nameError, setNameError] = useState(typeof name !== 'string' || nameInvalid(name));
    const [gender, setGender] = useState(gato ? gato.genero : 'FEMEA');
    const [breed, setBreed] = useState(gato ? gato.raca : '');
    const [breedError, setBreedError] = useState(typeof breed !== 'string' || breedInvalid(breed));
    const [fur, setFur] = useState(gato ? gato.pelagem : 'AUSENTE');
    const [eye, setEye] = useState(gato ? gato.olhos : 'VERDES');
    const [birthDate, setBirthDate] = useState(gato ? new Date(gato.dataNascimento) : new Date());
    const [rescueDate, setRescueDate] = useState(gato ? new Date(gato.dataResgate) : new Date());
    const [registerError, setRegisterError] = useState(false);
    const [removeError, setRemoveError] = useState(false);
    const [removeVisible, setRemoveVisible] = useState(false);

    const emit = useEmit('updated-cats');

    const { pick, file } = useStorage(gato ? gato.foto : null);

    const { post, put, response: registerResponse } = useRequest(settings.url);
    const { del, response: removeResponse } = useRequest(settings.url);

    function nameInvalid(name) {
        return !name.trim();
    }

    function breedInvalid(breed) {
        return !breed.trim();
    }

    function onPressPhoto() {
        setPhotoError(true);
        pick('image/*');
    }

    function onChangeTextName(text) {
        setName(text);
        setNameError(nameInvalid(text));
    }

    function onChangeTextBreed(text) {
        setBreed(text);
        setBreedError(breedInvalid(text));
    }

    function onPressRegister() {
        setRegisterError(true);
        const body = {
            foto: file.uri,
            nome: name,
            genero: gender,
            raca: breed,
            pelagem: fur,
            olhos: eye,
            dataNascimento: birthDate,
            dataResgate: rescueDate,
        };
        if (gato) {
            body.key = gato.key;
            put('/gato', body);
        } else {
            post('/gato', body);
        }
    }

    function onDismissRemove() {
        setRemoveVisible(false);
    }

    function onConfirmRemove() {
        onDismissRemove();
        setRemoveError(true);
        del(`/gato?key=${gato.key}`);
    }

    useEffect(() => {
        if ((registerResponse.success && registerResponse.body !== null) || (removeResponse.success && removeResponse.body !== null)) {
            emit();
            navigation.navigate('ListaGatos');
        } else {
            navigation.setOptions({ title: gato ? gato.nome : 'Novo gato' });
        }
    }, [registerResponse, removeResponse]);

    const genders = [
        { label: 'Fêmea', value: 'FEMEA' },
        { label: 'Macho', value: 'MACHO' },
    ];

    const furs = [
        { label: 'Ausente', value: 'AUSENTE' },
        { label: 'Curta', value: 'CURTA' },
        { label: 'Longa', value: 'LONGA' },
    ];

    const eyes = [
        { label: 'Verdes', value: 'VERDES' },
        { label: 'Azuis', value: 'AZUIS' },
        { label: 'Amarelos', value: 'AMARELOS' },
        { label: 'Bicolores', value: 'BICOLORES' },
    ];

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
                                    <Icon name="file-image" />
                                ) : (
                                    <Image style={styles.photo} source={{ uri: file.uri }} resizeMode="stretch" />
                                )}
                            </TouchableRipple>
                        )}
                    </AspectView>
                    <TextInput style={styles.input} label="Nome" value={name} error={nameError} onChangeText={onChangeTextName} />
                    {nameError && (
                        <HelperText style={styles.error} type="error">
                            Nome é obrigatório
                        </HelperText>
                    )}
                    <DropDown style={styles.input} label="Gênero" list={genders} value={gender} setValue={setGender} />
                    <TextInput style={styles.input} label="Raça" value={breed} error={breedError} onChangeText={onChangeTextBreed} />
                    {breedError && (
                        <HelperText style={styles.error} type="error">
                            Raça é obrigatória
                        </HelperText>
                    )}
                    <DropDown style={styles.input} label="Pelagem" list={furs} value={fur} setValue={setFur} />
                    <DropDown style={styles.input} label="Olhos" list={eyes} value={eye} setValue={setEye} />
                    <DateTimePicker type="date" style={styles.input} label="Nascimento" value={birthDate} setValue={setBirthDate} />
                    <DateTimePicker type="date" style={styles.input} label="Resgate" value={rescueDate} setValue={setRescueDate} />
                    <View style={styles.buttonContainer}>
                        <Button style={styles.button} mode="outlined" disabled={nameError || breedError || registerResponse.running || removeResponse.running} loading={registerResponse.running} onPress={onPressRegister}>
                            {gato ? 'Atualizar' : 'Cadastrar'}
                        </Button>
                        {gato && (
                            <Button style={styles.button} mode="outlined" disabled={registerResponse.running || removeResponse.running} loading={removeResponse.running} onPress={() => setRemoveVisible(true)}>
                                Remover
                            </Button>
                        )}
                    </View>
                </SafeAreaView>
            </ScrollView>
            {!file.loading && !file.valid && (
                <Snackbar visible={photoError} action={{ label: 'Ok', onPress: () => setPhotoError(false) }} onDismiss={() => { }}>
                    Não foi possível carregar a foto.
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
            {gato && (
                <Portal>
                    <Dialog visible={removeVisible} onDismiss={onDismissRemove}>
                        <View>
                            <Dialog.Title>
                                {`Remover ${gato.nome}?`}
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