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
import {MobileVaultComponent} from './MobileVaultComponent';
import {MobileProjectToken} from './MobileProjectToken';

type MobileProjectProps = {
  project: any;
};

export const MobileProject: FC<MobileProjectProps> = ({project}) => {
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
    <Flex bg={'transparent'} w={'100%'} flexDir={'column'}>
        <Flex 
        w={'100%'}
          justifyContent={'center'}
          alignItems={'center'}
          flexDir={'row'}>
          <Flex h={'33px'}>
            <Button
              w={'130px'}
              justifyContent={'center'}
              alignItems={'center'}
              bg={'transparent'}
              color={colorMode === 'dark' ? '#fff' : '#3d495d'}
              border={themeDesign.border[colorMode]}
              borderRight={'none'}
              borderRadius={'3px 0px 0px 3px'}
              fontSize={'14px'}
              h={'33px'}
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
              w={'130px'}
              h={'33px'}
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
              Vaults
            </Button>
          </Flex>
        </Flex>
     
      {showVault ? (
        <MobileVaultComponent project={project} />
      ) : (
        <MobileProjectToken project={project} />
      )}
    </Flex>
  );
};
