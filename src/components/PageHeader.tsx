import {FC} from 'react';
import {Box, Text, Container} from '@chakra-ui/react';

type HeadProps = {
  title?: string;

};

export const PageHeader: FC<HeadProps> = ({title}) => {

  return (
    <Container>
    <Box>
        <Text textAlign={'center'} fontWeight={'bold'} fontSize={'38'} fontFamily={ 'heading'} className={'page-title'}>
        {title}
        </Text>
        
    </Box>
    </Container>
  );
};
