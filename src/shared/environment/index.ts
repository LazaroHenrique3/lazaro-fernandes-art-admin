export const Environment = {
    /**
    * Define a quantidade linhas a ser carregada por padrão nas listagens.
    */
    LINE_LIMIT: 5,
    /**
    * Placeholder exibido nos inputs de pesquisa.
    */
    SEARCH_INPUT: 'Pesquisar...',
    /**
    * Texto exibido quando nenhum registro é encontrado..
    */
    EMPTY_LISTING: 'Nenhum registro encontrado.',
    /**
    * Url base de consulta dos dados do projeto.
    */
    URL_BASE: 'http://localhost:3333'
}

type EnvironmentStatusColorsType = {
    [key: string]: string
}

//Padrão de cores para os status
export const EnvironmentStatusColors: EnvironmentStatusColorsType = {
    'Ativo': '#6B8E23',
    'Inativo': '#FF0000',
    'Vendido': '#FFA500',
    'Ag. Pagamento': '#FFA500',
    'Em preparação': '#87CEEB',
    'Enviado': '#D8BFD8',
    'Concluída': '#6B8E23',
    'Cancelada': '#FF0000'
}


