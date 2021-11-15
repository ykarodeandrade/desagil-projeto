// NÃO MODIFIQUE NEM SUBSTITUA ESTE ARQUIVO

import React, { useRef, useState } from 'react';

import { Platform } from 'react-native';

import { Camera } from 'expo-camera';

export default function useCamera(uri) {
    const ref = useRef();

    const [allowed, setAllowed] = useState(false);
    const [active, setActive] = useState(false);
    const [photo, setPhoto] = useState({
        saving: false,
        valid: true,
        uri: uri,
    });

    function activate() {
        if (allowed) {
            if (!active) {
                if (ref.current) {
                    ref.current.resumePreview();
                }
                setActive(true);
            }
        } else {
            Camera.requestCameraPermissionsAsync()
                .then((response) => {
                    if (response.granted) {
                        setAllowed(true);
                        setActive(true);
                    }
                })
                .catch(() => {
                    setPhoto({
                        saving: false,
                        valid: false,
                        uri: photo.uri,
                    });
                });
        }
    }

    function take() {
        if (active) {
            setPhoto({
                saving: true,
                valid: photo.valid,
                uri: photo.uri,
            });
            if (ref.current) {
                const options = {};
                if (Platform.OS !== 'web') {
                    options.base64 = true;
                }
                ref.current.takePictureAsync(options)
                    .then((result) => {
                        if (Platform.OS === 'web') {
                            setPhoto({
                                saving: false,
                                valid: true,
                                uri: result.uri,
                            });
                        } else {
                            setPhoto({
                                saving: false,
                                valid: true,
                                uri: `data:image/jpg;base64,${result.base64}`,
                            });
                        }
                    })
                    .catch(() => {
                        setPhoto({
                            saving: false,
                            valid: false,
                            uri: photo.uri,
                        });
                    });
            } else {
                setPhoto({
                    saving: false,
                    valid: photo.valid,
                    uri: photo.uri,
                });
            }
        }
    }

    function deactivate() {
        if (active) {
            setActive(false);
            if (ref.current) {
                ref.current.pausePreview();
            }
        }
    }

    function Preview(props) {
        return (
            <Camera
                {...props}
                ref={ref}
            >
                {props.children}
            </Camera>
        );
    }

    return {
        camera: {
            allowed,
            active,
            activate,
            take,
            deactivate,
        },
        photo,
        Preview,
    };
}
