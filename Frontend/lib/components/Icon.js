// NÃO MODIFIQUE NEM SUBSTITUA ESTE ARQUIVO

import merge from 'deepmerge';

import React, { useState, useCallback } from 'react';

import { useTheme } from 'react-native-paper';

import IconCore from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Icon(props) {
    let theme = useTheme();
    if (props.theme) {
        theme = merge(theme, props.theme);
    }

    const [size, setSize] = useState(0);

    const onLayout = useCallback((event) => {
        if (props.onLayout) {
            props.onLayout(event);
        }
        const width = event.nativeEvent.layout.width;
        const height = event.nativeEvent.layout.height;
        if (width === 0) {
            setSize(height);
        } else if (height === 0) {
            setSize(width);
        } else {
            setSize(Math.min(width, height));
        }
    }, []);

    return (
        <IconCore
            color={theme.colors.text}
            {...props}
            style={{
                flexGrow: 1,
                margin: 0,
                padding: 0,
                ...props.style,
            }}
            onLayout={onLayout}
            size={size}
        />
    );
}
