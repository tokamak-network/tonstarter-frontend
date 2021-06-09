import {Container, Flex, SimpleGrid, Stack, Button} from '@chakra-ui/react';
import {Head} from 'components/SEO';
import {Fragment} from 'react';
import {TokenComponent} from './TokenComponent';
import {Animation} from './Animation';
import {data} from 'make';
import {IconTopArrow} from 'components/Icons/IconTopArrow'
export const FLDstarter = () => {
  // const [selected, setSelected] = useState<string>('hi');

    // const select = (selectedItem: string) => {
    //   setSelected(selectedItem);
    // }
  
    return (
      <Fragment>
        <Head title={'FLD Starter'} />
        <Animation></Animation>
        <Stack  >
        <Container maxW={'6xl'} py={12}>
          <SimpleGrid minChildWidth={350} gap={30}>
            {data.map((item, index) => (
              <TokenComponent
                phase={item.name}
                subtitle={item.period}
                key={index}
              />
            ))}
            </SimpleGrid>
            </Container>
            <Flex justifyContent={'flex-end'} pr={10}>
              <Button variant="unstyled" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <IconTopArrow/>
            </Button>
            </Flex>
        </Stack>
      </Fragment>
    );
  };
  
