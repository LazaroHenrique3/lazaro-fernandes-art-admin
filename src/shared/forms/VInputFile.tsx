import { Button, Box, Icon, Paper, Badge, FormHelperText } from '@mui/material'
import React, { ChangeEvent, useRef, useEffect, useCallback, useState } from 'react'
import { useField } from '@unform/core'

interface Props {
    name: string
    label: string
    isExternalLoading: boolean
}

type InputProps = JSX.IntrinsicElements['input'] & Props

export const VInputFile: React.FC<Props> = ({ name, label, isExternalLoading, ...rest }: InputProps) => {
    const inputRef = useRef<HTMLInputElement>(null!)
    const { fieldName, registerField, defaultValue, error } = useField(name)

    const [preview, setPreview] = useState(defaultValue)

    const removeImage = (ref: HTMLInputElement) => {
        ref.value = ''
        setPreview(null)
    }

    const handlePreview = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) {
            setPreview(null)
            return
        }

        const previewURL = URL.createObjectURL(file)
        setPreview(previewURL)
    }, [])

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current,
            path: 'files[0]',
            clearValue(ref: HTMLInputElement) {
                ref.value = ''
                setPreview(null)
            },
            setValue(_: HTMLInputElement, value: string) {
                setPreview(value)
            },
        })
    }, [fieldName, registerField])

    return (
        <Box component={Paper} padding={2} display='flex' gap={1} flexDirection='column' justifyContent='center' alignItems='center'>
            {preview && (
                <Badge badgeContent={<Icon>close</Icon>} color="error" onClick={() => { removeImage(inputRef.current) }}>
                    <img src={preview} alt="Preview" width="100" />
                </Badge >
            )}
            <Button
                variant='contained'
                component='label'
                startIcon={<Icon>upload</Icon>}
            >
                {label}
                <input type="file" disabled={isExternalLoading} hidden accept="image/jpeg, image/png, image/jpg" ref={inputRef} onChange={handlePreview} {...rest} />
            </Button>
            {!!error && (
                <FormHelperText>{error}</FormHelperText>
            )}
        </Box>
    )
}