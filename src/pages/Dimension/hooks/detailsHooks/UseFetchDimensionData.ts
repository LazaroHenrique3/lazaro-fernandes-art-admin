import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormHandles } from '@unform/core'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { DimensionService } from '../../../../shared/services/api/dimension/DimensionService'

interface IUseFetchDimensionDataProps {
    setIsLoading: (status: boolean) => void
    setDimension: (name: string) => void
    formRef: React.RefObject<FormHandles>
    id: string
}

export const UseFetchDimensionData = ({ setIsLoading, setDimension, formRef, id }: IUseFetchDimensionDataProps) => {
    const navigate = useNavigate()

    useEffect(() => {

        const fetchData = async () => {

            if (id !== 'new') {
                setIsLoading(true)
                const result = await DimensionService.getById(Number(id))

                setIsLoading(false)

                if (result instanceof Error) {
                    toast.error(result.message)
                    navigate('/admin/dimension')
                    return
                }

                setDimension(result.dimension)

                //Pegando cada uma das propriedades separadamente
                const dimension = result.dimension.split('x').map(part => part.trim())

                formRef.current?.setData({
                    width: Number(dimension[0]),
                    height: Number(dimension[1]),
                    thickness: Number(dimension[2])
                })
            } else {
                formRef.current?.setData({
                    width: '',
                    height: '',
                    thickness: ''
                })
            }

            return
        }

        fetchData()

    }, [id])

}



