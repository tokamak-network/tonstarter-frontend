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

import {MobilePublic} from './Vaults/MobilePublic';
import {MobileLiquidityIncentive} from './Vaults/MobileLiquidityIncentive';
import {MobileInitialLiquidity} from './Vaults/MobileInitialLiquidity';
import {MobileTonStaker} from './Vaults/MobileTonStaker';
import {MobileTosStaker} from './Vaults/MobileTosStaker';
import {MobileWtonTosLpReward} from './Vaults/MobileWtonTosLpReward';
import {MobileCustom} from './Vaults/MobileCustom';
import {MobileDao} from './Vaults/MobileDao';
import { MobileVesting } from './Vaults/MobileVesting';

type MobileVaultComponent = {
  project: any;
};

const TabComponent = (props: {project: any; vault: string; index: number;setVaultInfo:any}) => {
  const {project, vault, index,setVaultInfo} = props;
  switch (vault) {
    case 'Public':
      return (
        <MobilePublic
          project={project}
          vault={project.vaults[index]}></MobilePublic>
      );
    case 'Initial Liquidity':
      return (
        <MobileInitialLiquidity
          project={project}
          vault={project.vaults[index]}></MobileInitialLiquidity>
      );
    case 'TON Staker':
      return (
        <MobileTonStaker
          project={project}
          vault={project.vaults[index]}></MobileTonStaker>
      );
    case 'TOS Staker':
      return (
        <MobileTosStaker
          project={project}
          vault={project.vaults[index]}></MobileTosStaker>
      );
    case 'WTON-TOS LP Reward':
      return (
        <MobileWtonTosLpReward
          project={project}
          vault={project.vaults[index]}></MobileWtonTosLpReward>
      );
    case 'Liquidity Incentive':
      return (
        <MobileLiquidityIncentive
          project={project}
          vault={project.vaults[index]}></MobileLiquidityIncentive>
      );
    case 'DAO':
      return (
        <MobileDao project={project} vault={project.vaults[index]}></MobileDao>
      );
      case 'Vesting':
        return (
          <MobileVesting project={project} vault={project.vaults[index]} setVaultInfo={setVaultInfo}></MobileVesting>
        );
    case 'C':
      return (
        <MobileCustom
          project={project}
          vault={project.vaults[index]}></MobileCustom>
      );
    default:
      return <div>no component for this step</div>;
  }
};
export const MobileVaultComponent: FC<MobileVaultComponent> = ({project}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [transX, setTransX] = useState<number>(0);
  const [flowIndex, setFlowIndex] = useState<number>(3);
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
    <Flex flexDirection={'column'} mt={'20px'} mx={'-10px'}>
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
      <Flex justifyContent="space-between" alignItems={'center'}>
        <HoverImage
          img={colorMode === 'light' ? arrowLeft : arrowLeftDark}
          hoverImg={arrowHoverLeft}
          additionalStyles={{height: '30px'}}
          action={() => {
            if (flowIndex - project.vaults.length >= 0 || flowIndex > 3) {
              setTransX(transX + 104);
              setFlowIndex(flowIndex - 1);
            }
          }}></HoverImage>
        <Flex w={'312px'} alignItems="center" overflow={'hidden'} mx={'3px'}>
          <motion.div
            animate={{x: transX}}
            style={{display: 'flex', width: '100%'}}>
            {project?.vaults?.map((vault: any, index: number) => {
              return (
                <Box
                  display={'flex'}
                  justifyContent={'center'}
                  minWidth={'104px'}
                  margin={'auto'}
                  h={'45px'}
                  alignItems={'center'}
                  textAlign={'center'}
                  fontSize={'13px'}
                  lineHeight={'14px'}
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
                  <Text> {vault.vaultName}</Text>
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
              setTransX(transX - 104);
              setFlowIndex(flowIndex + 1);
            }
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
