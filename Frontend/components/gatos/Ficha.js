import React, { useState } from 'react';

import { ScrollView, Image, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityIndicator, TouchableRipple, TextInput, HelperText, Button, Snackbar } from 'react-native-paper';

import { AspectView, Icon, DropDown, DateTimePicker, useEmit, useEffect, useStorage, useRequest } from '../../lib';

import settings from '../../settings.json';

import styles from '../../styles/gatos/Ficha.json';

export default function Ficha(props) {
    const { navigation, route } = props;

    const gato = route.params;

    const [photoError, setPhotoError] = useState(false);
    const [name, setName] = useState(gato ? gato.nome : '');
    const [gender, setGender] = useState(gato ? gato.genero : 'FEMEA');
    const [breed, setBreed] = useState(gato ? gato.raca : '');
    const [fur, setFur] = useState(gato ? gato.pelagem : 'AUSENTE');
    const [eye, setEye] = useState(gato ? gato.olhos : 'VERDES');
    const [birthDate, setBirthDate] = useState(gato ? new Date(gato.dataNascimento) : new Date());
    const [rescueDate, setRescueDate] = useState(gato ? new Date(gato.dataResgate) : new Date());
    const [registerError, setRegisterError] = useState(false);
    const [removeError, setRemoveError] = useState(false);

    const emit = useEmit('updated-cats');

    const { pick, file } = useStorage(gato ? gato.foto : null);

    const { post, put, response: registerResponse } = useRequest(settings.url);
    const { del, response: removeResponse } = useRequest(settings.url);

    useEffect(() => {
        if ((registerResponse.success && registerResponse.body !== null) || (removeResponse.success && removeResponse.body !== null)) {
            emit();
            navigation.navigate('Lista');
        } else {
            navigation.setOptions({ title: gato ? gato.nome : 'Novo gato' });
        }
    }, [registerResponse, removeResponse]);

    function onPressPhoto() {
        setPhotoError(true);
        pick('image/*', true);
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
                    <AspectView style={styles.photoOuter}>
                        {file.loading ? (
                            <ActivityIndicator style={styles.photoInner} size="large" />
                        ) : (
                            <TouchableRipple style={styles.photoInner} onPress={onPressPhoto}>
                                {file.uri === null ? (
                                    <Icon style={styles.photo} name="file-image" />
                                ) : (
                                    <Image style={styles.photo} source={{ uri: file.uri }} resizeMode="stretch" />
                                )}
                            </TouchableRipple>
                        )}
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
                    <View style={styles.buttonContainer}>
                        <Button style={styles.button} mode="outlined" disabled={nameError || breedError || registerResponse.running || removeResponse.running} loading={registerResponse.running} onPress={onPressRegister}>
                            {gato ? 'Atualizar' : 'Cadastrar'}
                        </Button>
                        {gato && (
                            <Button style={styles.button} mode="outlined" disabled={registerResponse.running || removeResponse.running} loading={removeResponse.running} onPress={onPressRemove}>
                                Remover
                            </Button>
                        )}
                    </View>
                </SafeAreaView>
            </ScrollView>
            {!file.loading && !file.valid && (
                <Snackbar visible={photoError} action={{ label: 'Ok', onPress: () => setPhotoError(false) }} onDismiss={() => { }}>
                    Não foi possível carregar.
                </Snackbar>
            )}
            {!registerResponse.running && !registerResponse.success && (
                <Snackbar visible={registerError} action={{ label: 'Ok', onPress: () => setRegisterError(false) }} onDismiss={() => { }}>
                    {registerResponse.body.status === 0 ? 'Não foi possível conectar' : `ERROR ${registerResponse.body.status}: ${registerResponse.body.message}`}
                </Snackbar>
            )}
            {!removeResponse.running && !removeResponse.success && (
                <Snackbar visible={removeError} action={{ label: 'Ok', onPress: () => setRemoveError(false) }} onDismiss={() => { }}>
                    {removeResponse.body.status === 0 ? 'Não foi possível conectar' : `ERROR ${removeResponse.body.status}: ${removeResponse.body.message}`}
                </Snackbar>
            )}
        </>
    );
}
