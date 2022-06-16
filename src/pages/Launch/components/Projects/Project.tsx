import {FC, useEffect, useState} from 'react';
import {
  Heading,
  Flex,
  Text,
  Button,
  Container,
  useTheme,
  useColorMode,
} from '@chakra-ui/react';
import {VaultComponent} from './VaultComponent';
import {ProjectTokenComponent} from './ProjectTokenComponent';
import {ProjectCardType} from '../../types/index';
import {useHistory} from 'react-router-dom';

type ProjectProps = {
  project: any;
};

export const Project: FC<ProjectProps> = ({project}) => {
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const [showVault, setShowVault] = useState<boolean>(false);

  const themeDesign = {
    border: {
      light: 'solid 1px #d7d9df',
      dark: 'solid 1px #373737',
    },
    font: {
      light: 'black.300',
      dark: 'gray.475',
    },
  };

  const name = 'Project Name';

  // window.scrollTo(0, 0);
  // window.onbeforeunload = function () {
  //   window.setTimeout(function () {
  //     window.location.href = '/launch';
  //   }, 0);
  //   window.onbeforeunload = null; // necessary to prevent infinite loop, that kills your browser
  // };
  return (
    <Flex
      w={'1100px'}
      bg={colorMode === 'light' ? '#ffffff' : 'transparent'}
      boxShadow={
        colorMode === 'light' ? '0 1px 1px 0 rgba(96, 97, 112, 0.16)' : 'none'
      }
      pb={'50px'}
      flexDir={'column'}
      borderRadius={'10px'}
      border={colorMode === 'light' ? 'none' : 'solid 1px #373737'}>
      <Flex
        borderBottom={
          colorMode === 'light' ? 'solid 1px #f4f6f8' : 'solid 1px #373737'
        }>
        <Flex
          w={'1100px'}
          padding={'26px 25px 17px 35px'}
          justifyContent={'space-between'}
          alignItems={'center'}
          flexDir={'row'}>
          <Text
            color={colorMode === 'light' ? '#304156' : '#ffffff'}
            fontSize={'20px'}
            fontFamily={theme.fonts.roboto}
            fontWeight={'bold'}>
            {project?.projectName}
          </Text>
          <Flex h={'38px'}>
            <Button
              w={'120px'}
              justifyContent={'center'}
              alignItems={'center'}
              bg={'transparent'}
              color={colorMode === 'dark' ? '#fff' : '#3d495d'}
              border={themeDesign.border[colorMode]}
              borderRight={'none'}
              borderRadius={'3px 0px 0px 3px'}
              fontSize={'14px'}
              isActive={!showVault}
              fontFamily={theme.fonts.fld}
              _hover={{
                background: 'transparent',
                border: 'solid 1px #2a72e5',
                color: themeDesign.font[colorMode],
                cursor: 'pointer',
              }}
              _active={{
                background: '#2a72e5',
                border: 'solid 1px #2a72e5',
                color: '#fff',
              }}
              onClick={() => {
                setShowVault(false);
              }}>
              Project {'&'} Token
            </Button>
            <Button
              justifyContent={'center'}
              alignItems={'center'}
              w={'120px'}
              bg={'transparent'}
              color={colorMode === 'dark' ? '#fff' : '#3d495d'}
              border={themeDesign.border[colorMode]}
              borderRadius={'0px 3px 3px 0px'}
              fontSize={'14px'}
              isActive={showVault}
              fontFamily={theme.fonts.fld}
              _hover={{
                background: 'transparent',
                border: 'solid 1px #2a72e5',
                color: themeDesign.font[colorMode],
                cursor: 'pointer',
              }}
              _active={{
                background: '#2a72e5',
                border: 'solid 1px #2a72e5',
                color: '#ffffff',
              }}
              onClick={() => {
                setShowVault(true);
              }}>
              Vault
            </Button>
          </Flex>
        </Flex>
      </Flex>
      {showVault ? (
        <VaultComponent project={project} />
      ) : (
        <ProjectTokenComponent project={project} />
      )}
    </Flex>
  );
};
