import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Card,
    CardContent,
    LinearProgress,
    CardActions,
    Button,
    Link
} from '@mui/material'
import { CircularProgress } from '@mui/material'

import { VForm, VTextField, useVForm } from '../../../shared/forms'

//Hooks personalizados
import {
    UseForgotPassword
} from './hooks'

export const ForgotPassword = () => {
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
    const { formRef } = useVForm('formRef')

    //Hooks personalizados
    const { handleForgotPassword } = UseForgotPassword({setIsLoading, formRef})

    return (
        <Box width='100%' height='100vh' display='flex' alignItems='center' justifyContent='center'>

            <Card>
                <VForm ref={formRef} onSubmit={handleForgotPassword}>

                    <CardContent>
                        <Box display='flex' flexDirection='column' gap={3} width={250}>

                            <VTextField fullWidth type='email' label='Email' name='email' disabled={isLoading} size='small' placeholder='Email utilizado no login'/>

                        </Box>
                    </CardContent>

                    <CardActions>
                        <Box width='100%' display='flex' justifyContent='center'>
                            <Button
                                type='submit'
                                variant='contained'
                                disabled={isLoading}
                                endIcon={isLoading ? <CircularProgress variant='indeterminate' color='inherit' size={20} /> : undefined}>
                                Recuperar
                            </Button>
                        </Box>
                    </CardActions>
                </VForm>

                <Box width='100%' display='flex' justifyContent='center'>
                    <Link variant="body2" onClick={() => navigate(-1)}>
                        Voltar ao login
                    </Link>
                </Box>

                {isLoading && (
                    <LinearProgress variant='indeterminate' />
                )}
            </Card>

        </Box>
    )
}