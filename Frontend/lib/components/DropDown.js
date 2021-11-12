// NÃO MODIFIQUE NEM SUBSTITUA ESTE ARQUIVO

import React, { useState } from 'react';

import { View } from 'react-native';

import DropDownCore from 'react-native-paper-dropdown';

export default function DropDown(props) {
    const [open, setOpen] = useState(false);

    return (
        <View
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
            pointerEvents={props.disabled ? 'none' : props.pointerEvents}
        >
            <DropDownCore
                visible={open}
                multiSelect={props.multiSelect}
                onDismiss={() => setOpen(false)}
                showDropDown={() => setOpen(true)}
                value={props.value}
                setValue={props.setValue}
                label={props.label}
                placeholder={props.placeholder}
                mode={props.mode}
                inputProps={{
                    style: {
                        ...props.style,
                        flexGrow: 1,
                        alignSelf: 'stretch',
                        marginTop: 0,
                        marginRight: 0,
                        marginBottom: 0,
                        marginLeft: 0,
                    },
                    left: false,
                    disabled: props.disabled,
                    error: props.error,
                    onChangeText: false,
                    selectionColor: props.selectionColor,
                    underlineColor: props.underlineColor,
                    activeUnderlineColor: props.activeUnderlineColor,
                    outlineColor: props.outlineColor,
                    activeOutlineColor: props.activeOutlineColor,
                    dense: props.dense,
                    multiline: false,
                    numberOfLines: 1,
                    onFocus: false,
                    onBlur: false,
                    editable: false,
                }}
                list={props.list}
                dropDownContainerMaxHeight={props.dropDownContainerMaxHeight}
                dropDownContainerHeight={props.dropDownContainerHeight}
                activeColor={props.activeColor}
                theme={props.theme}
                dropDownStyle={props.dropDownStyle}
                dropDownItemSelectedTextStyle={props.dropDownItemSelectedTextStyle}
                dropDownItemSelectedStyle={props.dropDownItemSelectedStyle}
                dropDownItemStyle={props.dropDownItemStyle}
                dropDownItemTextStyle={props.dropDownItemTextStyle}
            />
        </View>
    );
}
