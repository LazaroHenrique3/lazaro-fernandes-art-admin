import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box
} from '@mui/material'

import { formatCEP } from '../../../../shared/util'
import { AllAddresses } from '../../../../shared/components/Modals/AllAddress/AllAdress'
import { IListAddress } from '../../../../shared/services/api/address/AddressService'
import { TSaleStatus } from '../../../../shared/services/api/sales/SaleService'
import { FormHandles } from '@unform/core'

interface IInfoAddressProps {
    label: string
    value: string
}

const InfoAddress: React.FC<IInfoAddressProps> = ({ label, value }) => (
    <Typography variant='h6' fontSize={15} textOverflow='ellipsis'>
        <strong>{label}: </strong> {value}
    </Typography>
)

interface IAddressSelectCardProps {
    formRef: React.RefObject<FormHandles>
    idSale: number
    idUser: number
    idAddress: number
    statusSale: TSaleStatus
    street: string
    number: string
    city: string
    state: string
    cep: string
    neighborhood: string
    complement?: string
    setSaleAddress: (address: IListAddress) => void
}

export const DeliveryAddressCard: React.FC<IAddressSelectCardProps> = ({ formRef, idSale, idUser, idAddress, statusSale, street, number, city, state, cep, neighborhood, complement, setSaleAddress }) => {
    
    return (
        <Grid container item xs={12} sm={6} lg={4} xl={3} justifyContent='center'>
            <Card sx={{ width: 270 }}>
                <CardContent sx={{ height: '90%' }}>
                    <Box height='100%' display='flex' flexDirection='column' justifyContent='space-between' gap={3}>
                        <Box>
                            <Typography variant='h6'>Endereço de Entrega</Typography>

                            <InfoAddress label='Cidade' value={city} />
                            <InfoAddress label='Estado' value={state} />
                            <InfoAddress label='CEP' value={formatCEP(cep)} />
                            <InfoAddress label='Logradouro' value={street} />
                            <InfoAddress label='Número' value={number} />
                            <InfoAddress label='Bairro' value={neighborhood} />
                            {(complement) &&
                                <InfoAddress label='Complemento' value={complement} />
                            }
                        </Box>

                        {(statusSale === 'Em preparação') && (
                            <AllAddresses
                                formRef={formRef}
                                selectedAddress={idAddress}
                                idSale={idSale}
                                idUser={idUser}
                                setSaleAddress={setSaleAddress} />
                        )}

                    </Box>
                </CardContent>
            </Card>
        </Grid>
    )
}