import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormHandles } from '@unform/core'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AddressService } from '../../../../shared/services/api/address/AddressService' 

interface IUseFetchAddressDataProps {
    setIsLoading: (status: boolean) => void
    setName: (name: string) => void
    formRef: React.RefObject<FormHandles>
    id: string
    idCustomer: string
}

export const UseFetchAddressData = ({ setIsLoading, setName, formRef, id, idCustomer }: IUseFetchAddressDataProps) => {
    const navigate = useNavigate()

    useEffect(() => {

        const fetchData = async () => {        
            if (id !== 'new') {
                setIsLoading(true)
                const result = await AddressService.getById(Number(idCustomer), Number(id))

                setIsLoading(false)

                if (result instanceof Error) {
                    toast.error(result.message)
                    navigate('/customer/address')
                    return
                }

                setName(result.street)
                formRef.current?.setData(result)
            } else {
                formRef.current?.setData({
                    name: '',
                    city: '',
                    state: '',
                    number: '',
                    cep: '',
                    complement: '',
                    neighborhood: '',
                    street: ''
                })
            }

            return
        }

        fetchData()

    }, [id])

}



