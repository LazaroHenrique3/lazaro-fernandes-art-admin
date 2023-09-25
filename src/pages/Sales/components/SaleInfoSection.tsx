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
    setSaleStatus: (newStatus: TSaleStatus) => void,
    handleConcludeSale: (idSale: number) => void
}

export const SaleInfoSection: React.FC<ISaleInfoSection> = ({
    isLoading, 
    saleStatus, 
    saleAddress, 
    saleCustomer,
    idSale,
    idCustomer,
    formRef,
    setSaleStatus,
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
                        cep={saleAddress.cep}
                        city={saleAddress.city}
                        state={saleAddress.state}
                        neighborhood={saleAddress.neighborhood}
                        number={String(saleAddress.number)}
                        street={saleAddress.street}
                        complement={saleAddress.complement}
                    />

                    {(saleStatus === 'Em preparação' || saleStatus === 'Enviado') &&
                        <OrderSendOrConcludeCard
                            handleConcludeOrder={() => handleConcludeSale(Number(idSale))}
                            updateSendStatus={setSaleStatus}
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

