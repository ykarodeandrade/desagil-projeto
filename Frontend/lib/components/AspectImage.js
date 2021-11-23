// NÃO MODIFIQUE NEM SUBSTITUA ESTE ARQUIVO

import React, { useState, useEffect } from 'react';

import { Image } from 'react-native';

export default function AspectImage(props) {
    const [basis, setBasis] = useState(0);
    const [ratio, setRatio] = useState(0);

    function onLayout({ nativeEvent }) {
        if (props.basis === 'height') {
            setBasis(nativeEvent.layout.height);
        } else {
            setBasis(nativeEvent.layout.width);
        }
        if (props.onLayout) {
            props.onLayout({ nativeEvent });
        }
    }

    function onSuccess(width, height) {
        if (width > 0 && height > 0) {
            setRatio(width / height);
        } else {
            setRatio(0);
        }
    }

    function onFailure(error) {
        throw error;
    }

    useEffect(() => {
        Image.getSize(props.source, onSuccess, onFailure);
    }, []);

    const style = { ...props.style };
    if (ratio > 0) {
        if (props.basis === 'height') {
            style.width = basis * ratio;
        } else {
            style.height = basis / ratio;
        }
    }

    return (
        <Image
            {...props}
            style={style}
            onLayout={onLayout}
        />
    );
}
