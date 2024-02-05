import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Icon,
    Modal,
    Typography,
    useTheme
} from '@mui/material'
import { useState } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import { ITrackOrderResponse } from '../../../services/api/shipping/ShippingService'
import { UseFetchTrackOrderData } from './hooks/UseFetchTrackOrderData'
import { TrackOrderCard } from './components/TrackOrderCard'

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

interface ITrackOrderProps {
    trackingCode: string
}

export const TrackOrder: React.FC<ITrackOrderProps> = ({ trackingCode }) => {
    const theme = useTheme()

    const [isLoading, setIsLoading] = useState(false)
    const [trackOrderData, setTrackOrderData] = useState<ITrackOrderResponse[]>([])

    const [open, setOpen] = useState(false)

    const handleOpen = () => {
        setOpen(true)
        fetchTrackOrderData(trackingCode)
    }
    const handleClose = () => {
        setOpen(false)
    }

    //Hooks personalizados
    const { fetchTrackOrderData } = UseFetchTrackOrderData({ setIsLoading, setTrackOrderData, handleClose })

    return (
        <>
            <Button
                fullWidth
                onClick={handleOpen}
                variant='contained'
                startIcon={<Icon>visibility</Icon>}>
                Acompanhar pedido
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, maxWidth: '600px' }}>
                    <Typography variant='h6' align='center'>
                        Rastrear Pedido
                    </Typography>

                    {(isLoading) ? (
                        <Box padding='5px' display='flex' justifyContent='center' width='100%'>
                            <CircularProgress variant='indeterminate' />
                        </Box>
                    ) : (
                        <Scrollbars
                            style={{ height: '250px' }}
                            renderThumbVertical={(props) => (
                                <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        backgroundColor: theme.palette.primary.main,
                                        borderRadius: '4px',
                                        width: '6px',
                                    }}
                                />
                            )}
                        >
                            <Grid container spacing={1} paddingX={5}>
                                {trackOrderData.map((data) => (
                                    <TrackOrderCard
                                        key={data.descricao}
                                        data={data.data}
                                        descricao={data.descricao}
                                        unidade={data.unidade}
                                        cidade={data.cidade}
                                        uf={data.uf}
                                    />
                                ))}
                            </Grid>
                        </Scrollbars>
                    )}
                </Box>
            </Modal>
        </>
    )
}
