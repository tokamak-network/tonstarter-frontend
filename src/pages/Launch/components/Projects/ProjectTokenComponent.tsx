import {FC} from 'react';
import {Flex, Text, useTheme, useColorMode} from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown'
import ReactQuill from 'react-quill';
import {shortenAddress} from 'utils';

type ProjectTokenProps = {
  project: any
};

export const ProjectTokenComponent: FC<ProjectTokenProps> = ({project}) => {
  const theme = useTheme();
  const {colorMode} = useColorMode();
  console.log(project);
  
  return (
    <Flex
      p={'25px 35px 25px 35px'}
      flexDir={'column'}
      fontFamily={theme.fonts.fld}
      fontSize={'15px'}>
      <Flex flexDir={'row'} justifyContent={'space-between'}>
        <Flex w={'498px'} h={'491px'} flexDir={'column'}>
          <Flex
            p={'0px 20px'}
            borderBottom={'1px solid #e6eaee'}
            h={'41px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Project Name
            </Text>
            <Text>{project.projectName}</Text>
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
            <Text>{shortenAddress(project.owner)}</Text>
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
         
        
          <Flex
            p={'0px 20px'}
            alignItems={'center'}
            borderBottom={'1px solid #e6eaee'}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
            Twitter
            </Text>
            <Text>Project Name</Text>
          </Flex>
        </Flex>
        <Flex w={'498px'} h={'491px'} flexDir={'column'}>
          <Flex
            p={'0px 20px'}
            borderBottom={'1px solid #e6eaee'}
            h={'41px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Token Name
            </Text>
            <Text>{project.tokenName}</Text>
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
            <Text>{project.tokenSymbol}</Text>
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
            <Flex flexDir={'column'}>
            <Text>1 TON = {Number(project.projectTokenPrice)}{` ${project.tokenSymbol}`}</Text>
            <Text>1 TOS = {Number(project.tosPrice)}{` ${project.tokenSymbol}`}</Text>
            </Flex>
          </Flex>
          <Flex
            p={'0px 20px'}
            alignItems={'center'}
            borderBottom={'1px solid #e6eaee'}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Token Supply
            </Text>
            <Text>{project.totalSupply? Number(project.totalSupply).toLocaleString(undefined, {
        minimumFractionDigits: 0,
      }): 'NA'}</Text>
          </Flex>
         
        </Flex>
      </Flex>
      <Flex flexDir={'column'} mt={'50px'} justifyContent={'center'}>
        <Text
          textAlign={'center'}
          fontSize={'17px'}
          fontWeight={600}
          color={colorMode === 'light' ? '#353c48' : '#ffffff'}
          mb={'25px'}>
          Description
        </Text>
        <ReactQuill
     
        // placeholder="Input the project description"
        readOnly={true}
        value={project.description}
        theme={"bubble"}></ReactQuill>
       
      </Flex>
    </Flex>
  );
};
