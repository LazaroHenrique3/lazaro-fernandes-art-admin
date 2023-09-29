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

