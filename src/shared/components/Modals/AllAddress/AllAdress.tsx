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
import { IListAddress } from '../../../services/api/address/AddressService'
import { AddressCard } from './components/AddressCard'
import Scrollbars from 'react-custom-scrollbars-2'
import { UseFetchAddressData } from './hooks/UseFetchAddressData'
import { UseHandleSaleAddress } from './hooks/UseHandleSaleAddress'
import { FormHandles } from '@unform/core'

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

interface IAllAddressesProps {
    formRef: React.RefObject<FormHandles>
    selectedAddress: number
    idSale: number
    idUser: number
    setSaleAddress: (address: IListAddress) => void
}

export const AllAddresses: React.FC<IAllAddressesProps> = ({ formRef, idUser, selectedAddress, idSale, setSaleAddress }) => {
    const theme = useTheme()

    const [isLoading, setIsLoading] = useState(false)
    const [cardLoading, setCardLoading] = useState(false)

    const [rows, setRows] = useState<IListAddress[]>([])
    const [totalCount, setTotalCount] = useState(0)

    const [search] = useState('')
    const [page, setPage] = useState(1)

    const [open, setOpen] = useState(false)
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    const handleNextPage = () => {
        setPage((prev) => prev + 1)
    }

    //Hooks personalizados
    const { handleUpdateSaleAddress, calculateShipping } = UseHandleSaleAddress({ formRef, idUser, setSaleAddress, handleClose, setCardLoading })
    UseFetchAddressData({ setIsLoading, setRows, setTotalCount, idUser, rows, search, page })
    
    return (
        <>
            <Button
                onClick={handleOpen}
                variant='contained'
                startIcon={<Icon>edit</Icon>}>
                Alterar Endereço
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, maxWidth: '600px' }}>
                    <Typography variant='h6' align='center'>
                        Endereços
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
                                {rows.map((row) => (
                                    <AddressCard
                                        calculateShipping={calculateShipping}
                                        handleAddress={handleUpdateSaleAddress}
                                        isLoading={cardLoading}
                                        key={row.id}
                                        idSale={idSale}
                                        idUser={idUser}
                                        idAddress={row.id}
                                        cep={row.cep}
                                        city={row.city}
                                        neighborhood={row.neighborhood}
                                        number={String(row.number)}
                                        state={row.state}
                                        street={row.street}
                                        selected={row.id === selectedAddress}
                                    />
                                ))}

                                {(totalCount > rows.length) && (
                                    <Box width='100%' display='flex' justifyContent='center' my={2}>
                                        <Button
                                            onClick={handleNextPage}
                                            variant='outlined'
                                            startIcon={<Icon>add</Icon>}>
                                            Carregar mais...
                                        </Button>
                                    </Box>
                                )}
                            </Grid>
                        </Scrollbars>
                    )}
                </Box>
            </Modal>
        </>
    )
}
