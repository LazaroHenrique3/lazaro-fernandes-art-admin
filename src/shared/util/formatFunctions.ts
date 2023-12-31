import dayjs from 'dayjs'

export const formatCPF = (cpf: string): string => {
    // Remove todos os caracteres não numéricos do CPF
    const numericCPF = cpf.replace(/\D/g, '')

    // Aplica a formatação do CPF (XXX.XXX.XXX-XX)
    const formattedCPF = numericCPF.replace(
        /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
        '$1.$2.$3-$4'
    )

    return formattedCPF
}

export const formatPhoneNumber = (phoneNumber: string): string => {
    // Remove todos os caracteres não numéricos do número de telefone
    const numericPhoneNumber = phoneNumber.replace(/\D/g, '')

    // Aplica a formatação do telefone (xx) xxxxx-xxxx
    const formattedPhoneNumber = numericPhoneNumber.replace(
        /^(\d{2})(\d{5})(\d{4})$/,
        '($1) $2-$3'
    )

    return formattedPhoneNumber
}

export const formatCEP = (cep: string): string => {
    // Remove todos os caracteres não numéricos do CEP
    const numericCEP = cep.replace(/\D/g, '')

    // Aplica a formatação do CEP xxxxx-xxx
    const formattedCEP = numericCEP.replace(/^(\d{5})(\d{3})$/, '$1-$2')

    return formattedCEP
}

export const formattedPrice = (value: number | string) => {

    if (typeof value === 'string') return ''

    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })
}

export const formattedDateBR = (date: string | Date): string => {
    return dayjs(date).format('DD/MM/YYYY')
}