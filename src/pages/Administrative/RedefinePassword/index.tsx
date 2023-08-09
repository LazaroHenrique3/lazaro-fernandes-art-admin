import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    Box,
    Card,
    CardContent,
    LinearProgress,
    CardActions,
    Button,
    Typography,
} from '@mui/material'
import { CircularProgress } from '@mui/material'

import { VForm, VTextField, useVForm } from '../../../shared/forms'

//Hooks personalizados
import {
    UseRedefinePassword
} from './hooks'

export const RedefinePassword = () => {
    const { email = '' } = useParams<'email'>()

    const [isLoading, setIsLoading] = useState(false)
    const { formRef } = useVForm('formRef')

    useEffect(() => {
        console.log('TesteEmail: ', email)
        formRef.current?.setData({
            email: email,
            verification_token: '',
            password: '',
            confirmPassword: ''
        })
    }, [email, formRef])

    //Hooks personalizados
    const { handleRedefinePassword } = UseRedefinePassword({setIsLoading, formRef})

    return (
        <Box width='100%' height='100vh' display='flex' alignItems='center' justifyContent='center'>

            <Card>
                <VForm ref={formRef} onSubmit={handleRedefinePassword}>

                    <CardContent>
                        <Box display='flex' flexDirection='column' gap={3} width={250}>

                            <Typography variant='h4' align='center'>
                                REDEFINIR SENHA
                            </Typography>

                            <VTextField fullWidth type='email' label='Email' name='email' disabled={isLoading} size='small' />

                            <VTextField fullWidth type='text' label='Token de verificação' name='verification_token' disabled={isLoading} size='small' />

                            <VTextField fullWidth type='password' label='Nova Senha' name='password' disabled={isLoading} size='small' />

                            <VTextField fullWidth type='password' label='Confirmar Senha' name='confirmPassword' disabled={isLoading} size='small'/>

                        </Box>
                    </CardContent>

                    <CardActions>
                        <Box width='100%' display='flex' justifyContent='center'>
                            <Button
                                type='submit'
                                variant='contained'
                                disabled={isLoading}
                                endIcon={isLoading ? <CircularProgress variant='indeterminate' color='inherit' size={20} /> : undefined}>
                                Redefinir
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