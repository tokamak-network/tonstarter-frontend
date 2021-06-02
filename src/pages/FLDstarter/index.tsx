import {Container, Box, Text, SimpleGrid, Center} from '@chakra-ui/react';
import {Head} from 'components/SEO';
import {Fragment} from 'react';
import {PageHeader} from 'components/PageHeader';
import {RoadmapItem} from './RoadmapItem';
import {TokenComponent} from './TokenComponent';
import {IconContainer} from './IconContainer';
import {Animation} from './Animation';
import solution1 from 'assets/images/solution_img01.png';
import solution2 from 'assets/images/solution_img02.png';
import solution3 from 'assets/images/solution_img03.png';
import {data} from 'make';

export const FLDstarter = () => {
  // const [selected, setSelected] = useState<string>('hi');

    // const select = (selectedItem: string) => {
    //   setSelected(selectedItem);
    // }
  
    return (
      <Fragment>
        <Head title={'FLD Starter'} />
        <Animation></Animation>
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
        
          
          <Box>
      </Box>
        </Container>
      </Fragment>
    );
  };
  
