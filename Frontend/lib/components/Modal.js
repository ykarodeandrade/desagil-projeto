// NÃO MODIFIQUE NEM SUBSTITUA ESTE ARQUIVO

import merge from 'deepmerge';

import React from 'react';

import { Portal, Modal as ModalCore, useTheme } from 'react-native-paper';

export default function Modal(props) {
    let theme = useTheme();
    if (props.theme) {
        theme = merge(theme, props.theme);
    }

    return (
        <Portal
            theme={props.theme}
        >
            <ModalCore
                {...props}
                contentContainerStyle={{
                    alignSelf: 'center',
                    backgroundColor: theme.colors.background,
                    ...props.style,
                }}
            >
                {props.children}
            </ModalCore>
        </Portal>
    );
}
