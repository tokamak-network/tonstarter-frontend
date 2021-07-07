import {Container, Flex, SimpleGrid, Stack, Button} from '@chakra-ui/react';
import {Head} from 'components/SEO';
import {Fragment} from 'react';
import {TokenComponent} from './TokenComponent';
import {Animation} from './Animation';
import {IconTopArrow} from 'components/Icons/IconTopArrow';
import {useAppSelector} from 'hooks/useRedux';
import {selectStakes} from '../Staking/staking.reducer';

export const FLDstarter = () => {
  // @ts-ignore
  const {data} = useAppSelector(selectStakes);

  return (
    <Fragment>
      <Head title={'TON Starter'} />
      <Animation></Animation>
      <Stack>
        <Container maxW={'6xl'} py={12}>
          <SimpleGrid minChildWidth={350} gap={30}>
            {data.map((item, index) => (
              <TokenComponent data={item} key={index} />
            ))}
          </SimpleGrid>
        </Container>
        <Flex justifyContent={'flex-end'} pr={10}>
          <Button
            variant="unstyled"
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <IconTopArrow />
          </Button>
        </Flex>
      </Stack>
    </Fragment>
  );
};
