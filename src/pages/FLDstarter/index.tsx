import {Container, Box, Text, SimpleGrid, Center} from '@chakra-ui/react';
import {Head} from 'components/SEO';
import {Fragment} from 'react';
import {PageHeader} from 'components/PageHeader';
import {RoadmapItem} from './RoadmapItem';
import {TokenComponent} from './TokenComponent';
import {IconContainer} from './IconContainer';
import solution1 from 'assets/images/solution_img01.png';
import solution2 from 'assets/images/solution_img02.png';
import solution3 from 'assets/images/solution_img03.png';
// import {data} from 'make';

export const FLDstarter = () => {
  // const [selected, setSelected] = useState<string>('hi');

  // const select = (selectedItem: string) => {
  //   setSelected(selectedItem);
  // }

  return (
    <Fragment>
      <Head title={'FLD Starter'} />
      <Container maxW={'6xl'}>
        <Box>
          <PageHeader title={'FLD Starter'} />
          <Text
            my={{md: 5}}
            textAlign={'center'}
            fontFamily={'body'}
            fontSize={16}
            color={'gray.700'}>
            Decentralized Launchpad Platform
          </Text>
          {/* <Text textAlign={'center'} fontFamily={'body'} fontSize={16} color={'gray.700'}>Investors: Dual profit opportunities</Text>
           <Text textAlign={'center'}fontFamily={'body'} fontSize={16} color={'gray.700'}>Projects: Low cost to setup a launch process and wider expose to new investors</Text> */}
        </Box>
        <SimpleGrid minChildWidth={280} gap={6}>
          <IconContainer
            title={'Dual Profit'}
            src={solution1}
            subtitle={
              'Generated from the platform growth and individual projects'
            }
          />
          <IconContainer
            title={'Permissionless'}
            src={solution2}
            subtitle={'Fair Opportunity to participation and rewards'}
          />
          <IconContainer
            title={'Transparent'}
            src={solution3}
            subtitle={
              'FLD holders can participate in all platform decisions by staking FLD into sFLD(staked FLD)'
            }
          />
        </SimpleGrid>
        <Box borderWidth={1}>
          <Center my={5}>
            <Text my={0} fontSize={30}>
              Roadmap
            </Text>
          </Center>
          <SimpleGrid minChildWidth={230} gap={3}>
            <RoadmapItem phase={'Phase 1'} subtitle={'Launch FLD Mining'} />
            <RoadmapItem
              phase={'Phase 2'}
              subtitle={'FLD Starter(Project sale), Uniswap V3 migration'}
            />
            <RoadmapItem phase={'Phase 3'} subtitle={'FLD Governance'} />
            <RoadmapItem
              phase={'Phase 4'}
              subtitle={
                'Ethereum Layer2 migration: The platform will migrate into Tokamak layer 2 chain.'
              }
            />
          </SimpleGrid>
        </Box>

        <Box py={10}>
          <SimpleGrid minChildWidth={300} gap={3}>
            {/* {data.map((item, index) => (
              <TokenComponent
                phase={item.name}
                subtitle={item.period}
                key={index}
              />
            ))} */}
          </SimpleGrid>
        </Box>
        <Box></Box>
      </Container>
    </Fragment>
  );
};
