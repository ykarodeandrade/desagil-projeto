// NÃO MODIFIQUE NEM SUBSTITUA ESTE ARQUIVO

import { useState } from 'react';

import * as Location from 'expo-location';

export default function useGPS(location) {
    const [gps, setGPS] = useState({
        allowed: false,
        updating: false,
        broken: false,
        location: location,
        error: null,
    });

    function doUpdate() {
        Location.getCurrentPositionAsync()
            .then((location) => {
                setGPS({
                    allowed: gps.allowed,
                    updating: false,
                    broken: false,
                    location: {
                        timestamp: new Date(location.timestamp),
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        accuracy: location.coords.accuracy,
                    },
                    error: gps.error,
                });
            });
    }

    function update() {
        setGPS({
            allowed: gps.allowed,
            updating: true,
            broken: gps.broken,
            location: gps.location,
            error: gps.error,
        });
        if (gps.allowed) {
            doUpdate();
        } else {
            Location.requestForegroundPermissionsAsync()
                .then((response) => {
                    if (response.granted) {
                        setGPS({
                            allowed: true,
                            updating: gps.updating,
                            broken: gps.broken,
                            location: gps.location,
                            error: gps.error,
                        });
                        doUpdate();
                    }
                })
                .catch((error) => {
                    setGPS({
                        allowed: gps.allowed,
                        updating: false,
                        broken: true,
                        location: gps.location,
                        error: error,
                    });
                });
        }
    }

    return {
        gps: {
            allowed: gps.allowed,
            updating: gps.updating,
            broken: gps.broken,
            location: gps.location,
            error: gps.error,
            update,
        },
    };
}
