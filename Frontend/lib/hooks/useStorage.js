// NÃO MODIFIQUE NEM SUBSTITUA ESTE ARQUIVO

import 'react-native-get-random-values';

import { nanoid } from 'nanoid';

import { useState } from 'react';

import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

function generateUri() {
    return `${FileSystem.cacheDirectory}${nanoid()}`;
}

export default function useStorage(uri) {
    const [file, setFile] = useState({
        loading: false,
        valid: true,
        uri: uri,
    });

    function pick(type, encoded) {
        setFile({
            loading: true,
            valid: false,
            uri: file.uri,
        });

        DocumentPicker.getDocumentAsync({ type: type, copyToCacheDirectory: false })
            .then((document) => {
                if (document.type === 'cancel') {
                    setFile({
                        loading: false,
                        valid: true,
                        uri: file.uri,
                    });
                } else {
                    if (document.uri.startsWith('data:')) {
                        if (encoded) {
                            setFile({
                                loading: false,
                                valid: true,
                                uri: document.uri,
                            });
                        } else {
                            const tempUri = generateUri();
                            FileSystem.copyAsync({ from: document.uri, to: tempUri })
                                .then(() => {
                                    setFile({
                                        loading: false,
                                        valid: true,
                                        uri: tempUri,
                                    });
                                });
                        }
                    } else {
                        if (encoded) {
                            const tempUri = generateUri();
                            FileSystem.copyAsync({ from: document.uri, to: tempUri })
                                .then(() => {
                                    FileSystem.readAsStringAsync(tempUri, { encoding: FileSystem.EncodingType.Base64 })
                                        .then((data) => {
                                            setFile({
                                                loading: false,
                                                valid: true,
                                                uri: `data:${document.mimeType};base64,${data}`,
                                            });
                                        });
                                });
                        } else {
                            setFile({
                                loading: false,
                                valid: true,
                                uri: document.uri,
                            });
                        }
                    }
                }
            })
            .catch((error) => {
                setFile({
                    loading: false,
                    valid: false,
                    uri: error,
                });
            });
    }

    return { pick, file };
}
