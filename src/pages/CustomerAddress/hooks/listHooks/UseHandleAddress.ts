import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AddressService, IListAddress } from '../../../../shared/services/api/address/AddressService'

interface IUseHandleAddressProps {
    setRows: (addresss: IListAddress[]) => void
    rows:  IListAddress[]
    search: string
    idCustomer: string
}

export const UseHandleAddress = ({ setRows, rows, idCustomer }: IUseHandleAddressProps) => {

    const handleDelete = async (id: number) => {

        if (confirm('Realmente deseja apagar esse endereço?')) {
            const result = await AddressService.deleteById(Number(idCustomer), id)

            if (result instanceof Error) {
                toast.error(result.message)
                return
            }

            const newRows = rows.filter(row => row.id !== id)

            setRows(newRows)
            toast.success('Registro apagado com sucesso!')
        }
    }

    return { handleDelete }
}

