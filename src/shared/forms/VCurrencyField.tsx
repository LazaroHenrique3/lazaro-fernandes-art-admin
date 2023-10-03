import * as React from 'react'
import { useEffect, useState } from 'react'
import { useField } from '@unform/core'

import { 
    TextField, 
    TextFieldProps 
} from '@mui/material'

import {
    NumericFormat,
    NumericFormatProps,
} from 'react-number-format'

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
    function NumericFormatCustom(props, ref) {
        const { onChange, ...other } = props

        return (
            <NumericFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    })
                }}
                thousandSeparator
                valueIsNumericString
                prefix="R$"
            />
        )
    },
)

type TCurrencyFieldTest = TextFieldProps & {
    name: string
}

export const VCurrencyField: React.FC<TCurrencyFieldTest> = ({ name, ...rest }) => {
    const { fieldName, registerField, defaultValue, error, clearError } = useField(name)
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

            error={!!error}
            helperText={error}
            defaultValue={defaultValue}

            value={value}
            onChange={(e) => setValue(e.target.value)}

            onKeyDown={(e) => { error && clearError(); rest.onKeyDown?.(e)}}

            InputProps={{
                inputComponent: NumericFormatCustom as any,
            }}
            variant="outlined"
        />
    )

}
