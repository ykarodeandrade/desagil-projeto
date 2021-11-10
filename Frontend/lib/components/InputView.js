// NÃO MODIFIQUE NEM SUBSTITUA ESTE ARQUIVO

import React from 'react';

import { View } from 'react-native';

import { useTheme } from 'react-native-paper';

export default function InputView(props) {
    const theme = useTheme();

    const underlineColor = 'underlineColor' in props ? props.underlineColor : (theme.dark ? '#424242' : '#c9c9c9');
    const activeUnderlineColor = 'activeUnderlineColor' in props ? props.activeUnderlineColor : theme.colors.primary;
    const outlineColor = 'outlineColor' in props ? props.outlineColor : (theme.dark ? '#424242' : '#c9c9c9');
    const activeOutlineColor = 'activeOutlineColor' in props ? props.activeOutlineColor : theme.colors.primary;

    const lineColor = props.mode === 'outlined' ? outlineColor : underlineColor;
    const activeLineColor = props.mode === 'outlined' ? activeOutlineColor : activeUnderlineColor;

    const borderColor = props.disabled ? lineColor : (props.active ? activeLineColor : lineColor);

    return (
        <View
            {...props}
            style={{
                borderTopLeftRadius: theme.roundness,
                borderTopRightRadius: theme.roundness,
                borderBottomLeftRadius: props.mode === 'outlined' ? theme.roundness : 0,
                borderBottomRightRadius: props.mode === 'outlined' ? theme.roundness : 0,
                backgroundColor: props.mode === 'outlined' ? 'transparent' : (theme.dark ? '#161616' : '#e7e7e7'),
                ...props.style,
                flexDirection: 'column',
                flexWrap: 'nowrap',
                justifyContent: 'center',
                alignItems: 'stretch',
                paddingTop: 0,
                paddingRight: 0,
                paddingBottom: 0,
                paddingLeft: 0,
            }}
            pointerEvents={props.disabled ? 'none' : undefined}
        >
            <View
                style={{
                    borderTopLeftRadius: theme.roundness,
                    borderTopRightRadius: theme.roundness,
                    borderBottomLeftRadius: props.mode === 'outlined' ? theme.roundness : 0,
                    borderBottomRightRadius: props.mode === 'outlined' ? theme.roundness : 0,
                    ...props.style,
                    flexGrow: 1,
                    alignSelf: 'stretch',
                    marginTop: 0,
                    marginRight: 0,
                    marginBottom: 0,
                    marginLeft: 0,
                    borderTopWidth: props.mode === 'outlined' ? 2 : 0,
                    borderRightWidth: props.mode === 'outlined' ? 2 : 0,
                    borderBottomWidth: 2,
                    borderLeftWidth: props.mode === 'outlined' ? 2 : 0,
                    borderColor: props.error ? theme.colors.error : borderColor,
                    backgroundColor: 'transparent',
                }}
            >
                {props.children}
            </View>
        </View>
    );
}
