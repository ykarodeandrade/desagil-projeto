// NÃO MODIFIQUE NEM SUBSTITUA ESTE ARQUIVO

import React, { useState } from 'react';

import { Platform } from 'react-native';

import { Caption, TouchableRipple, TextInput, useTheme } from 'react-native-paper';

import DateTimePickerCore from '@react-native-community/datetimepicker';

import InputView from './InputView';

export default function DateTimePicker(props) {
    const [webActive, setWebActive] = useState(false);
    const [mobileValue, setMobileValue] = useState(mobileString(new Date()));
    const [mobileOpen, setMobileOpen] = useState(false);

    const theme = useTheme();

    function padded(number) {
        if (number > 9) {
            return `${number}`;
        } else {
            return `0${number}`;
        }
    }

    function webString(date) {
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

    function mobileString(date) {
        if (props.type === 'time') {
            return date.toLocaleTimeString().slice(0, -3);
        } else {
            return date.toLocaleDateString();
        }
    }

    function onWebChange(event) {
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

    function onMobileChange(event, date) {
        setMobileOpen(false);
        if (date instanceof Date) {
            date.setSeconds(0);
            if (date.getFullYear() > 999) {
                setMobileValue(mobileString(date));
                props.setValue(date);
            }
        }
    }

    const selectionColor = 'selectionColor' in props ? props.selectionColor : theme.colors.primary;

    return Platform.OS === 'web' ? (
        <InputView
            {...props}
            style={{
                height: 64,
                paddingRight: 12,
                paddingLeft: 12,
                ...props.style,
                flexDirection: 'column',
                flexWrap: 'nowrap',
                justifyContent: 'center',
                alignItems: 'stretch',
            }}
            active={webActive}
        >
            {typeof props.label === 'string' && (
                <Caption
                    style={{
                        color: props.disabled ? theme.colors.disabled : (props.error ? theme.colors.error : (webActive ? theme.colors.primary : theme.colors.placeholder)),
                    }}
                >
                    {props.label}
                </Caption>
            )}
            <input
                style={{
                    margin: 0,
                    borderWidth: 0,
                    padding: 0,
                    fontSize: 16,
                    fontFamily: theme.fonts.regular.fontFamily,
                    backgroundColor: 'transparent',
                    color: props.disabled ? theme.colors.placeholder : theme.colors.text,
                    outline: 'none',
                }}
                disabled={props.disabled}
                selectioncolor={selectionColor}
                dense={props.dense}
                onFocus={() => setWebActive(true)}
                onBlur={() => setWebActive(false)}
                theme={props.theme}
                type={props.type === 'time' ? 'time' : 'date'}
                defaultValue={webString(props.value)}
                onChange={onWebChange}
            />
        </InputView>
    ) : (
        <>
            <TouchableRipple
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
                }}
                disabled={props.disabled}
                onPress={() => setMobileOpen(true)}
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
                    mode={props.mode}
                    right={(
                        <TextInput.Icon
                            name={props.type === 'time' ? 'clock-outline' : 'calendar'}
                            color={props.disabled ? theme.colors.placeholder : theme.colors.text}
                        />
                    )}
                    disabled={props.disabled}
                    label={props.label}
                    error={props.error}
                    selectionColor={props.selectionColor}
                    underlineColor={props.underlineColor}
                    activeUnderlineColor={props.activeUnderlineColor}
                    outlineColor={props.outlineColor}
                    activeOutlineColor={props.activeOutlineColor}
                    dense={props.dense}
                    value={mobileValue}
                    theme={props.theme}
                    editable={false}
                />
            </TouchableRipple>
            {mobileOpen && (
                <DateTimePickerCore
                    mode={props.type}
                    value={props.value}
                    onChange={onMobileChange}
                />
            )}
        </>
    );
}
