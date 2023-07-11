import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { LinearProgress } from '@mui/material'


import { BasePageLayout } from '../../shared/layouts'
import { DetailTools } from '../../shared/components'
import { CategoryService } from '../../shared/services/api/category/CategoryService'

export const CategoryDetails: React.FC = () => {
    const { id = 'new' } = useParams<'id'>()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')

    useEffect(() => {

        const fetchData = async () => {

            if (id !== 'new') {
                setIsLoading(true)
                const result = await CategoryService.getById(Number(id))

                setIsLoading(false)
                if (result instanceof Error){
                    alert(result.message)
                    navigate('/category')
                }

                setName(result.name)
                console.log(result)
            }

            return
        }

        fetchData()

    }, [id])

    const handleSave = () => {
        console.log('Save')
    }

    const handleDelete = async (id: number, name: string) => {

        if (confirm(`Realmente deseja apagar "${name}"?`)) {
            const result = await CategoryService.deleteById(id)

            if (result instanceof Error) {
                alert(result.message)
                return
            }

            alert('Registro apagado com sucesso!')
            navigate('/category')
        }
    }

    return (
        <BasePageLayout
            title={(id === 'new') ? 'Nova categoria' : `Alterar '${name}'`}
            toolBar={
                <DetailTools
                    showSaveButton
                    newButtonText='Nova'
                    showNewButton={id !== 'new'}
                    showDeleteButton={id !== 'new'}

                    onClickSaveButton={handleSave}
                    onClickDeleteButton={() => handleDelete(Number(id), name)}
                    onClickBackButton={() => navigate('/category')}
                    onClickNewButton={() => navigate('/category/details/new')}
                />
            }>
            
            {isLoading && (
                <LinearProgress variant='indeterminate'/>
            )}

            <p>CategoryDetails {id}</p>
        </BasePageLayout>
    )
}