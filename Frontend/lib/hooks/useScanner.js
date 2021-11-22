// NÃO MODIFIQUE NEM SUBSTITUA ESTE ARQUIVO

import React, { useState } from 'react';

import { BarCodeScanner } from 'expo-barcode-scanner';

export default function useScanner() {
    const [scanner, setScanner] = useState({
        allowed: false,
        active: false,
        broken: false,
        error: null,
    });

    function activate() {
        if (!scanner.active) {
            if (scanner.allowed) {
                setScanner({
                    allowed: scanner.allowed,
                    active: true,
                    broken: scanner.broken,
                    error: scanner.error,
                });
            } else {
                BarCodeScanner.requestPermissionsAsync()
                    .then((response) => {
                        if (response.granted) {
                            setScanner({
                                allowed: true,
                                active: true,
                                broken: false,
                                error: scanner.error,
                            });
                        }
                    })
                    .catch((error) => {
                        setScanner({
                            allowed: scanner.allowed,
                            active: scanner.active,
                            broken: true,
                            error: error,
                        });
                    });
            }
        }
    }

    function deactivate() {
        if (scanner.active) {
            setScanner({
                allowed: scanner.allowed,
                active: false,
                broken: scanner.broken,
                error: scanner.error,
            });
        }
    }

    function Preview(props) {
        return (
            <BarCodeScanner
                {...props}
            />
        );
    }

    return {
        scanner: {
            active: scanner.active,
            broken: scanner.broken,
            error: scanner.error,
            activate,
            deactivate,
        },
        Preview,
    };
}
