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

  const name = 'Project Name';
  console.log('project', project);

  window.scrollTo(0, 0);
  window.onbeforeunload = function () {
    window.setTimeout(function () {
      window.location.href = '/opencampaign';
    }, 0);
    window.onbeforeunload = null; // necessary to prevent infinite loop, that kills your browser
  };
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
          flexDir={'row'}>
          <Text
            color={colorMode === 'light' ? '#304156' : '#ffffff'}
            fontSize={'20px'}
            fontWeight={'500'}>
            {project.projectName}
          </Text>
          <Flex h={'38px'}>
            <Button
              w={'120px'}
              justifyContent={'center'}
              alignItems={'center'}
              bg={'transparent'}
              border={'solid 1px #d7d9df'}
              borderRadius={'3px 0px 0px 3px'}
              fontSize={'12px'}
              isActive={!showVault}
              fontFamily={theme.fonts.roboto}
              _hover={{
                background: 'transparent',
                border: 'solid 1px #2a72e5',
                color: '#ffffff',
                cursor: 'pointer',
              }}
              _active={{
                background: '#2a72e5',
                border: 'solid 1px #2a72e5',
                color: '#ffffff',
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
              border={'solid 1px #d7d9df'}
              borderRadius={'0px 3px 3px 0px'}
              fontSize={'12px'}
              isActive={showVault}
              _hover={{
                background: 'transparent',
                border: 'solid 1px #2a72e5',
                color: '#ffffff',
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
