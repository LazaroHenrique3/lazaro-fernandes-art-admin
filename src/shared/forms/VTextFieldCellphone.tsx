import * as React from 'react'
import { useEffect, useState } from 'react'
import { useField } from '@unform/core'
import { IMaskInput } from 'react-imask'
import { TextField, TextFieldProps } from '@mui/material'

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

const TextMaskCustom = React.forwardRef<HTMLInputElement, CustomProps>(
    function TextMaskCustom(props, ref) {
        const { onChange, ...other } = props
        return (
            <IMaskInput
                {...other}
                mask="(00) 00000-0000"
                definitions={{
                    '#': /[1-9]/,
                }}
                inputRef={ref}
                onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
                overwrite
            />
        )
    },
)

export const VTextFieldCellphone: React.FC<TextFieldProps> = ({ ...rest }) => {
    const { fieldName, registerField, defaultValue, error, clearError } = useField('cell_phone')
    const [value, setValue] = useState(defaultValue || '')

    useEffect(() => {
        registerField({
            name: fieldName,
            getValue: () => value,
            setValue: (_, newValue) => setValue(newValue)
        })
    }, [registerField, fieldName, value])

    return (
        <TextField
            {...rest}

            fullWidth
            label="Telefone"

            error={!!error}
            helperText={error}
            defaultValue={defaultValue}

            value={value}
            onChange={(e) => setValue(e.target.value)}

            onKeyDown={(e) => { error && clearError(); rest.onKeyDown?.(e)}}

            InputProps={{
                inputComponent: TextMaskCustom as any,
            }}
            variant="outlined"
        />
    )

}

/* import * as React from 'react'
import { useState } from 'react'
import { IMaskInput } from 'react-imask'
import { TextField } from '@mui/material'

export const VTextFieldCPF= () => {
    const [value, setValue] = useState('')

    interface CustomProps {
        onChange: (event: { target: { name: string; value: string } }) => void;
        name: string;
    }

    const TextMaskCustom = React.forwardRef<HTMLInputElement, CustomProps>(
        function TextMaskCustom(props, ref) {
            const { onChange, ...other } = props
            return (
                <IMaskInput
                    {...other}
                    mask="(00) 00000-0000"
                    definitions={{
                        '#': /[1-9]/,
                    }}
                    inputRef={ref}
                    onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
                    overwrite
                />
            )
        },
    )

    return (
        <TextField
            label="CPF"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            name="cpf"

            InputProps={{
                inputComponent: TextMaskCustom as any,
            }}
            variant="outlined"
        />
    )
} */











/*
import { useRef, useEffect } from 'react'
import ReactInputMask, { Props as InputProps } from 'react-input-mask'
import { useField } from '@unform/core'
interface Props extends InputProps {
    name: string
}
export const VTextFieldMask: React.FC<Props> = ({ name, ...rest }) => {
    const inputRef = useRef(null)
    const { fieldName, registerField, defaultValue, error } = useField(name)
    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current,
            path: 'value',
            setValue(ref: any, value: string) {
                ref.setInputValue(value)
            },
            clearValue(ref: any) {
                ref.setInputValue('')
            },
        })
    }, [fieldName, registerField])
    return (
        <ReactInputMask ref={inputRef} defaultValue={defaultValue} {...rest} />
    )
}
*/