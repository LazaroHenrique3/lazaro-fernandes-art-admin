import { FormHandles } from '@unform/core'
import {
    Grid,
    Typography,
    Skeleton
} from '@mui/material'

import { TSaleStatus } from '../../../shared/services/api/sales/SaleService'
import { IListAddress } from '../../../shared/services/api/address/AddressService'
import { IListCustomer } from '../../../shared/services/api/customer/CustomerService'

import {
    CustomerInfoCard,
    DeliveryAddressCard,
    OrderSendOrConcludeCard,
} from './saleInfoComponents'

interface ISaleInfoSection {
    isLoading: boolean
    saleStatus: TSaleStatus,
    saleAddress: IListAddress,
    saleCustomer: IListCustomer,
    idSale: number,
    idCustomer: number,
    formRef: React.RefObject<FormHandles>
    trackingCode?: string,
    setSaleAddress: (address: IListAddress) => void
    setSaleStatus: (newStatus: TSaleStatus) => void,
    setTrackingCode: (trakingCode: string) => void
    handleConcludeSale: () => void
}

export const SaleInfoSection: React.FC<ISaleInfoSection> = ({
    isLoading,
    saleStatus,
    saleAddress,
    saleCustomer,
    idSale,
    idCustomer,
    formRef,
    trackingCode,
    setSaleAddress,
    setSaleStatus,
    setTrackingCode,
    handleConcludeSale
}) => {
    
    return (
        <Grid container padding={2} spacing={2}>
            <Grid container item xl={12}>
                <Typography variant='h6'>Informações do pedido</Typography>
            </Grid>

            {(isLoading || saleAddress.id === undefined) ? (
                <>
                    <Grid container item xs={12} sm={6} lg={4} xl={3}>
                        <Skeleton variant="rectangular" width={300} height={200} />
                    </Grid>

                    <Grid container item xs={12} sm={6} lg={4} xl={3}>
                        <Skeleton variant="rectangular" width={300} height={200} />
                    </Grid>

                    <Grid container item xs={12} sm={6} lg={4} xl={3}>
                        <Skeleton variant="rectangular" width={300} height={200} />
                    </Grid>
                </>
            ) : (
                <>
                    <CustomerInfoCard
                        name={saleCustomer.name}
                        email={saleCustomer.email}
                        phoneNumber={saleCustomer.cell_phone}
                        cpf={saleCustomer.cpf}
                    />

                    <DeliveryAddressCard
                        formRef={formRef}
                        statusSale={saleStatus}
                        idSale={idSale}
                        idUser={idCustomer}
                        idAddress={saleAddress.id}
                        cep={saleAddress.cep}
                        city={saleAddress.city}
                        state={saleAddress.state}
                        neighborhood={saleAddress.neighborhood}
                        number={String(saleAddress.number)}
                        street={saleAddress.street}
                        complement={saleAddress.complement}
                        setSaleAddress={setSaleAddress}
                    />

                    {(saleStatus === 'Em preparação' || saleStatus === 'Enviado') &&
                        <OrderSendOrConcludeCard
                            trackingCode={trackingCode}
                            handleConcludeOrder={() => handleConcludeSale()}
                            updateSendStatus={setSaleStatus}
                            setTrackingCode={setTrackingCode}
                            formRef={formRef}
                            saleStatus={saleStatus}
                            idSale={Number(idSale)}
                            idCustomerSale={Number(idCustomer)}
                        />
                    }
                </>
            )}

        </Grid>
    )
}

