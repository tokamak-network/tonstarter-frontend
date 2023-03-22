import {Flex, useColorMode, useTheme, Text, Button} from '@chakra-ui/react';
import {useEffect, useState, Dispatch, SetStateAction} from 'react';


const Initiate = () => {
    const {colorMode} = useColorMode();
    const theme = useTheme();
    return (
        <Flex
        mt="30px"
        h="600px"
        w="350px"
        flexDir={'column'}
        borderRadius={'15px'}
        alignItems="center"
        border={colorMode === 'dark' ? '1px solid #363636' : '1px solid #e6eaee'}>
            <Flex h='511px' flexDir={'column'} justifyContent='center' >
                <Text fontSize={'30px'} fontWeight='bold' color={colorMode === 'dark'?'white.100':'gray.250'} textAlign={'center'}>Initiate all vaults</Text>
                <Text mt='3px' color={colorMode === 'dark'?'gray.425':'gray.400'} fontSize={'16px'} textAlign={'center'}>(beside Initial Liquidity Vaullt)</Text>
            </Flex>
            <Flex
       
        w="100%"
        h="88px"
        justifyContent={'center'}
        alignItems="center"
        borderTop={
          colorMode === 'dark' ? '1px solid #363636' : '1px solid #e6eaee'
        }>
        <Button
          type="submit"
          w={'150px'}
          h={'38px'}
          bg={'blue.500'}
          fontSize={14}
          color={'white.100'}
          mr={'12px'}
          _hover={{}}
          borderRadius={4}>
          Deploy
        </Button>
      </Flex>
        </Flex>
    )
}

export default Initiate;