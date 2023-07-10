import { useSearchParams } from 'react-router-dom'
import { useEffect, useMemo } from 'react'

import { ListTools } from '../../shared/components'
import { BasePageLayout } from '../../shared/layouts'
import { CategoryService } from '../../shared/services/api/category/CategoryService'
import { useDebounce } from '../../shared/hooks'

export const CategoryList: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const { debounce } = useDebounce()

    //Fazer a pesquisa do input de pesquisa através da URL
    //Toda vez que for digitado um texto será mudado o searchParams da Url
    //Logo o valor vai ser modificado, o que por sua vez executa o useMemo
    //E por fim esse valor será armazenado em 'search'

    const search = useMemo(() => {
        //Pega o parâmetro na URL
        return searchParams.get('search') || ''
    }, [searchParams])

    useEffect(() => {

        const fetchData = () => {
            debounce(async () => {
                const result = await CategoryService.getAll(1, search)

                if (result instanceof Error) {
                    alert(result.message)
                    return
                }

                console.log(result)
            })
        }

        fetchData()

    }, [search])

    return (
        <BasePageLayout
            title="Listagem de categorias"
            toolBar={
                <ListTools
                    showSearchInput
                    newButtonText='Nova'
                    searchText={search}
                    onChangeSearchText={text => setSearchParams({ search: text }, { replace: true })}
                />
            }>

        </BasePageLayout>
    )
}