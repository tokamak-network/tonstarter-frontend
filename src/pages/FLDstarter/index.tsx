import {
    Container,
    Box,
    Text,
    Heading,
    Button,
    Grid,
    Flex,
    useDisclosure,
  } from '@chakra-ui/react';
  import {Head} from 'components/SEO';
  import {StakeOptionModal} from 'components/StakeOptionModal';
  import {Table} from 'components/Table';
  import {data} from 'make';
  import {FC, Fragment, useCallback, useMemo, useState} from 'react';
  import {shortenAddress} from 'utils';
  import {PageHeader} from 'components/PageHeader';
  import {DropDown} from 'components/DropDown';


  export const FLDstarter = () => {
    const [selected, setSelected] = useState<string>('hi');

    const select = (selectedItem: string) => {
      setSelected(selectedItem);
    }
  
    return (
      <Fragment>
        <Head title={'FLD Starter'} />
        <Container maxW={'6xl'}>
          <Box>
         <PageHeader title={'FLD Starter'}/>
           <Text my={{md:5}} textAlign={'center'} fontFamily={'body'} fontSize={16} color={'gray.700'}>Your Decentralized Launchpad Platform</Text>
           <Text textAlign={'center'} fontFamily={'body'} fontSize={16} color={'gray.700'}>Investors: Dual profit opportunities</Text>
           <Text textAlign={'center'}fontFamily={'body'} fontSize={16} color={'gray.700'}>Projects: Low cost to setup a launch process and wider expose to new investors</Text>
          </Box>
  
          <Box py={20}>
          <DropDown items={['Name', 'Period', 'APY', 'Total Staked', 'Earning per Block']}  hint={'Name'} select={select} />
          </Box>
          <Box>
        <Text>{selected}</Text>
      </Box>
        </Container>
     
      </Fragment>
    );
  };
  