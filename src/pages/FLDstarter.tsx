import { Box, Text, Flex, Image, SimpleGrid, Button } from '@chakra-ui/react';
import { HTMLAttributes } from 'react';
import TokamakLogo from 'assets/images/logo.png';

export interface HomeProps extends HTMLAttributes<HTMLDivElement> {
    classes?: string;
}
export const FLDstarter: React.FC<HomeProps> = props => {
    return (
        <Box colorscheme="blue">

            <Flex px={1} py={5} rounded={5} justify="center" align="center" direction="column">
                <Image src={TokamakLogo} w={16} alt="Tokamak Logo" />
                <Text color="blue.300" my={12} fontSize={30} fontFamily={"'Libre Baskerville', serif;"}>FLDstarter</Text>

            </Flex>
            <Box p={10}>
                <SimpleGrid minChildWidth={40} spacing={5}>
                    <Box bg="blue.300" height={20}></Box>
                    <Box bg="tomato" height={20} display="flex" alignItems="center" justifyContent="center">
                        <Button colorScheme="blue" outline="none" _focus={{outline:"none"}}>Stake</Button>
                    </Box>
                    <Box bg="tomato" height={20}></Box>
                    <Box bg="tomato" height={20}></Box>
                    <Box bg="tomato" height={20}></Box>
                    <Box bg="tomato" height={20}></Box>
                </SimpleGrid>
            </Box>
        </Box>
    );

}