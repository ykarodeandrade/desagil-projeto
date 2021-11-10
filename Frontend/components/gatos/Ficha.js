import React, { useState, useEffect } from 'react';

import { ScrollView, Image, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityIndicator, TouchableRipple, TextInput, HelperText, Button, Snackbar } from 'react-native-paper';

import { Icon, InputView, AspectView, DropDown, DateTimePicker, useEmit, useStorage, useRequest } from '../../lib';

import settings from '../../settings.json';

import styles from '../../styles/gatos/Ficha.json';

function exists(gato, key) {
    return gato !== null && typeof gato[key] === 'string';
}

export default function Ficha(props) {
    const { navigation } = props;
    const gato = props.route.params;

    const [photoError, setPhotoError] = useState(false);
    const [name, setName] = useState(exists(gato, 'nome') ? gato.nome : '');
    const [gender, setGender] = useState(exists(gato, 'genero') ? gato.genero : 'FEMEA');
    const [breed, setBreed] = useState(exists(gato, 'raca') ? gato.raca : '');
    const [fur, setFur] = useState(exists(gato, 'pelagem') ? gato.pelagem : 'AUSENTE');
    const [eye, setEye] = useState(exists(gato, 'olhos') ? gato.olhos : 'VERDES');
    const [birthDate, setBirthDate] = useState(exists(gato, 'dataNascimento') ? new Date(gato.dataNascimento) : new Date());
    const [rescueDate, setRescueDate] = useState(exists(gato, 'dataResgate') ? new Date(gato.dataResgate) : new Date());
    const [registerError, setRegisterError] = useState(false);
    const [removeError, setRemoveError] = useState(false);

    const emit = useEmit('updated-cats');
    const { pick, file } = useStorage(gato === null ? null : gato.foto);
    const { post, put, response: registerResponse } = useRequest(settings.url);
    const { del, response: removeResponse } = useRequest(settings.url);

    useEffect(() => {
        if ((registerResponse.success && registerResponse.body !== null) || (removeResponse.success && removeResponse.body !== null)) {
            emit();
            navigation.navigate('Lista');
        } else {
            navigation.setOptions({ title: gato === null ? 'Novo gato' : gato.nome });
        }
    }, [registerResponse, removeResponse]);

    function onPressPhoto() {
        setPhotoError(true);
        pick('image/*', true);
    }

    function onPressRegister() {
        setRegisterError(true);
        const body = {
            ...gato,
            foto: file.uri,
            nome: name,
            genero: gender,
            raca: breed,
            pelagem: fur,
            olhos: eye,
            dataNascimento: birthDate,
            dataResgate: rescueDate,
        };
        if (gato === null) {
            post('/gato', body);
        } else {
            put('/gato', body);
        }
    }

    function onPressRemove() {
        setRemoveError(true);
        del(`/gato?key=${gato.key}`);
    }

    const nameError = name.trim() === '';

    const genders = [
        { label: 'Fêmea', value: 'FEMEA' },
        { label: 'Macho', value: 'MACHO' },
    ];

    const breedError = breed.trim() === '';

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
                    <AspectView style={styles.photoAspect}>
                        <InputView style={styles.photoInput}>
                            {file.loading ? (
                                <ActivityIndicator style={styles.grow} size="large" />
                            ) : (
                                <TouchableRipple style={styles.grow} onPress={onPressPhoto}>
                                    {file.uri === null ? (
                                        <Icon style={styles.grow} name="file-image" />
                                    ) : (
                                        <Image style={styles.grow} source={{ uri: file.uri }} resizeMode="stretch" />
                                    )}
                                </TouchableRipple>
                            )}
                        </InputView>
                    </AspectView>
                    <TextInput style={styles.input} label="Nome" value={name} error={nameError} onChangeText={setName} />
                    {nameError && (
                        <HelperText style={styles.error} type="error">
                            Nome é obrigatório
                        </HelperText>
                    )}
                    <DropDown style={styles.input} label="Gênero" list={genders} value={gender} setValue={setGender} />
                    <TextInput style={styles.input} label="Raça" value={breed} error={breedError} onChangeText={setBreed} />
                    {breedError && (
                        <HelperText style={styles.error} type="error">
                            Raça é obrigatória
                        </HelperText>
                    )}
                    <DropDown style={styles.input} label="Pelagem" list={furs} value={fur} setValue={setFur} />
                    <DropDown style={styles.input} label="Olhos" list={eyes} value={eye} setValue={setEye} />
                    <DateTimePicker type="date" style={styles.input} label="Nascimento" value={birthDate} setValue={setBirthDate} />
                    <DateTimePicker type="date" style={styles.input} label="Resgate" value={rescueDate} setValue={setRescueDate} />
                    <View style={styles.buttons}>
                        <Button style={styles.button} mode="outlined" disabled={nameError || breedError || registerResponse.running || removeResponse.running} loading={registerResponse.running} onPress={onPressRegister}>
                            {gato === null ? 'Cadastrar' : 'Atualizar'}
                        </Button>
                        {gato !== null && (
                            <Button style={styles.button} mode="outlined" disabled={removeResponse.running || registerResponse.running} loading={removeResponse.running} onPress={onPressRemove}>
                                Remover
                            </Button>
                        )}
                    </View>
                </SafeAreaView>
            </ScrollView>
            {!file.loading && !file.valid && (
                <Snackbar visible={photoError} action={{ label: 'Ok', onPress: () => setPhotoError(false) }} onDismiss={() => { }}>
                    Não foi possível carregar a imagem.
                </Snackbar>
            )}
            {!registerResponse.running && !registerResponse.success && (
                <Snackbar visible={registerError} action={{ label: 'Ok', onPress: () => setRegisterError(false) }} onDismiss={() => { }}>
                    {registerResponse.body.status > 0 && `ERROR ${registerResponse.body.status}: `}{registerResponse.body.message}
                </Snackbar>
            )}
            {!removeResponse.running && !removeResponse.success && (
                <Snackbar visible={removeError} action={{ label: 'Ok', onPress: () => setRemoveError(false) }} onDismiss={() => { }}>
                    {removeResponse.body.status > 0 && `ERROR ${removeResponse.body.status}: `}{removeResponse.body.message}
                </Snackbar>
            )}
        </>
    );
}
