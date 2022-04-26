import {FC, useState} from 'react';
import {
  Flex,
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';

import {PublicPage} from './PublicPage';
import {LiquidityIncentive} from './LiquidityIncentive';
import {InitialLiquidity} from './InitialLiquidity';
import {TonStaker} from './TonStaker';
import {TosStaker} from './TosStaker';
import {WtonTosLpReward} from './WtonTosLpReward';
import {DAO} from './DAO';

import '../css/VaultComponent.css';

type VaultComponent = {};

export const VaultComponent: FC<VaultComponent> = ({}) => {
  const [tabIndex, setTabIndex] = useState(0);

  const themeDesign = {
    border: {
      light: 'solid 1px #e7edf3',
      dark: 'solid 1px #535353',
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

  return (
    <Flex p={'25px 35px 50px 35px'}>
      <Tabs w={'100%'} onChange={(index) => setTabIndex(index)}>
        <TabList>
          <Tab className="tab-block">Public</Tab>
          <Tab className="tab-block">Initial Liquidity</Tab>
          <Tab className="tab-block">Liquidity Incentive</Tab>
          <Tab className="tab-block">Ton Staker</Tab>
          <Tab className="tab-block">Tos Starter</Tab>
          <Tab className="tab-block">Wton-Tos LP Reward</Tab>
          <Tab className="tab-block">DAO</Tab>
        </TabList>
        {/* Chakra UI automatically maps the TabPanel tabIndex to the Tab. */}
        <TabPanels>
          <TabPanel px={'0px'}>
            <PublicPage />
          </TabPanel>
          <TabPanel px={'1rem'}>
            <InitialLiquidity />
          </TabPanel>
          <TabPanel px={'1rem'}>
            <LiquidityIncentive />
          </TabPanel>
          <TabPanel  px={'0px'}>
            <TonStaker />
          </TabPanel>
          <TabPanel px={'0px'}>
            <TosStaker />
          </TabPanel>
          <TabPanel>
            <WtonTosLpReward />
          </TabPanel>
          <TabPanel px={'1rem'}>
            <DAO />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
