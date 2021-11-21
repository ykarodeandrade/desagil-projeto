// NÃO MODIFIQUE NEM SUBSTITUA ESTE ARQUIVO

import 'react-native-get-random-values';

import { nanoid } from 'nanoid';

import { useState } from 'react';

import { Image, Platform } from 'react-native';

import * as FileSystem from 'expo-file-system';
import { manipulateAsync } from 'expo-image-manipulator';
import * as DocumentPicker from 'expo-document-picker';

const MAX_SIZE = 640;

function getImageSizeAsync(uri) {
    return new Promise((resolve, reject) => {
        Image.getSize(uri,
            (resultWidth, resultHeight) => resolve({ resultWidth, resultHeight }),
            (error) => reject(error));
    });
}

export default function useStorage(uri) {
    const [file, setFile] = useState({
        loading: false,
        valid: true,
        uri: uri,
    });

    function encode(uri, type) {
        FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 })
            .then((data) => {
                setFile({
                    loading: false,
                    valid: true,
                    uri: `data:${type};base64,${data}`,
                });
            });
    }

    function resize(input, inputWidth, inputHeight) {
        let width;
        let height;
        if (inputWidth < inputHeight) {
            height = MAX_SIZE;
            width = inputWidth * (height / inputHeight);
        } else {
            width = MAX_SIZE;
            height = inputHeight * (width / inputWidth);
        }
        manipulateAsync(input.uri, [{ resize: { width, height } }])
            .then((output) => {
                if (Platform.OS === 'web') {
                    setFile({
                        loading: false,
                        valid: true,
                        uri: output.uri,
                    });
                } else {
                    encode(output.uri, 'image/jpeg');
                }
            });
    }

    function pick(type) {
        setFile({
            loading: true,
            valid: file.valid,
            uri: file.uri,
        });
        DocumentPicker.getDocumentAsync({ type: type, copyToCacheDirectory: false })
            .then((result) => {
                if (result.type === 'cancel') {
                    setFile({
                        loading: false,
                        valid: true,
                        uri: file.uri,
                    });
                } else {
                    getImageSizeAsync(result.uri)
                        .then(({ resultWidth, resultHeight }) => {
                            if (resultWidth <= MAX_SIZE && resultHeight <= MAX_SIZE) {
                                if (Platform.OS === 'web') {
                                    setFile({
                                        loading: false,
                                        valid: true,
                                        uri: result.uri,
                                    });
                                } else {
                                    const tempUri = `${FileSystem.cacheDirectory}${nanoid()}`;
                                    FileSystem.copyAsync({ from: result.uri, to: tempUri })
                                        .then(() => {
                                            encode(tempUri, result.mimeType);
                                        });
                                }
                            } else {
                                resize(result, resultWidth, resultHeight);
                            }
                        });
                }
            })
            .catch(() => {
                setFile({
                    loading: false,
                    valid: false,
                    uri: file.uri,
                });
            });
    }

    return { pick, file };
}
