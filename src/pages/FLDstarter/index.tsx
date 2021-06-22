import {
  Container,
  Flex,
  SimpleGrid,
  Stack,
  Button,
  Spinner,
} from '@chakra-ui/react';
import {Head} from 'components/SEO';
import {Fragment} from 'react';
import {TokenComponent} from './TokenComponent';
import {Animation} from './Animation';
import {IconTopArrow} from 'components/Icons/IconTopArrow';
import {useAppSelector} from 'hooks/useRedux';
import {selectStakes} from '../Staking/staking.reducer';
export const FLDstarter = () => {
  // @ts-ignore
  const {data, loading} = useAppSelector(selectStakes);

  return (
    <Fragment>
      <Head title={'FLD Starter'} />
      <Animation></Animation>
      <Stack>
        {loading === 'pending' ? (
          <Flex height={'70vh'} justifyContent={'center'} alignItems={'center'}>
            <Spinner />
          </Flex>
        ) : (
          <>
            <Container maxW={'6xl'} py={12}>
              <SimpleGrid minChildWidth={350} gap={30}>
                {data.map((item: any, index: number) => (
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
          </>
        )}
      </Stack>
    </Fragment>
  );
};
