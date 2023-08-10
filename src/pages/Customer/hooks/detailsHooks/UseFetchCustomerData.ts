import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormHandles } from '@unform/core'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { CustomerService } from '../../../../shared/services/api/customer/CustomerService'

interface IUseFetchCustomerDataProps {
    setIsLoading: (status: boolean) => void
    setName: (name: string) => void
    setImage: (image: string) => void
    formRef: React.RefObject<FormHandles>
    id: string
}

export const UseFetchCustomerData = ({setIsLoading, setName, setImage, formRef, id}: IUseFetchCustomerDataProps) => {
    const navigate = useNavigate()

    useEffect(() => {

        const fetchData = async () => {

            setIsLoading(true)
            const result = await CustomerService.getById(Number(id))

            setIsLoading(false)

            if (result instanceof Error) {
                toast.error(result.message)
                navigate('/admin/customer')
                return
            }

            setName(result.name)
            setImage(result.image)
            formRef.current?.setData(result)
        }

        fetchData()

    }, [id])
}