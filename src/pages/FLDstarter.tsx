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
  
  
  
  export const FLDstarter = () => {
    
  
    return (
      <Fragment>
        <Head title={'Staking'} />
        <Container maxW={'8xl'}>
          <Box border="1px" borderColor="gray.200" py={{base: 1, md: 5}}>
            <Text  textAlign={'center'} fontWeight={'bold'} fontSize={'xl'}>
            FLD Starter
            </Text>
           <Text my={{md:5}} textAlign={'center'}>Decentralized Launchpad Platform</Text>
           <Text textAlign={'center'}>Investors: Dual profit opportunities</Text>
           <Text textAlign={'center'}>Projects: Low cost to setup a launch process and wider expose to new investors</Text>
          </Box>
  
          <Box py={20}>
          
          </Box>
        </Container>
      
      </Fragment>
    );
  };
  