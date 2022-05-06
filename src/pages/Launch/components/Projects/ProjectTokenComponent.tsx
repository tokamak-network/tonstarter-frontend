import {FC} from 'react';
import {Flex, Text, useTheme, useColorMode} from '@chakra-ui/react';
// import ReactMarkdown from 'react-markdown'
import ReactQuill from 'react-quill';

import {shortenAddress} from 'utils';
import 'react-quill/dist/quill.bubble.css';

type ProjectTokenProps = {
  project: any;
};

export const ProjectTokenComponent: FC<ProjectTokenProps> = ({project}) => {
  const theme = useTheme();
  const {colorMode} = useColorMode();

  const modules = {
    toolbar: [
      [{header: [1, 2, 3, 4, 5, 6, false]}],
      ['bold', 'italic', 'underline', 'strike'],

      ['blockquote', 'code-block'],
      [{list: 'ordered'}, {list: 'bullet'}],
      [{indent: '-1'}, {indent: '+1'}, {align: []}],
      ['link', 'image', 'video'],
      ['clean'],
    ], // options here
  };

  const themeDesign = {
    border: {
      light: 'solid 1px #e6eaee',
      dark: 'solid 1px #373737',
    },
    font: {
      light: 'black.300',
      dark: 'gray.475',
    },
    tosFont: {
      light: 'gray.250',
      dark: 'black.100',
    },
    borderDashed: {
      light: 'dashed 1px #dfe4ee',
      dark: 'dashed 1px #535353',
    },
    buttonColorActive: {
      light: 'gray.225',
      dark: '#fff',
    },
    buttonColorInactive: {
      light: '#c9d1d8',
      dark: '#777777',
    },
  };

  return (
    <Flex
      p={'25px 35px 25px 35px'}
      flexDir={'column'}
      fontFamily={theme.fonts.fld}
      fontSize={'15px'}>
      <Flex flexDir={'row'} justifyContent={'space-between'} h={'450px'}>
        <Flex w={'498px'} flexDir={'column'}>
          <Flex
            p={'0px 20px'}
            borderBottom={themeDesign.border[colorMode]}
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
            borderBottom={themeDesign.border[colorMode]}
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
            borderBottom={themeDesign.border[colorMode]}
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
            borderBottom={themeDesign.border[colorMode]}
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
            borderBottom={themeDesign.border[colorMode]}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Project Main Image
            </Text>
            <Text>Image Link</Text>
          </Flex>
          <Flex
            p={'0px 20px'}
            alignItems={'center'}
            borderBottom={themeDesign.border[colorMode]}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Website
            </Text>
            <Text>www.tokamak.network</Text>
          </Flex>
          <Flex
            p={'0px 20px'}
            alignItems={'center'}
            borderBottom={themeDesign.border[colorMode]}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Medium
            </Text>
            <Text>medium.com/onther-tech</Text>
          </Flex>

          <Flex
            p={'0px 20px'}
            alignItems={'center'}
            borderBottom={themeDesign.border[colorMode]}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Twitter
            </Text>
            <Text>twitter.com/tokamak_network</Text>
          </Flex>
        </Flex>
        <Flex w={'498px'} flexDir={'column'}>
          <Flex
            p={'0px 20px'}
            borderBottom={themeDesign.border[colorMode]}
            h={'40px'}
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
            borderBottom={themeDesign.border[colorMode]}
            h={'58.5px'}
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
            borderBottom={themeDesign.border[colorMode]}
            h={'58.5px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Token Exchange Rate
            </Text>
            <Flex flexDir={'column'}>
              <Text>
                1 TON = {Number(project.projectTokenPrice)}
                {` ${project.tokenSymbol}`}
              </Text>
              <Text>
                1 TOS = {Number(project.tosPrice)}
                {` ${project.tokenSymbol}`}
              </Text>
            </Flex>
          </Flex>
          <Flex
            p={'0px 20px'}
            alignItems={'center'}
            borderBottom={themeDesign.border[colorMode]}
            h={'58.5px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Token Supply
            </Text>
            <Text>
              {project.totalSupply
                ? Number(project.totalSupply).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                  })
                : 'NA'}
            </Text>
          </Flex>
          <Flex
            p={'0px 20px'}
            borderBottom={themeDesign.border[colorMode]}
            h={'58.5px'}
            w={'100%'}
            justifyContent={'space-between'}
            alignItems={'center'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Token Symbol Image
            </Text>
            <Text>Image Link</Text>
          </Flex>
          <Flex
            p={'0px 20px'}
            borderBottom={themeDesign.border[colorMode]}
            h={'58.5px'}
            w={'100%'}
            justifyContent={'space-between'}
            alignItems={'center'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Telegram
            </Text>
            <Text>t.me/tokamak_network</Text>
          </Flex>
          <Flex
            p={'0px 20px'}
            borderBottom={themeDesign.border[colorMode]}
            h={'58.5px'}
            w={'100%'}
            justifyContent={'space-between'}
            alignItems={'center'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Discord
            </Text>
            <Text>discord.com/invite/...</Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex flexDir={'column'} mt={'50px'} justifyContent={'center'}>
        <Text
          textAlign={'center'}
          fontSize={'20px'}
          fontWeight={600}
          color={colorMode === 'light' ? '#353c48' : '#ffffff'}
          mb={'15px'}>
          Description
        </Text>
        <ReactQuill
          // placeholder="Input the project description"
          readOnly={true}
          modules={modules}
          value={project.description}
          theme={'bubble'}
          style={{color: 'white !important'}}
        />
      </Flex>
    </Flex>
  );
};
