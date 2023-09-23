import {
    Grid,
    Card,
    CardContent,
    Typography
} from '@mui/material'

import { 
    formatCPF, 
    formatPhoneNumber 
} from '../../../shared/util'

interface IInfoAddressProps {
    label: string
    value: string
}

const InfoAddress: React.FC<IInfoAddressProps> = ({ label, value }) => (
    <Typography variant='h6' fontSize={15} textOverflow='ellipsis'>
        <strong>{label}: </strong> {value}
    </Typography>
)

interface ICustomerInfoCardProps {
    name: string
    email: string
    phoneNumber: string
    cpf: string
}

export const CustomerInfoCard: React.FC<ICustomerInfoCardProps> = ({ name, email, phoneNumber, cpf }) => {

    return (
        <Grid container item xs={12} sm={6} lg={4} xl={3} justifyContent='center'>
            <Card sx={{ width: 270 }}>
                <CardContent>
                    <Typography variant='h6'>Cliente</Typography>

                    <InfoAddress label='Nome' value={name} />
                    <InfoAddress label='Email' value={email} />
                    <InfoAddress label='Telefone' value={formatPhoneNumber(phoneNumber)} />
                    <InfoAddress label='CPF' value={formatCPF(cpf)} />
        
                </CardContent>
            </Card>
        </Grid>
    )
}