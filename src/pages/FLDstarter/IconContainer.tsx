import {FC} from 'react';
import {Flex, Box, Text, Container, Image} from '@chakra-ui/react';

type ContainerProps = {
  title?: string;
  src?: string;
  subtitle: string;
};

export const IconContainer: FC<ContainerProps> = ({title, src, subtitle}) => {

  return (
    <Container>
    <Flex direction={'column'} alignItems={'center'} justifyContent={'center'}>
        <Text py={5} textAlign={'center'} fontWeight={'bold'} fontSize={'20'} fontFamily={ 'heading'} className={'page-title'}>
        {title}
        </Text>
        <Image src={src}></Image>
        <Text py={5}>{subtitle}</Text>
    </Flex>
    </Container>
  );
};
