// NÃO MODIFIQUE NEM SUBSTITUA ESTE ARQUIVO

import React, { useState, useCallback } from 'react';

import { View } from 'react-native';

export default function AspectView(props) {
    const [height, setHeight] = useState(0);

    const onLayout = useCallback((event) => {
        if ('onLayout' in props) {
            props.onLayout(event);
        }
        setHeight(event.nativeEvent.layout.width / ratio);
    }, []);

    let ratio;
    if (Number.isFinite(props.ratio) && props.ratio > 0) {
        ratio = props.ratio;
    } else {
        ratio = 1;
    }

    return (
        <View
            {...props}
            style={{
                ...props.style,
                height: height,
            }}
            onLayout={onLayout}
        >
            {props.children}
        </View>
    );
}
