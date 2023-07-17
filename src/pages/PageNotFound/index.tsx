import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button, Paper } from '@mui/material'

import travolta from '../../images/travolta.gif'

export const PageNotFound: React.FC = () => {
    const navigate = useNavigate()

    return (
        <Box width='100%' height='100vh' display='flex' alignItems='center' justifyContent='center'>
            <Box component={Paper} sx={{padding: 2, margin: 2}} display='flex' alignItems='center' justifyContent='center' flexWrap='wrap' gap={2}>

                <Box component="img"
                    sx={{
                        height: 233,
                        width: 350,
                        maxHeight: { xs: 233, md: 167 },
                        maxWidth: { xs: 350, md: 250 },
                    }}
                    src={travolta}
                />

                <Box width={300}>
                    <Typography variant='h5' fontWeight={800} textAlign='center'>
                        404 - Ops! Parece que você se perdeu no caminho.
                    </Typography>

                    <Typography  component='p' sx={{marginTop: 1}} textAlign='justify'>
                        Parece que você está mais perdido do que o próprio John Travolta em &apos;Pulp Fiction&apos;. 
                        Mas não se preocupe! Nossos dedicados estagiários estão empenhados em resolver o 
                        problema e ajudar você a encontrar o que procura. 
                    </Typography>

                    <Button variant='contained' sx={{marginTop: 1}} onClick={() => navigate(-1)}>
                        Voltar
                    </Button>
                </Box>

            </Box>
        </Box >
    )
}
