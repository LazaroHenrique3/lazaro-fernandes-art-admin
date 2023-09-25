import {
    Grid,
    Card,
    CardContent,
    Typography
} from '@mui/material'

import { formatCEP } from '../../../../shared/util'

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
    street: string
    number: string
    city: string
    state: string
    cep: string
    neighborhood: string
    complement?: string
}

export const DeliveryAddressCard: React.FC<IAddressSelectCardProps> = ({ street, number, city, state, cep, neighborhood, complement }) => {

    return (
        <Grid container item xs={12} sm={6} lg={4} xl={3} justifyContent='center'>
            <Card sx={{ width: 270 }}>
                <CardContent>
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
                </CardContent>
            </Card>
        </Grid>
    )
}