import { ListTools } from '../../shared/components'
import { BasePageLayout } from '../../shared/layouts'

export const Dashboard = () => {

    return (
        <BasePageLayout title='Página inicial' toolBar={(<ListTools showSearchInput/>)}>
            Testando...
        </BasePageLayout>
    )
}