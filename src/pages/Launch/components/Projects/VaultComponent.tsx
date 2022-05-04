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

type VaultComponent = {
  project: any;
};

const TabComponent = (props: {project: any; vault: string; index: number}) => {
  const {project, vault, index} = props;

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
    default:
      return <div>no component for this step</div>;
  }
};
export const VaultComponent: FC<VaultComponent> = ({project}) => {
  const [tabIndex, setTabIndex] = useState(0);

  // console.log('project: ', project);

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
          {project.vaults.map((vault: any, index: number) => {
            return <Tab className="tab-block">{vault.vaultType}</Tab>;
          })}
        </TabList>
        {/* Chakra UI automatically maps the TabPanel tabIndex to the Tab. */}
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
      </Tabs>
    </Flex>
  );
};
