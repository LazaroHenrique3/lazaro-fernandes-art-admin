import { useEffect, useState, useMemo } from 'react'
import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { DimensionService } from '../../../../shared/services/api/dimension/DimensionService'
import { useDebounce } from '../../../../shared/hooks'
import { useField } from '@unform/core'

type TVAutoCompleteDimensionOption = {
    id: number
    label: string
}

interface VAutoCompleteDimensionProps {
    isExternalLoading: boolean
}

export const VAutoCompleteDimension: React.FC<VAutoCompleteDimensionProps> = ({ isExternalLoading = false }) => {
    const { fieldName, registerField, defaultValue, error, clearError } = useField('dimension_id')
    const { debounce } = useDebounce()

    const [selectedIds, setSelectedIds] = useState<number[]>(defaultValue || [])
    const [options, setOptions] = useState<TVAutoCompleteDimensionOption[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const [search, setSearch] = useState('')

    // Conectando de fato com o formulário
    useEffect(() => {
        registerField({
            name: fieldName,
            getValue: () => selectedIds,
            setValue: (_, newSelectedIds) => setSelectedIds(newSelectedIds),
        })
    }, [registerField, fieldName, selectedIds])

    useEffect(() => {
        setIsLoading(true)

        const fetchData = () => {
            debounce(async () => {
                const result = await DimensionService.getAll(1, search, selectedIds)
                setIsLoading(false)

                if (result instanceof Error) {
                    toast.error(result.message)
                    return
                }

                setOptions(result.data.map((dimension) => ({ id: dimension.id, label: dimension.dimension })))
            })
        }

        fetchData()

    }, [search])

    const handleOptionChange = (newValues: TVAutoCompleteDimensionOption[]) => {
        setSelectedIds(newValues.map((option) => option.id))
        setSearch('')
        clearError()
    }

    const autoCompleteSelectedOption = useMemo(() => {
        if (!selectedIds) return []

        const selectedOption = selectedIds.map((id) => options.find((option) => option.id === id))
        if (!selectedOption) return []

        return selectedOption as TVAutoCompleteDimensionOption[]
    }, [selectedIds, options])

    return (
        <Autocomplete
            openText="Abrir"
            closeText="Fechar"
            noOptionsText="Sem opções"
            loadingText="Carregando..."
            disablePortal
            multiple

            value={autoCompleteSelectedOption}
            inputValue={search}

            loading={isLoading}
            disabled={isExternalLoading}
            popupIcon={isExternalLoading || isLoading ? <CircularProgress size={28} /> : undefined}
            getOptionLabel={(option) => option?.label || ''}
            onInputChange={(e, newValue) => {
                if (e !== null) {
                    setSearch(newValue)
                }
            }}
            onChange={(_, newValues) => handleOptionChange(newValues as TVAutoCompleteDimensionOption[])}
            options={options}
            renderInput={(params) => (
                <TextField
                    {...params}

                    label="Dimensão"
                    error={!!error}
                    helperText={error}
                />
            )}
        />
    )
}