import {Box, Container, Flex, Link, Text, useTheme} from '@chakra-ui/react';
import {useColorMode} from '@chakra-ui/react';
import { useRouteMatch} from 'react-router-dom';
export const MobileFooter = () => {
    const {colorMode} = useColorMode();
    const theme = useTheme();
    const match = useRouteMatch('/');
    return (
        <Container  bg={match?.isExact? colorMode === 'light'? '#007aff' : '#222222' : 'transparent'}> 
<Flex  h='50px' alignItems={'center'} justifyContent='space-between' fontFamily={theme.fonts.openSans} color={match?.isExact? '#fff' : colorMode === 'light'? '#3e495c' : '#ffffff'}>
    <Text  fontSize='14px' fontWeight={800} >© 2022 Onther</Text>
    <Text fontSize='11px' fontWeight={'normal'}>E. hello@tokamak.network</Text>
</Flex>
        </Container>
    )
}