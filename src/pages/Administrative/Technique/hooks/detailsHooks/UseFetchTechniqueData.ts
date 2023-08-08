import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormHandles } from '@unform/core'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { TechniqueService } from '../../../../../shared/services/api/technique/TechniqueService'

interface IUseFetchAdministratorDataProps {
    setIsLoading: (status: boolean) => void
    setName: (name: string) => void
    formRef: React.RefObject<FormHandles>
    id: string
}

export const UseFetchTechniqueData = ({setIsLoading, setName, formRef, id}: IUseFetchAdministratorDataProps ) => {
    const navigate = useNavigate()

    useEffect(() => {

        const fetchData = async () => {
    
            if (id !== 'new') {
                setIsLoading(true)
                const result = await TechniqueService.getById(Number(id))
    
                setIsLoading(false)
    
                if (result instanceof Error) {
                    toast.error(result.message)
                    navigate('/admin/technique')
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



