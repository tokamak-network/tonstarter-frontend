import {Grid, Flex, Text, GridItem} from '@chakra-ui/react';
import React from 'react';

export const StepNames = () => {

  return (
    <Flex>
      <Grid
        mb={2}
        fontSize={'12px'}
        templateColumns="repeat(8, 1fr)"
        textAlign={'center'}
        as="b">
        <GridItem w={'60px'} mr={'39px'}>
          <Flex>
            <Text mr={'3px'} color={'#FF3B3B'}>
              *
            </Text>
            Snapshot
          </Flex>
        </GridItem>
        <GridItem w={'48px'} mr={'50px'}>
          Whitelist
        </GridItem>
        <GridItem w={'78px'} mr={'36px'}>
          <Flex>
            <Text mr={'3px'} color={'#FF3B3B'}>
              *
            </Text>
            Public Sale 1
          </Flex>
        </GridItem>
        <GridItem w={'78px'} mr={'43px'}>
          <Flex>
            <Text mr={'3px'} color={'#FF3B3B'}>
              *</Text>Public Sale 2</Flex>
        </GridItem>
        {/* Line breaks from 'Unlock' if w={'46px'} */}
        <GridItem w={'48px'} mr={'78px'}>
          Unlock 1
        </GridItem>
        <GridItem w={'10px'} mr={'75px'}>
          ...
        </GridItem>
        <GridItem w={'54px'}>
          Unlock 49
        </GridItem>
      </Grid>
    </Flex>
  );
};
