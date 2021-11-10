// NÃO MODIFIQUE NEM SUBSTITUA ESTE ARQUIVO

import React, { useState, useCallback } from 'react';

import IconCore from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Icon(props) {
    const [size, setSize] = useState(0);

    const onLayout = useCallback((event) => {
        if ('onLayout' in props) {
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
            {...props}
            style={{
                flexGrow: 1,
                alignSelf: 'stretch',
                margin: 0,
                ...props.style,
            }}
            size={size}
            onLayout={onLayout}
        />
    );
}
