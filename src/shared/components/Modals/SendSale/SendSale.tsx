import { useState } from 'react'
import { FormHandles } from '@unform/core'
import {
    Box,
    Modal,
    Button,
    Typography,
    CircularProgress,
    Grid,
    LinearProgress,
    Icon
} from '@mui/material'

import {
    VForm,
    VTextField,
    useVForm
} from '../../../forms'

import { 
    TSaleStatus 
} from '../../../services/api/sales/SaleService'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
}

//Hooks personalizados
import {
    UseSendSale
} from './hooks'

interface ISendSaleModal {
    idCustomer: number,
    idSale: number
    setTrackingCode: (trakingCode: string) => void
    updateSendStatus: (status: TSaleStatus) => void
    externalFormSaleRef: React.RefObject<FormHandles>
}
 
export const SendSaleModal: React.FC<ISendSaleModal> = ({idSale, idCustomer, updateSendStatus, setTrackingCode, externalFormSaleRef}) => {
    const { formRef } = useVForm('formRef')

    const [isLoading, setIsLoading] = useState(false)

    const [open, setOpen] = useState(false)
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    //Hooks personalizados
    const { handleSendSale } = UseSendSale({ setIsLoading, setOpen, idSale, idCustomer, updateSendStatus, setTrackingCode, externalFormSaleRef, formRef })

    return (
        <>
            <Button
                variant='contained'
                onClick={handleOpen}
                startIcon={<Icon>local_shipping</Icon>}
            >
                Enviar Pedido
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, maxWidth: '600px' }}>

                    <VForm ref={formRef} onSubmit={handleSendSale}>
                        <Box margin={1} display='flex' flexDirection='column'>

                            <Typography variant='h4' align='center'>
                                Enviar pedido
                            </Typography>

                            <Grid container direction='column' padding={2} spacing={2}>
                                {isLoading && (
                                    <Grid item>
                                        <LinearProgress variant='indeterminate' />
                                    </Grid>
                                )}

                                <Box padding={2}>
                                    <Grid container item direction='row' spacing={2}>

                                        <Grid item xs={12}>
                                            <VTextField fullWidth label='Código de rastreio' name='tracking_code' disabled={isLoading} />
                                        </Grid>

                                    </Grid>
                                </Box>

                                <Grid item>
                                    <Box display='flex' gap={2}>
                                        <Button
                                            type='submit'
                                            variant='contained'
                                            disabled={isLoading}
                                            endIcon={isLoading ? <CircularProgress variant='indeterminate' color='inherit' size={20} /> : undefined}>
                                            Concluir
                                        </Button>

                                        <Button
                                            type='submit'
                                            variant='outlined'
                                            disabled={isLoading}
                                            endIcon={isLoading ? <CircularProgress variant='indeterminate' color='inherit' size={20} /> : undefined}
                                            onClick={handleClose}>
                                            Cancelar
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </VForm>
                </Box>
            </Modal>
        </>
    )
}
