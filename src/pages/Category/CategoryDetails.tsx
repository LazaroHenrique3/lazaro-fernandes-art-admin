import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button, LinearProgress } from '@mui/material'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { BasePageLayout } from '../../shared/layouts'
import { DetailTools } from '../../shared/components'
import { CategoryService, IListCategory } from '../../shared/services/api/category/CategoryService'
import { VTextField } from '../../shared/form'

//Definindo o schema para validação
const categorySchema = yup.object().shape({
    name: yup.string().transform(value => (value ? value.trim() : '')).required().min(3).max(100)
})

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
                if (result instanceof Error) {
                    alert(result.message)
                    navigate('/category')
                }

                setName(result.name)
            }

            return
        }

        fetchData()

    }, [id])

    const handleSave = (data: Omit<IListCategory, 'id'>) => {
        console.log('Save')
        console.log(data)
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

    //Colocando o Hook form em ação
    const {
        register,
        setValue,
        reset,
        handleSubmit: onSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: { name },
        resolver: yupResolver(categorySchema)
    })


    return (
        <BasePageLayout
            title={(id === 'new') ? 'Nova categoria' : `Alterar '${name}'`}
            toolBar={
                <DetailTools
                    showSaveButton
                    newButtonText='Nova'
                    showNewButton={id !== 'new'}
                    showDeleteButton={id !== 'new'}

                    //onClickSaveButton={handleSave}
                    onClickDeleteButton={() => handleDelete(Number(id), name)}
                    onClickBackButton={() => navigate('/category')}
                    onClickNewButton={() => navigate('/category/details/new')}
                />
            }>

            {isLoading && (
                <LinearProgress variant='indeterminate' />
            )}

            <p>CategoryDetails {id}</p>

            <form onSubmit={onSubmit(handleSave)}>
                <VTextField name='name' label='Nome' type='string' size='small' errors={errors} register={register}/>

                <Button type='submit'>Submit</Button>
            </form>

        </BasePageLayout>
    )
}