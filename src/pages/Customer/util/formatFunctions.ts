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