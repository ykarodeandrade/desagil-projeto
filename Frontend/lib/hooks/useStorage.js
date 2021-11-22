// NÃO MODIFIQUE NEM SUBSTITUA ESTE ARQUIVO

import 'react-native-get-random-values';

import { nanoid } from 'nanoid';

import { useState } from 'react';

import { Image, Platform } from 'react-native';

import * as FileSystem from 'expo-file-system';
import { manipulateAsync } from 'expo-image-manipulator';
import * as DocumentPicker from 'expo-document-picker';

const MAX_SIZE = 512;

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
        error: null,
    });

    function encode(uri, type) {
        FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 })
            .then((data) => {
                setFile({
                    loading: false,
                    valid: true,
                    uri: `data:${type};base64,${data}`,
                    error: file.error,
                });
            });
    }

    function resize(result, resultWidth, resultHeight) {
        let width;
        let height;
        if (resultWidth < resultHeight) {
            height = MAX_SIZE;
            width = resultWidth * (height / resultHeight);
        } else {
            width = MAX_SIZE;
            height = resultHeight * (width / resultWidth);
        }
        manipulateAsync(result.uri, [{ resize: { width, height } }])
            .then((resized) => {
                if (Platform.OS === 'web') {
                    setFile({
                        loading: false,
                        valid: true,
                        uri: resized.uri,
                        error: file.error,
                    });
                } else {
                    encode(resized.uri, 'image/jpeg');
                }
            });
    }

    function pick(type) {
        setFile({
            loading: true,
            valid: file.valid,
            uri: file.uri,
            error: file.error,
        });
        DocumentPicker.getDocumentAsync({ type: type, copyToCacheDirectory: false })
            .then((result) => {
                if (result.type === 'cancel') {
                    setFile({
                        loading: false,
                        valid: true,
                        uri: file.uri,
                        error: file.error,
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
                                        error: file.error,
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
            .catch((error) => {
                setFile({
                    loading: false,
                    valid: false,
                    uri: file.uri,
                    error: error,
                });
            });
    }

    return { pick, file };
}
