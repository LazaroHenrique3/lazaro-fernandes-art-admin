import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Card, CardContent, LinearProgress, CardActions, Button, Typography } from '@mui/material'
import { CircularProgress } from '@mui/material'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import * as yup from 'yup'

import { useAuthContext } from '../../../shared/contexts'
import { VForm, VTextField, useVForm, IVFormErrors } from '../../../shared/forms'
import {
    IFormData,
    formatValidationSchema
} from './validation/Schema'

export const LoginAdmin = () => {
    const { login } = useAuthContext()

    const [isLoading, setIsLoading] = useState(false)
    const { formRef } = useVForm()

    const navigate = useNavigate()

    const handleLogin = async (data: IFormData) => {
        try {
            const validateData = await formatValidationSchema.validate(data, { abortEarly: false })

            setIsLoading(true)

            const result = await login(validateData.email, validateData.password)
            setIsLoading(false)

            if (typeof result === 'string') {
                toast.error(result)
            } else {
                navigate('/admin/admin-home')
            }

        } catch (errors) {
            const errorsYup: yup.ValidationError = errors as yup.ValidationError

            const validationErrors: IVFormErrors = {}

            errorsYup.inner.forEach(error => {
                if (!error.path) return

                validationErrors[error.path] = error.message
                formRef.current?.setErrors(validationErrors)
            })
        }
    }

    return (
        <Box width='100%' height='100vh' display='flex' alignItems='center' justifyContent='center'>

            <Card>
                <VForm ref={formRef} onSubmit={handleLogin}>
                    <CardContent>
                        <Box display='flex' flexDirection='column' gap={3} width={250}>
                            <Typography variant='h4' align='center'>
                                LOGIN
                            </Typography>

                            <VTextField fullWidth type='email' label='Email' name='email' disabled={isLoading} size='small' />

                            <VTextField fullWidth type='password' label='Senha' name='password' disabled={isLoading} size='small' />
                        </Box>
                    </CardContent>
                    <CardActions>
                        <Box width='100%' display='flex' justifyContent='center'>
                            <Button
                                type='submit'
                                variant='contained'
                                disabled={isLoading}
                                endIcon={isLoading ? <CircularProgress variant='indeterminate' color='inherit' size={20} /> : undefined}>
                                Entrar
                            </Button>
                        </Box>
                    </CardActions>

                </VForm>
                {isLoading && (
                    <LinearProgress variant='indeterminate' />
                )}
            </Card>

        </Box>
    )
}