// NÃO MODIFIQUE NEM SUBSTITUA ESTE ARQUIVO

import merge from 'deepmerge';

import React, { useRef, useState } from 'react';

import { Platform, I18nManager } from 'react-native';

import { TextInput, TouchableRipple, Portal, Modal, Button, useTheme } from 'react-native-paper';

import DateTimePickerCore from '@react-native-community/datetimepicker';

export default function DateTimePicker(props) {
    let theme = useTheme();
    if (props.theme) {
        theme = merge(theme, props.theme);
    }

    const webRef = useRef();

    const [iosValue, setIosValue] = useState();
    const [mobileOpen, setMobileOpen] = useState(false);

    function padded(number) {
        if (number > 9) {
            return `${number}`;
        } else {
            return `0${number}`;
        }
    }

    function webToString(date) {
        if (props.type === 'time') {
            const hours = padded(date.getHours());
            const minutes = padded(date.getMinutes());
            return `${hours}:${minutes}`;
        } else {
            const year = date.getFullYear();
            const month = padded(date.getMonth() + 1);
            const day = padded(date.getDate());
            return `${year}-${month}-${day}`;
        }
    }

    function mobileToString(date) {
        if (props.type === 'time') {
            return date.toLocaleTimeString().slice(0, -3);
        } else {
            return date.toLocaleDateString();
        }
    }

    function webOnFocus() {
        if (webRef.current) {
            webRef.current.handleFocus();
        }
    }

    function webOnBlur() {
        if (webRef.current) {
            webRef.current.handleBlur();
        }
    }

    function webOnChange(event) {
        let dateString;
        if (props.type === 'time') {
            dateString = `1070-01-01T${event.target.value}:00`;
        } else {
            dateString = `${event.target.value}T00:00:00`;
        }
        const date = new Date(dateString);
        if (date.getFullYear() > 999) {
            props.setValue(date);
        }
    }

    function iosOnChange(event, date) {
        if (date instanceof Date) {
            date.setSeconds(0);
            setIosValue(date);
        }
    }

    function androidOnChange(event, date) {
        mobileOnDismiss();
        if (date instanceof Date) {
            date.setSeconds(0);
            if (date.getFullYear() > 999) {
                props.setValue(date);
            }
        }
    }

    function iosOnPress() {
        mobileOnDismiss();
        if (iosValue.getFullYear() > 999) {
            props.setValue(iosValue);
        }
    }

    function mobileOnPress() {
        if (Platform.OS === 'ios') {
            setIosValue(props.value);
        }
        setMobileOpen(true);
    }

    function mobileOnDismiss() {
        setMobileOpen(false);
    }

    return Platform.OS === 'web' ? (
        <TextInput
            {...props}
            ref={webRef}
            left={null}
            right={null}
            multiline={false}
            numberOfLines={1}
            render={() => {
                const fontSize = props.style && props.style.fontSize ? props.style.fontSize : 16;
                const style = {
                    flexGrow: 1,
                    margin: 0,
                    borderWidth: 0,
                    fontSize: fontSize,
                    fontFamily: theme.fonts.regular.fontFamily,
                    fontWeight: props.style && props.style.fontWeight ? props.style.fontWeight : theme.fonts.regular.fontWeight,
                    backgroundColor: 'transparent',
                    color: props.disabled ? theme.colors.placeholder : theme.colors.text,
                    textAlignVertical: 'center',
                    textAlign: props.style && props.style.textAlign ? props.style.textAlign : (I18nManager.isRTL ? 'right' : 'left'),
                };
                const fontHeight = props.style && props.style.lineHeight ? props.style.lineHeight : fontSize;
                if (props.mode === 'outlined') {
                    style.zIndex = 1;
                    let padding;
                    if (props.style && props.style.height) {
                        style.height = props.style.height;
                        padding = Math.max(0, (props.style.height - fontHeight) / 2);
                    } else {
                        style.height = (props.dense ? 48 : 64) - 8;
                        padding = 0;
                    }
                    style.paddingTop = padding;
                    style.paddingBottom = padding;
                    style.paddingLeft = 14;
                    style.paddingRight = 14;
                } else {
                    if (props.style && props.style.height) {
                        style.height = props.style.height;
                    } else {
                        style.height = (props.dense ? (props.label ? 52 : 40) - 24 : 64 - 30);
                    }
                    if (props.label) {
                        style.paddingTop = props.dense ? 22 : 24;
                        style.paddingBottom = props.dense ? 2 : 4;
                    } else {
                        style.paddingTop = 0;
                        style.paddingBottom = 0;
                    }
                    style.paddingLeft = 12;
                    style.paddingRight = 12;
                }
                if (Platform.OS === 'web') {
                    style.outline = 'none';
                } else {
                    if (props.style && props.style.outline) {
                        style.outline = props.style.outline;
                    }
                }
                return (
                    <input
                        style={style}
                        disabled={props.disabled}
                        selectioncolor={props.selectionColor}
                        onFocus={webOnFocus}
                        onBlur={webOnBlur}
                        editable={props.editable}
                        type={props.type === 'time' ? 'time' : 'date'}
                        defaultValue={webToString(props.value)}
                        onChange={webOnChange}
                    />
                );
            }}
        />
    ) : (
        <>
            <TouchableRipple
                theme={props.theme}
                style={{
                    ...props.style,
                    flexDirection: 'column',
                    flexWrap: 'nowrap',
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    borderTopWidth: 0,
                    borderRightWidth: 0,
                    borderLeftWidth: 0,
                    borderBottomWidth: 0,
                    paddingTop: 0,
                    paddingRight: 0,
                    paddingBottom: 0,
                    paddingLeft: 0,
                    backgroundColor: 'transparent',
                }}
                disabled={props.disabled}
                onFocus={props.onFocus}
                onBlur={props.onBlur}
                onPress={mobileOnPress}
            >
                <TextInput
                    {...props}
                    style={{
                        ...props.style,
                        flexGrow: 1,
                        alignSelf: 'stretch',
                        marginTop: 0,
                        marginRight: 0,
                        marginBottom: 0,
                        marginLeft: 0,
                    }}
                    left={null}
                    right={(
                        <TextInput.Icon
                            name={props.type === 'time' ? 'clock-outline' : 'calendar'}
                            onPress={mobileOnPress}
                            forceTextInputFocus={false}
                            theme={props.theme}
                            disabled={props.disabled}
                        />
                    )}
                    onChangeText={null}
                    multiline={false}
                    numberOfLines={1}
                    onFocus={null}
                    onBlur={null}
                    value={mobileToString(props.value)}
                    editable={false}
                />
            </TouchableRipple>
            {Platform.OS === 'ios' ? (
                <Portal
                    theme={props.theme}
                >
                    <Modal
                        contentContainerStyle={{
                            alignSelf: 'center',
                            padding: 6,
                            backgroundColor: theme.colors.background,
                        }}
                        onDismiss={mobileOnDismiss}
                        visible={mobileOpen}
                    >
                        <DateTimePickerCore
                            style={{
                                margin: 6,
                            }}
                            mode={props.type}
                            value={iosValue}
                            onChange={iosOnChange}
                        />
                        <Button
                            theme={props.theme}
                            style={{
                                margin: 6,
                            }}
                            onPress={iosOnPress}
                        >
                            Ok
                        </Button>
                    </Modal>
                </Portal>
            ) : (
                mobileOpen && (
                    <DateTimePickerCore
                        mode={props.type}
                        value={props.value}
                        onChange={androidOnChange}
                    />
                )
            )}
        </>
    );
}
