import { Box } from '@chakra-ui/layout';
import { FC, HTMLAttributes } from 'react';
export interface HomeProps extends HTMLAttributes<HTMLDivElement> {
    classes?: string;
}
export const Home: React.FC<HomeProps> = props => {
    return (
        <Box>
            Home
        </Box>
    );

}