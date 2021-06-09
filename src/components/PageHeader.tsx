import {FC} from 'react';
import {Heading, Box, Text, Container} from '@chakra-ui/react';

type HeadProps = {
  title?: string;
  subtitle?: string;
};

export const PageHeader: FC<HeadProps> = ({title, subtitle}) => {
  return (
    <Container>
      <Box textAlign={'center'}>
        <Heading
          fontWeight={'bold'}
          fontSize={'38'}
          fontFamily={'heading'}
          className={'page-title'}>
          {title}
        </Heading>

        <Text>{subtitle}</Text>
      </Box>
    </Container>
  );
};
