import {FC, useState} from 'react';
import {Flex, Box, Text, useColorMode, useTheme} from '@chakra-ui/react';
import HoverImage from 'components/HoverImage';
import arrowLeft from 'assets/svgs/arrow_left_normal_icon.svg';
import arrowLeftDark from 'assets/launch/arrow-left-normal-icon.svg';
import arrowHoverLeft from 'assets/launch/arrow-left-hover-icon.svg';
import arrowRight from 'assets/svgs/arrow_right_normal_icon.svg';
import arrowRightDark from 'assets/launch/arrow-right-normal-icon.svg';
import arrowHoverRight from 'assets/launch/arrow-right-hover-icon.svg';
import {motion} from 'framer-motion';

import {PublicPage} from './PublicPage';
import {LiquidityIncentive} from './LiquidityIncentive';
import {InitialLiquidity} from './InitialLiquidity';
import {TonStaker} from './TonStaker';
import {TosStaker} from './TosStaker';
import {WtonTosLpReward} from './WtonTosLpReward';
import {Custom} from './Custom';
import {DAO} from './DAO';
import {Vesting} from './Vesting';
import '../css/VaultComponent.css';

type VaultComponent = {
  project: any;
};

const TabComponent = (props: {project: any; vault: string; index: number; setVaultInfo:any}) => {
  const {project, vault, index,setVaultInfo} = props;
  
  switch (vault) {
    case 'Public':
      return (
        <PublicPage
          project={project}
          vault={project.vaults[index]}></PublicPage>
      );
    case 'Initial Liquidity':
      return (
        <InitialLiquidity
          project={project}
          vault={project.vaults[index]}></InitialLiquidity>
      );
    case 'TON Staker':
      return (
        <TonStaker project={project} vault={project.vaults[index]}></TonStaker>
      );
    case 'TOS Staker':
      return (
        <TosStaker project={project} vault={project.vaults[index]}></TosStaker>
      );
    case 'WTON-TOS LP Reward':
      return (
        <WtonTosLpReward
          project={project}
          vault={project.vaults[index]}></WtonTosLpReward>
      );
    case 'Liquidity Incentive':
      return (
        <LiquidityIncentive
          project={project}
          vault={project.vaults[index]}></LiquidityIncentive>
      );
    case 'DAO':
      return <DAO project={project} vault={project.vaults[index]}></DAO>;

    case 'Vesting':
      return (
        <Vesting project={project} vault={project.vaults[index]} setVaultInfo={setVaultInfo}></Vesting>
      );
    case 'C':
      return <Custom project={project} vault={project.vaults[index]}></Custom>;
    default:
      return <div>no component for this step</div>;
  }
};
export const VaultComponent: FC<VaultComponent> = ({project}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [transX, setTransX] = useState<number>(0);
  const [flowIndex, setFlowIndex] = useState<number>(6);
  const [currentVault, setCurrentVault] = useState<string>('Public');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const themeDesign = {
    border: {
      light: 'solid 2px #e7edf3',
      dark: 'solid 2px #535353',
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
      dark: 'gray.0',
    },
    buttonColorInactive: {
      light: '#c9d1d8',
      dark: '#777777',
    },
  };

  const setVaultInfo = (vault: any, idx: number) => {
    setCurrentVault(vault.vaultType);
    setCurrentIndex(idx);
  };

  return (
    <Flex flexDirection={'column'} mx={'35px'}>
      {/* <Tabs w={'100%'} onChange={(index) => setTabIndex(index)}>
        <TabList>
          {project.vaults.map((vault: any, index: number) => {
            return <Tab className="tab-block">{vault.name}</Tab>;
          })}
        </TabList>
        <TabPanels>
          {project.vaults.map((vault: any, index: number) => {
            return (
              <TabPanel px={'0px'}>
                <TabComponent
                  project={project}
                  vault={vault.vaultType}
                  index={index}
                />
              </TabPanel>
            );
          })}
        </TabPanels>
      </Tabs> */}
      <Flex justifyContent="space-between" alignItems={'center'} h={'75px'}>
        <HoverImage
          img={colorMode === 'light' ? arrowLeft : arrowLeftDark}
          hoverImg={arrowHoverLeft}
          additionalStyles={{height: '30px'}}
          action={() => {
            if (flowIndex - project.vaults.length >= 0 || flowIndex > 6) {
              setTransX(transX + 160);
              setFlowIndex(flowIndex - 1);
            }
          }}></HoverImage>
        <Flex w={'100%'} alignItems="center" overflow={'hidden'} mx={'20px'}>
          <motion.div
            animate={{x: transX}}
            style={{display: 'flex', width: '100%'}}>
            {project?.vaults?.map((vault: any, index: number) => {
              return (
                <Box
                  key={index}
                  minWidth={'160px'}
                  margin={'auto'}
                  pb={'10px'}
                  textAlign={'center'}
                  fontSize={'13px'}
                  fontFamily={theme.fonts.fld}
                  style={
                    currentIndex === index
                      ? {
                          borderBottom: '2px solid #2B71E4',
                          color: '#2B71E4',
                          cursor: 'pointer',
                        }
                      : {
                          cursor: 'pointer',
                          borderBottom: themeDesign.border[colorMode],
                        }
                  }
                  onClick={() => setVaultInfo(vault, index)}>
                  {vault.vaultName}
                </Box>
              );
            })}
          </motion.div>
        </Flex>
        <HoverImage
          img={colorMode === 'light' ? arrowRight : arrowRightDark}
          hoverImg={arrowHoverRight}
          additionalStyles={{height: '30px'}}
          action={() => {
            if (flowIndex < project.vaults.length) {
              setTransX(transX - 160);
              setFlowIndex(flowIndex + 1);
            }
            // setTransX(transX - 160);
            // setFlowIndex(flowIndex + 1);
          }}></HoverImage>
      </Flex>
      <TabComponent
        project={project}
        vault={currentVault}
        index={currentIndex}
        setVaultInfo={setVaultInfo}
      />
    </Flex>
  );
};
