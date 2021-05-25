import {FC} from 'react';
import {Flex, Text, Container} from '@chakra-ui/react';

type TokenComponentProps = {
  phase?: string;
  subtitle: string;
};

export const TokenComponent: FC<TokenComponentProps> = ({phase, subtitle}) => {
  return (
    <Container bg="gray.0">
    <Flex direction={'column'} alignItems={'center'} justifyContent={'center'}>
        <Text py={5} textAlign={'center'} fontWeight={'bold'} fontSize={'20'} fontFamily={ 'heading'} className={'page-title'}>
        {phase}
        </Text>
        <Text py={5} color="tomato">{subtitle}</Text>
    </Flex>
    </Container>
  );
};
