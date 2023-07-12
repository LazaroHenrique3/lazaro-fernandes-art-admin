import { TextField, TextFieldProps } from '@mui/material'
import { UseFormRegister } from 'react-hook-form/dist/types/form'
import { FieldErrors } from 'react-hook-form/dist/types'

import { IListCategory } from '../services/api/category/CategoryService'

type IVTextFieldProps = TextFieldProps & {
    name: 'name'
    errors: FieldErrors<Omit<IListCategory, 'id'>>
    register: UseFormRegister<Omit<IListCategory, 'id'>>
}

export const VTextField: React.FC<IVTextFieldProps> = ({ name, register, errors, ...rest }) => {

    return (
        <TextField
            error={!!errors.name}
            helperText={errors?.name?.message}
            {...rest}
            {...register(name as 'name')} />
    )

}