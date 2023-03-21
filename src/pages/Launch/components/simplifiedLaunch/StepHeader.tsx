import {Flex, useColorMode, Text, useTheme, Image} from '@chakra-ui/react';
import iconUserGuide from 'assets/images/iconUserGuide.png';
const StepHeader = (props: {deploySteps: boolean; deployStep?: number, title:string}) => {
  const {deploySteps, deployStep,title} = props;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  return (
    <Flex
      h="73px"
      w="100%"
      borderBottom={'1px'}
      pt="24px"
      pb="23px"
      px="35px"
      justifyContent="space-between"
      borderColor={colorMode === 'dark' ? '#373737' : '#f4f6f8'}>
      <Flex alignItems={'center'}>
        <Text
          lineHeight={'20px'}
          fontSize={'20px'}
          color={colorMode === 'dark' ? 'white.100' : 'black.300'}>
          {title}
        </Text>
        <Image ml="21px" src={iconUserGuide} w="18px" h="18px"></Image>
        <Text
          ml="6px"
          fontSize={'13px'}
          color={colorMode === 'dark' ? 'gray.475' : 'gray.400'}>
          User Guide
        </Text>
      </Flex>
      {deploySteps && deployStep ? (
        <Flex color='blue.200' fontSize={'13px'}>
          <Text color={'white.100'} mr='2px'>Progress</Text>
          <Text>{deployStep}/10</Text>
        </Flex>
      ) : (
        <></>
      )}
    </Flex>
  );
};

export default StepHeader;
