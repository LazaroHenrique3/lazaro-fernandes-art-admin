import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Card,
    CardContent,
    LinearProgress,
    CardActions,
    Button,
    Typography,
    Link
} from '@mui/material'
import { CircularProgress } from '@mui/material'

import { VForm, VTextField, useVForm  } from '../../shared/forms'

//Hooks personalizados
import {
    UseLoginAdmin
} from './hooks'

export const LoginAdmin = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { formRef } = useVForm('formRef')

    const navigate = useNavigate()

    //Hooks personalizados
    const { handleLogin } = UseLoginAdmin({setIsLoading, formRef})

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

                <Box width='100%' display='flex' justifyContent='center'>
                    <Link variant="body2" onClick={() => navigate('/admin/forgot-password')}>
                        Esqueci minha senha
                    </Link>
                </Box>

                {isLoading && (
                    <LinearProgress variant='indeterminate' />
                )}
            </Card>

        </Box>
    )
}