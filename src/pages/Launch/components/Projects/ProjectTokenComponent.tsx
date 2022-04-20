import {FC} from 'react';
import {Flex, Text, useTheme, useColorMode} from '@chakra-ui/react';

type ProjectTokenProps = {};

export const ProjectTokenComponent: FC<ProjectTokenProps> = ({}) => {
  const theme = useTheme();
  const {colorMode} = useColorMode();
  return (
    <Flex
      p={'25px 35px 25px 35px'}
      flexDir={'column'}
      fontFamily={theme.fonts.fld}
      fontSize={'15px'}>
      <Flex flexDir={'row'} justifyContent={'space-between'}>
        <Flex w={'498px'} h={'224px'} flexDir={'column'}>
          <Flex
            p={'0px 20px'}
            borderBottom={'1px solid #e6eaee'}
            h={'41px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Project Name
            </Text>
            <Text>Project Name</Text>
          </Flex>
          <Flex
            p={'0px 20px'}
            alignItems={'center'}
            borderBottom={'1px solid #e6eaee'}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Owner
            </Text>
            <Text>Project Name</Text>
          </Flex>
          <Flex
            p={'0px 20px'}
            alignItems={'center'}
            borderBottom={'1px solid #e6eaee'}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Token Name
            </Text>
            <Text>Project Name</Text>
          </Flex>
          <Flex
            p={'0px 20px'}
            alignItems={'center'}
            borderBottom={'1px solid #e6eaee'}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Token Symbol
            </Text>
            <Text>Project Name</Text>
          </Flex>
        </Flex>
        <Flex w={'498px'} h={'224px'} flexDir={'column'}>
          <Flex
            p={'0px 20px'}
            borderBottom={'1px solid #e6eaee'}
            h={'41px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Token Supply
            </Text>
            <Text>Project Name</Text>
          </Flex>
          <Flex
            p={'0px 20px'}
            alignItems={'center'}
            borderBottom={'1px solid #e6eaee'}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Token Exchange Rate
            </Text>
            <Text>Project Name</Text>
          </Flex>
          <Flex
            p={'0px 20px'}
            alignItems={'center'}
            borderBottom={'1px solid #e6eaee'}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Sale Price
            </Text>
            <Text>Project Name</Text>
          </Flex>
          <Flex
            p={'0px 20px'}
            alignItems={'center'}
            borderBottom={'1px solid #e6eaee'}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Current Price
            </Text>
            <Text>Project Name</Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex flexDir={'column'} mt={'50px'} justifyContent={'center'} >
        <Text textAlign={'center'} fontSize={'17px'} fontWeight={600} color={colorMode === 'light' ? '#353c48': '#ffffff'} mb={'25px'}>Description</Text>
        <Text color={colorMode==='light' ? '#808992' : '#9d9ea5'}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum
        </Text>
      </Flex>
    </Flex>
  );
};
