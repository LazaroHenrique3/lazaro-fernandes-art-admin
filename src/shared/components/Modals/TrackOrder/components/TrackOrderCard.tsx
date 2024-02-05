import {
    useTheme,
    Grid,
    Card,
    CardContent,
    Typography
} from '@mui/material'

import { ITrackOrderResponse } from '../../../../services/api/shipping/ShippingService'
import { formatDateTimeForTrackOrder } from '../../../../util'

interface IInfoTrackOrderProps {
    label: string
    value: string
}

const InfoTrackOrder: React.FC<IInfoTrackOrderProps> = ({ label, value }) => (
    <Typography variant='h6' fontSize={15}>
        <strong>{label}: </strong> {value}
    </Typography>
)


export const TrackOrderCard: React.FC<ITrackOrderResponse> = ({ data, cidade, uf, descricao, unidade }) => {
    const theme = useTheme()

    return (
        <Grid container item xs={12} justifyContent='center'>
            <Card sx={{ width: '100%', border: `solid 1px ${theme.palette.primary.light}`}}>
                <CardContent>
                    <InfoTrackOrder label='Data' value={formatDateTimeForTrackOrder(data)} />
                    <InfoTrackOrder label='Descrição' value={descricao} />
                    <InfoTrackOrder label='Unidade' value={unidade} />
                    <InfoTrackOrder label='Cidade' value={cidade} />
                    <InfoTrackOrder label='UF' value={uf} />
                </CardContent>
            </Card>
        </Grid>
    )
}