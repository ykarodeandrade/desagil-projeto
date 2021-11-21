// NÃO MODIFIQUE NEM SUBSTITUA ESTE ARQUIVO

import React, { useRef, useState } from 'react';

import { Platform, View, useWindowDimensions } from 'react-native';

import * as FileSystem from 'expo-file-system';
import { manipulateAsync } from 'expo-image-manipulator';
import { Camera } from 'expo-camera';

const MAX_SIZE = 512;

export default function useCamera(uri, square) {
    const ref = useRef();

    const [allowed, setAllowed] = useState(false);
    const [active, setActive] = useState(false);
    const [first, setFirst] = useState(Platform.OS === 'android');
    const [photo, setPhoto] = useState({
        taking: false,
        saving: false,
        valid: true,
        uri: uri,
    });

    const [androidPadding, setAndroidPadding] = useState(0);

    const { width: windowWidth, height: windowHeight } = useWindowDimensions();

    function activate() {
        if (!active) {
            if (allowed) {
                setActive(true);
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
                            taking: false,
                            saving: false,
                            valid: false,
                            uri: photo.uri,
                        });
                    });
            }
        }
    }

    function encode(uri) {
        FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 })
            .then((data) => {
                setPhoto({
                    taking: false,
                    saving: false,
                    valid: true,
                    uri: `data:image/jpg;base64,${data}`,
                });
            });
    }

    function resize(result) {
        let width;
        let height;
        if (result.width < result.height) {
            height = MAX_SIZE;
            width = result.width * (height / result.height);
        } else {
            width = MAX_SIZE;
            height = result.height * (width / result.width);
        }
        manipulateAsync(result.uri, [{ resize: { width, height } }])
            .then((resized) => {
                if (Platform.OS === 'web') {
                    setPhoto({
                        taking: false,
                        saving: false,
                        valid: true,
                        uri: resized.uri,
                    });
                } else {
                    encode(resized.uri);
                }
            });
    }

    function encodeOrResize(result) {
        if (result.width <= MAX_SIZE && result.height <= MAX_SIZE) {
            if (Platform.OS === 'web') {
                setPhoto({
                    taking: false,
                    saving: false,
                    valid: true,
                    uri: result.uri,
                });
            } else {
                encode(result.uri);
            }
        } else {
            resize(result);
        }
    }

    function doTake(keepActive) {
        ref.current.takePictureAsync()
            .then((result) => {
                setPhoto({
                    taking: false,
                    saving: true,
                    valid: photo.valid,
                    uri: photo.uri,
                });
                if (square) {
                    const crop = {};
                    if (result.width < result.height) {
                        crop.originX = 0;
                        crop.originY = (result.height - result.width) / 2;
                        crop.width = result.width;
                        crop.height = result.width;
                    } else {
                        crop.originX = (result.width - result.height) / 2;
                        crop.originY = 0;
                        crop.width = result.height;
                        crop.height = result.height;
                    }
                    manipulateAsync(result.uri, [{ crop: crop }])
                        .then((cropped) => {
                            encodeOrResize(cropped);
                        });
                } else {
                    encodeOrResize(result);
                }
                setActive(keepActive);
            })
            .catch(() => {
                setPhoto({
                    taking: false,
                    saving: false,
                    valid: false,
                    uri: photo.uri,
                });
                setActive(keepActive);
            });
    }

    function take(keepActive) {
        if (active && ref.current) {
            setPhoto({
                taking: true,
                saving: photo.saving,
                valid: photo.valid,
                uri: photo.uri,
            });
            if (first) {
                setFirst(false);
                ref.current.takePictureAsync();
            }
            setTimeout(() => doTake(keepActive), 1000);
        }
    }

    function deactivate() {
        if (active) {
            setActive(false);
        }
    }

    function pause() {
        if (ref.current) {
            ref.current.pausePreview();
        }
    }

    function resume() {
        if (ref.current) {
            ref.current.resumePreview();
        }
    }

    function onCameraReady() {
        if (Platform.OS === 'android' && ref.current) {
            ref.current.getSupportedRatiosAsync()
                .then((ratioStrings) => {
                    let windowRatio;
                    if (windowWidth < windowHeight) {
                        windowRatio = windowHeight / windowWidth;
                    } else {
                        windowRatio = windowWidth / windowHeight;
                    }
                    let minimum = Number.POSITIVE_INFINITY;
                    let bestRatio;
                    for (const ratioString of ratioStrings) {
                        const dimensions = ratioString.split(':');
                        const ratio = parseInt(dimensions[0]) / parseInt(dimensions[1]);
                        const distance = windowRatio - ratio;
                        if (distance >= 0 && minimum > distance) {
                            minimum = distance;
                            bestRatio = ratio;
                        }
                    }
                    if (windowWidth < windowHeight) {
                        setAndroidPadding((windowHeight - windowWidth * bestRatio) / 2);
                    } else {
                        setAndroidPadding((windowWidth - windowHeight * bestRatio) / 2);
                    }
                })
                .catch(() => {
                    setPhoto({
                        taking: false,
                        saving: false,
                        valid: false,
                        uri: photo.uri,
                    });
                    setActive(false);
                });
        }
    }

    function Preview(props) {
        const style = { ...props.style };
        const cameraProps = {};
        for (const [name, value] of Object.entries(props)) {
            if (name !== 'style' && name !== 'children') {
                cameraProps[name] = value;
            }
        }
        let squarePadding;
        if (windowWidth < windowHeight) {
            squarePadding = (windowHeight - windowWidth) / 2;
        } else {
            squarePadding = (windowWidth - windowHeight) / 2;
        }
        return (
            <View
                style={{
                    ...style,
                    flexDirection: 'column',
                    flexWrap: 'nowrap',
                    justifyContent: 'flex-start',
                    alignItems: 'stretch',
                    padding: 0,
                    paddingTop: 0,
                    paddingRight: 0,
                    paddingBottom: 0,
                    paddingLeft: 0,
                    overflow: 'visible',
                }}
            >
                {Platform.OS === 'android' ? (
                    <View
                        style={{
                            flexGrow: 1,
                            alignSelf: 'stretch',
                            flexDirection: windowWidth < windowHeight ? 'column' : 'row',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            zIndex: 1,
                        }}
                    >
                        <View
                            style={{
                                height: androidPadding,
                                backgroundColor: '#000000',
                            }}
                        />
                        <Camera
                            {...cameraProps}
                            ref={ref}
                            style={{
                                flexGrow: 1,
                            }}
                            onCameraReady={onCameraReady}
                        />
                        <View
                            style={{
                                height: androidPadding,
                                backgroundColor: '#000000',
                            }}
                        />
                    </View>
                ) : (
                    <Camera
                        {...cameraProps}
                        ref={ref}
                        style={{
                            flexGrow: 1,
                            alignSelf: 'stretch',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            zIndex: 1,
                        }}
                    />
                )}
                {square && (
                    <View
                        style={{
                            flexGrow: 1,
                            alignSelf: 'stretch',
                            flexDirection: windowWidth < windowHeight ? 'column' : 'row',
                            justifyContent: 'space-between',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            zIndex: 2,
                            opacity: 0.5,
                        }}
                    >
                        <View
                            style={{
                                height: squarePadding,
                                backgroundColor: '#000000',
                            }}
                        />
                        <View
                            style={{
                                height: squarePadding,
                                backgroundColor: '#000000',
                            }}
                        />
                    </View>
                )}
                <View
                    style={{
                        flexGrow: 1,
                        alignSelf: 'stretch',
                        flexDirection: style.flexDirection,
                        flexWrap: style.flexWrap,
                        justifyContent: style.justifyContent,
                        alignItems: style.alignItems,
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        zIndex: 3,
                        padding: style.padding,
                        paddingTop: style.paddingTop,
                        paddingRight: style.paddingRight,
                        paddingBottom: style.paddingBottom,
                        paddingLeft: style.paddingLeft,
                        overflow: style.overflow,
                    }}
                >
                    {props.children}
                </View>
            </View>
        );
    }

    return {
        camera: {
            allowed,
            active,
            activate,
            take,
            deactivate,
            pause,
            resume,
        },
        photo,
        Preview,
    };
}
