import { Button, Box, Icon, Paper, Badge, FormHelperText } from '@mui/material'
import React, { ChangeEvent, useRef, useEffect, useCallback, useState } from 'react'
import { useField } from '@unform/core'

interface PreviewFile {
    url: string
    name: string
}

interface Props {
    name: string
    label: string
    isExternalLoading: boolean
}

type InputProps = JSX.IntrinsicElements['input'] & Props

export const VInputFile: React.FC<InputProps> = ({ name, label, isExternalLoading, ...rest }) => {

    const inputRef = useRef<HTMLInputElement>(null!)
    const { fieldName, registerField, error, clearError } = useField(name)

    const [preview, setPreview] = useState([{ url: '', name: '' }])

    const removeImage = (ref: HTMLInputElement, imgName?: string) => {

        if (imgName && inputRef.current && inputRef.current.files) {
            const newArrayPreview = preview.filter((img) => img.name !== imgName)

            const fileArray = Array.from(inputRef.current.files)
            const newInputFiles = fileArray.filter((img) => img.name !== imgName)

            setPreview(newArrayPreview)

            // Criar uma nova FileList usando DataTransfer
            const dataTransfer = new DataTransfer()
            newInputFiles.forEach((file) => dataTransfer.items.add(file))
            const newFileList = dataTransfer.files

            // Atualizar o inputRef.current.files com a nova FileList
            if (inputRef.current) {
                inputRef.current.files = newFileList
            }

            return
        }

        ref.value = ''
        setPreview([{ url: '', name: '' }])
    }

    const handlePreview = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files

        if (!files) {
            setPreview([{ url: '', name: '' }])
            return
        }

        if (rest.multiple && files instanceof FileList) {

            const fileArray = Array.from(files)

            const previewURL: PreviewFile[] = []
            fileArray.map((file) => {
                const url = URL.createObjectURL(file)
                previewURL.push({ url: url, name: file.name })
            })

            setPreview(previewURL)
        } else {
            const previewURL = URL.createObjectURL(files[0])
            setPreview([{ url: previewURL, name: files[0].name }])
        }
    }, [])

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current,
            path: 'files',
            clearValue(ref: HTMLInputElement) {
                ref.value = ''
                setPreview([{ url: '', name: '' }])
            },
            setValue(_: HTMLInputElement, value: string) {
                setPreview([{ url: value, name: 'image' }])
            },
        })
    }, [fieldName, registerField])

    return (
        <Box component={Paper} padding={2} display='flex' gap={1} flexDirection='column' justifyContent='center' alignItems='center'>
            {preview[0].url !== '' && preview.length > 1 ? (
                <Box display='flex' gap={1} justifyContent='center' alignItems='center'>
                    {preview.map((preview) => (
                        <Badge key={preview.name} badgeContent={<Icon>close</Icon>} color="error" onClick={() => { removeImage(inputRef.current, preview.name) }}>
                            <img src={preview.url} alt="Preview" width="100" />
                        </Badge >
                    ))}
                </Box>
            ) : preview[0].url !== '' && (
                <Badge badgeContent={<Icon>close</Icon>} color="error" onClick={() => { removeImage(inputRef.current) }}>
                    <img src={preview[0].url} alt="Preview" width="100" />
                </Badge >
            )}

            <Button
                variant='contained'
                component='label'
                startIcon={<Icon>upload</Icon>}
            >
                {label}
                <input type="file" disabled={isExternalLoading} hidden accept="image/jpeg, image/png, image/jpg" ref={inputRef} onChange={(e) => {handlePreview(e); error && clearError()}} {...rest} />
            </Button>
            {!!error && (
                <FormHelperText error>{error}</FormHelperText>
            )}
        </Box>
    )
}