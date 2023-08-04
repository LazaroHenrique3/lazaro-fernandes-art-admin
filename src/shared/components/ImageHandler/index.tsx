import { Button, Box, Icon, Paper, Badge, FormHelperText } from '@mui/material'
import React, { ChangeEvent, useRef, useEffect, useCallback, useState } from 'react'
import * as yup from 'yup'

import {
    IVFormErrors,
} from '../../../shared/forms'
import { formatValidationSchemaUpdateImage } from './validation/Schemas'

interface Props {
    idImage: number
    urlImage: string
    showDeleteButton: boolean
    isExternalLoading: boolean
    isInsertImage: boolean
    handleDeleteImage?: (id: number) => void
    handleUpdateImage?: (id: number, newImage: FileList) => void
    handleInsertImage?: (newImage: FileList) => void
}

type InputProps = JSX.IntrinsicElements['input'] & Props

export const ImageHandler: React.FC<InputProps> = ({
    urlImage,
    showDeleteButton,
    idImage,
    isExternalLoading,
    isInsertImage,
    handleDeleteImage,
    handleUpdateImage,
    handleInsertImage,
    ...rest }) => {

    const inputRef = useRef<HTMLInputElement>(null!)

    const [preview, setPreview] = useState([{ url: '', name: '' }])
    const [image, setImage] = useState(urlImage)
    const [error, setError] = useState<string>()

    //Sempre que houver a atualização eu atualizo o state externo de imagem
    useEffect(() => {
        setImage(urlImage)

        inputRef.current.value = ''
        setPreview([{ url: '', name: '' }])
    }, [urlImage])

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

        const previewURL = URL.createObjectURL(files[0])
        setPreview([{ url: previewURL, name: files[0].name }])
    }, [])

    return (
        <Box component={Paper} padding={2} display='flex' gap={1} flexDirection='column' justifyContent='center' alignItems='center'>
            {preview[0].url !== '' ? (
                <Badge badgeContent={<Icon>close</Icon>} invisible={isExternalLoading} color="error" onClick={() => { removeImage(inputRef.current); setError(undefined) }}>
                    <img src={preview[0].url} alt="Preview" width="100" />
                </Badge>
            ) : image !== '' ? (
                <img src={image} alt='Preview' width='100' />
            ) : null}

            <Box display='flex' flexDirection='column' gap={1} justifyContent='center' alignItems='center' width='100'>
                <Button
                    sx={{ width: '100%' }}
                    disabled={isExternalLoading}
                    variant='outlined'
                    component='label'
                    color={(preview[0].url !== '') ? 'success' : 'primary'}
                    startIcon={(preview[0].url !== '') ? <Icon>check</Icon> : image !== '' ? (<Icon>edit_icon</Icon>) : <Icon>add</Icon>}
                    onClick={async () => {
                        if (preview[0].url === '') return

                        try {
                            await formatValidationSchemaUpdateImage.validate({ image: inputRef.current?.files as FileList }, { abortEarly: false })

                            if (!isInsertImage && handleUpdateImage) {
                                handleUpdateImage(idImage, inputRef.current?.files as FileList)
                            } else if(isInsertImage && handleInsertImage) {
                                handleInsertImage(inputRef.current?.files as FileList)
                            }

                            setError(undefined)
                        } catch (errors) {
                            const errorsYup: yup.ValidationError = errors as yup.ValidationError

                            const validationErrors: IVFormErrors = {}

                            errorsYup.inner.forEach(error => {
                                if (!error.path) return

                                validationErrors[error.path] = error.message
                            })

                            setError(validationErrors['image'])
                        }

                    }}
                >
                    {(preview[0].url !== '') ? 'Confirmar' : image !== '' ? ('Editar') : 'Adicionar'}
                    <input type="file"
                        disabled={preview[0].url !== ''}
                        hidden accept="image/jpeg, image/png, image/jpg"
                        ref={inputRef}
                        onChange={(e) => { handlePreview(e) }} {...rest} />
                </Button>

                {(preview[0].url === '' && showDeleteButton) && (
                    <Button
                        sx={{ width: '100%' }}
                        disabled={isExternalLoading}
                        variant='contained'
                        component='label'
                        color='error'
                        startIcon={<Icon>delete_icon</Icon>}
                        onClick={() => { (handleDeleteImage) ? handleDeleteImage(idImage) : ''; setError(undefined) }}
                    >
                        Apagar
                    </Button>
                )}
            </Box>
            {
                !!error && (
                    <FormHelperText error>{error}</FormHelperText>
                )
            }
        </Box >
    )
}
