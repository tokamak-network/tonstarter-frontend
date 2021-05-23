import {FC} from 'react';
import {Box, Text} from '@chakra-ui/react';

type HeadProps = {
  title?: string;

};

export const PageHeader: FC<HeadProps> = ({title}) => {
 
  return (
    <Box>
        <Text textAlign={'center'} fontWeight={'bold'} fontSize={'38'} color={'gray.800'} fontFamily={'body'}>
        {title}
        </Text>
        
    </Box>
  );
};
