import {
    useTheme,
    Grid,
    Button,
    Card,
    CardActions,
    CardContent,
    Typography,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    CircularProgress,
    Box
} from '@mui/material'

import { 
    formatCEP, 
    formattedDateUS, 
    formattedPrice, 
    showFormattedDataString 
} from '../../../../../shared/util'
import { TSaleShippingMethods } from '../../../../services/api/sales/SaleService'
import { useState } from 'react'
import { IPriceDeadlineResponse } from '../../../../services/api/shipping/ShippingService'

interface IInfoAddressProps {
    label: string
    value: string
}

const InfoAddress: React.FC<IInfoAddressProps> = ({ label, value }) => (
    <Typography variant='h6' fontSize={15} noWrap textOverflow='ellipsis'>
        <strong>{label}: </strong> {value}
    </Typography>
)

interface IAddressCardProps {
    idSale: number
    idUser: number
    idAddress: number
    street: string
    number: string
    city: string
    state: string
    cep: string
    neighborhood: string
    selected: boolean
    isLoading: boolean
    handleAddress: (idSale: number, idNewAddress: number, shippingMethod: TSaleShippingMethods) => void
    calculateShipping: (idCustomer: number, idSale: number, cep: string) => Promise<IPriceDeadlineResponse | undefined>
}

export const AddressCard: React.FC<IAddressCardProps> = ({
    idSale,
    idUser,
    idAddress,
    street,
    number,
    city,
    state,
    cep,
    neighborhood,
    selected,
    isLoading,
    handleAddress,
    calculateShipping
}) => {

    const theme = useTheme()

    const [isInternalLoading, setIsInternalLoading] = useState(false)

    const [selectedShippingMethod, setSelectedShippingMethod] = useState<TSaleShippingMethods>('PAC')

    const [completeChange, setCompleteChange] = useState(false)

    const [infoShippingPac, setInfoShippingPac] = useState({ price: '0', deadline: '' })
    const [infoShippingSedex, setInfoShippingSedex] = useState({ price: '0', deadline: '' })

    const handleCalculateShipping = async () => {
        if (!idUser) return

        setIsInternalLoading(true)
        const result = await calculateShipping(idUser, idSale, cep)

        setIsInternalLoading(false)

        if (result) {
            // PAC
            const ExpectedDeliveryTimePac = new Date()
            ExpectedDeliveryTimePac.setDate(ExpectedDeliveryTimePac.getDate() + Number(result.prazopac))
            const formattedDeadlinePac = formattedDateUS(ExpectedDeliveryTimePac)

            const shippingPricePac = result.valorpac.replace(',', '.')

            // SEDEX
            const ExpectedDeliveryTimeSedex = new Date()
            ExpectedDeliveryTimeSedex.setDate(ExpectedDeliveryTimeSedex.getDate() + Number(result.prazosedex))
            const formattedDeadlineSedex = formattedDateUS(ExpectedDeliveryTimeSedex)

            const shippingPriceSedex = result.valorsedex.replace(',', '.')

            setInfoShippingPac({ price: shippingPricePac, deadline: formattedDeadlinePac })
            setInfoShippingSedex({ price: shippingPriceSedex, deadline: formattedDeadlineSedex })
            setCompleteChange(true)
        }
    }

    const handleChangeShippingMethod = (method: TSaleShippingMethods) => {
        setSelectedShippingMethod(method)
    }

    return (
        <Grid container item xs={12} justifyContent='center'>
            <Card sx={{ width: 260, border: (selected ? `solid 1px ${theme.palette.primary.light}` : '') }}>
                <CardContent>
                    <InfoAddress label='Logradouro' value={street} />
                    <InfoAddress label='Número' value={number} />
                    <InfoAddress label='Cidade' value={city} />
                    <InfoAddress label='Estado' value={state} />
                    <InfoAddress label='CEP' value={formatCEP(cep)} />
                    <InfoAddress label='Bairro' value={neighborhood} />

                    {(isInternalLoading || isLoading) ? (
                        <Box padding='5px' display='flex' justifyContent='center' width='100%'>
                            <CircularProgress variant='indeterminate' />
                        </Box>
                    ) : (
                        <>
                            {(!selected && !isLoading && infoShippingPac.deadline !== '' && infoShippingSedex.deadline !== '' && completeChange) && (
                                <FormControl sx={{ marginTop: 2 }}>
                                    <FormLabel id="demo-controlled-radio-buttons-group">Forma de envio</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group"
                                        value={selectedShippingMethod}
                                        onChange={(e) => handleChangeShippingMethod(e.target.value as TSaleShippingMethods)}
                                    >
                                        <FormControlLabel value="PAC" control={<Radio />} label={`PAC - ${formattedPrice(Number(infoShippingPac.price))} | ${showFormattedDataString(infoShippingPac.deadline, 'pt')}`} />
                                        <FormControlLabel value="SEDEX" control={<Radio />} label={`SEDEX - ${formattedPrice(Number(infoShippingSedex.price))} | ${showFormattedDataString(infoShippingSedex.deadline, 'pt')}`} />
                                    </RadioGroup>
                                </FormControl>
                            )}
                        </>
                    )}
                </CardContent>

                <CardActions>

                    {(completeChange) ? (
                        <Button
                            onClick={() => handleAddress(idSale, idAddress, selectedShippingMethod)}
                            variant={(selected ? 'contained' : 'outlined')}
                            size="small"
                            disabled={selected}
                        >
                            {(selected ? 'Selecionado' : 'Entregar aqui')}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleCalculateShipping}
                            variant={(selected ? 'contained' : 'outlined')}
                            size="small"
                            disabled={selected}
                        >
                            {(selected ? 'Selecionado' : 'Ver Frete')}
                        </Button>
                    )}

                </CardActions>
            </Card>
        </Grid >
    )
}