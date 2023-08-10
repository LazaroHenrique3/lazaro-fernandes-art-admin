import { useEffect, useMemo, useState } from 'react'
import { Autocomplete, CircularProgress, TextField } from '@mui/material'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { TechniqueService } from '../../../shared/services/api/technique/TechniqueService'
import { useDebounce } from '../../../shared/hooks'
import { useField } from '@unform/core'

type TVAutoCompleteTechniqueOption = {
    id: number
    label: string
}

interface VAutoCompleteTechniqueProps {
    isExternalLoading: boolean
}

export const VAutoCompleteTechnique: React.FC<VAutoCompleteTechniqueProps> = ({isExternalLoading = false}) => {
    const { fieldName, registerField, defaultValue, error, clearError} = useField('technique_id')

    const { debounce } = useDebounce()

    const [selectedId, setSelectedId] = useState<number | undefined>(defaultValue)

    const [options, setOptions] = useState<TVAutoCompleteTechniqueOption[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState('')

    //Conectando de fato com o formulário
    useEffect(() => {
        registerField({
            name: fieldName, 
            getValue: () => selectedId,
            setValue: (_, newSelectedId) => setSelectedId(newSelectedId)
        })
    }, [registerField, fieldName, selectedId])

    useEffect(() => {
        setIsLoading(true)

        const fetchData = () => {
            debounce(async () => {
                const result = await TechniqueService.getAll(1, search, selectedId)
                setIsLoading(false)

                if (result instanceof Error) {
                    toast.error(result.message)
                    return
                }

                setOptions(result.data.map(technique => ({id: technique.id, label: technique.name})))
            })
        }

        fetchData()

    }, [search])

    const autoCompleteSelectedOption = useMemo(() => {
        if (!selectedId) return null

        const selectedOption = options.find(option => option.id === selectedId)
        if (!selectedOption) return null

        return selectedOption
    }, [selectedId, options])

    return (
        <Autocomplete
            openText='Abrir'
            closeText='Fechar'
            noOptionsText='Sem opções'
            loadingText='Carregando...'

            disablePortal

            value={autoCompleteSelectedOption}
            loading={isLoading}
            disabled={isExternalLoading}
            popupIcon={(isExternalLoading || isLoading) ? <CircularProgress size={28}/> : undefined}
            onInputChange={(_, newValue) => setSearch(newValue)}
            onChange={(_, newValue) => { setSelectedId(newValue?.id); setSearch(''); clearError() }}
            options={options}
            renderInput={(params) => (
                <TextField
                    {...params}

                    label='Técnica'
                    error={!!error}
                    helperText={error}
                />
            )}
        />
    )
}