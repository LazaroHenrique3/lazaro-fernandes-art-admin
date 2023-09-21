import { useRef, useState, useEffect } from 'react'
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker'
import { parseISO } from 'date-fns'
import { useField } from '@unform/core'
import { TextField } from '@mui/material'

import 'react-datepicker/dist/react-datepicker.css'
import './VDateInputStyle.css'

import { registerLocale } from 'react-datepicker'
import ptBR from 'date-fns/locale/pt-BR'

registerLocale('ptBR', ptBR)

type TVDateInput = Omit<ReactDatePickerProps, 'onChange'> & {
    name: string
    label: string
}

export const VDateInput: React.FC<TVDateInput> = ({ name, label, ...rest }) => {
    const datepickerRef = useRef(null)
    const { fieldName, registerField, defaultValue, error, clearError } = useField(name)

    const [date, setDate] = useState<Date | null>(defaultValue ? parseISO(defaultValue) : null)

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: datepickerRef.current,
            getValue: (ref) => ref.props.selected,
            setValue: (ref, value) => {
                if (value) { ref.setSelected(parseISO(value as string))}
            },
            clearValue: (ref) => {
                ref.clear()
            },
        })
    }, [fieldName, registerField])


    return (
        <div className={`customDatePickerWidth ${error ? 'customDatePickerError' : ''}`}>
            <ReactDatePicker
                autoComplete='off'
                ref={datepickerRef}
                selected={date}
                onChange={(newValue) => { setDate(newValue); error && clearError() }}
                locale='ptBR'
                dateFormat='dd/MM/yyyy'
                customInput={<TextField autoComplete='off' fullWidth label={label} error={!!error} helperText={error} />}
                {...rest}
            />
        </div>
    )
}
