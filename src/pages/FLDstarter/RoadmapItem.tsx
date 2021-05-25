import {FC} from 'react';
import {Flex, Text, Container} from '@chakra-ui/react';

type RoadmapItemProps = {
  phase?: string;
  subtitle: string;
};

export const RoadmapItem: FC<RoadmapItemProps> = ({phase, subtitle}) => {

  return (
    <Container>
    <Flex direction={'column'} alignItems={'center'} justifyContent={'center'}>
        <Text py={5} textAlign={'center'} fontWeight={'bold'} fontSize={'20'} fontFamily={ 'heading'} className={'page-title'}>
        {phase}
        </Text>
        <Text py={5}>{subtitle}</Text>
    </Flex>
    </Container>
  );
};
