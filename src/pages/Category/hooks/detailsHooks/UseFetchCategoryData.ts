import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormHandles } from '@unform/core'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { CategoryService } from '../../../../shared/services/api/category/CategoryService'

interface IUseFetchCategoryDataProps {
    setIsLoading: (status: boolean) => void
    setName: (name: string) => void
    formRef: React.RefObject<FormHandles>
    id: string
}

export const UseFetchCategoryData = ({setIsLoading, setName, formRef, id}: IUseFetchCategoryDataProps ) => {
    const navigate = useNavigate()

    useEffect(() => {

        const fetchData = async () => {
    
            if (id !== 'new') {
                setIsLoading(true)
                const result = await CategoryService.getById(Number(id))
    
                setIsLoading(false)
    
                if (result instanceof Error) {
                    toast.error(result.message)
                    navigate('/admin/category')
                    return
                }
    
                setName(result.name)
                formRef.current?.setData(result)
            } else {
                formRef.current?.setData({
                    name: ''
                })
            }
    
            return
        }
    
        fetchData()
    
    }, [id])

}



