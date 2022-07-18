import {FC, useState} from 'react';
import {
  Flex,
  Box,
  Text,
  useColorMode,
  useTheme,
  Grid,
  GridItem,
  Link,
  Tooltip,
  Image,
} from '@chakra-ui/react';
import {shortenAddress} from 'utils';
import {BASE_PROVIDER} from 'constants/index';
import momentTZ from 'moment-timezone';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';
import moment from 'moment';
import {MobileVaultTable} from './MobileVaultTable'
type PublicPage = {
  vault: any;
  project: any;
};

type TokenCompProps = {
  vault: any;
  project: any;
};
export const MobilePublic: FC<PublicPage> = ({vault, project}) => {
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const [buttonState, setButtonState] = useState('Token');

  return (
    <Flex mt={'35px'} flexDir={'column'} px={'20px'}>
      <Flex
        mx={'auto'}
        mb={'20px'}
        fontFamily={theme.fonts.fld}
        fontSize="13px"
        alignItems={'center'}>
        <Text
          px={'12px'}
          _active={{color: colorMode === 'light' ? '#304156' : '#ffffff'}}
          onClick={() => setButtonState('Token')}
          fontWeight={buttonState === 'Token' ? 'bold' : 'normal'}
          color={
            buttonState === 'Token'
              ? colorMode === 'light'
                ? '#304156'
                : '#ffffff'
              : '#9d9ea5'
          }>
          Token
        </Text>
        <Box
          h={'9px'}
          w={'1px'}
          border={
            colorMode === 'light'
              ? '0.5px solid #d7d9df'
              : '0.5px solid #373737'
          }></Box>
        <Text
          px={'12px'}
          fontWeight={buttonState === 'Schedule' ? 'bold' : 'normal'}
          color={
            buttonState === 'Schedule'
              ? colorMode === 'light'
                ? '#304156'
                : '#ffffff'
              : '#9d9ea5'
          }
          onClick={() => setButtonState('Schedule')}>
          Schedule
        </Text>
        <Box
          h={'9px'}
          w={'1px'}
          border={
            colorMode === 'light'
              ? '0.5px solid #d7d9df'
              : '0.5px solid #373737'
          }></Box>
        <Text
          px={'12px'}
          fontWeight={buttonState === 'Tier' ? 'bold' : 'normal'}
          color={
            buttonState === 'Tier'
              ? colorMode === 'light'
                ? '#304156'
                : '#ffffff'
              : '#9d9ea5'
          }
          onClick={() => setButtonState('Tier')}>
          sTOS Tier
        </Text>
      </Flex>
      {buttonState === 'Token' ? (
        <TokenComp vault={vault} project={project} />
      ) : buttonState === 'Schedule' ? (
        <ScheduleComp vault={vault} project={project} />
      ) : (
        <TierComp vault={vault} project={project} />
      )}
      <MobileVaultTable claim={vault.claim} />
    </Flex>
  );
};

const TokenComp: React.FC<TokenCompProps> = ({vault, project}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const network = BASE_PROVIDER._network.name;
  const gridItemStyle = {
    display: 'flex',
    flexDire: 'row',
    justifyContent: 'space-between',
    paddingLeft: '20px',
    paddingRight: '20px',
    height: '60px',
    alignItems: 'center',
  };
  const leftText = {
    fontFamily: theme.fonts.fld,
    fontSize: '14px',
    color: colorMode === 'light' ? '#7e8993' : '#9d9ea5',
  };
  const rightText = {
    fontFamily: theme.fonts.fld,
    fontSize: '14px',
    fontWeight: 'bold',
    color: colorMode === 'light' ? '#353c48' : '#fff',
  };
  return (
    <Grid
      h={'100%'}
      bg={colorMode === 'light' ? '#fff' : 'transparent'}
      boxShadow={
        colorMode === 'light' ? '0 1px 1px 0 rgba(61, 73, 93, 0.1)' : 'none'
      }
      border={colorMode === 'light' ? 'none' : 'solid 1px #373737'}
      borderRadius="15px">
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        {' '}
        <Text
          fontFamily={theme.fonts.fld}
          fontSize="14px"
          color={colorMode === 'light' ? '#353c48' : '#fff'}
          fontWeight={600}>
          Token
        </Text>
        {vault.isDeployed ? (
          <Flex>
            <Text letterSpacing={'1.3px'} style={rightText} mr={'5px'}>
              {Number(vault.vaultTokenAllocation).toLocaleString()}{' '}
              {project.tokenSymbol}
            </Text>
            <Text
              fontFamily={theme.fonts.fld}
              letterSpacing={'1.3px'}
              fontSize={'14px'}
              color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              {'('}
              {(
                (vault.vaultTokenAllocation / project.totalTokenAllocation) *
                100
              )
                .toString()
                .match(/^\d+(?:\.\d{0,2})?/)}
              {'%)'}
            </Text>
          </Flex>
        ) : (
          <></>
        )}
      </GridItem>
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text style={leftText}>Public Round 1.</Text>
        <Flex>
          <Text style={rightText} mr={'5px'}>
            {` ${Number(vault.publicRound1Allocation).toLocaleString()} ${
              project.tokenSymbol
            }`}
          </Text>
          <Text
            fontFamily={theme.fonts.fld}
            fontSize={'14px'}
            color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
            {`(${
              (
                (Number(vault.publicRound1Allocation) /
                  Number(vault.vaultTokenAllocation)) *
                100
              )
                .toFixed(3)
                .replace(/\.(\d\d)\d?$/, '.$1') || '-'
            }%)`}
          </Text>
        </Flex>
      </GridItem>
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text style={leftText}>Public Round 2.</Text>
        <Flex>
          <Text style={rightText} mr={'5px'}>
            {` ${Number(vault.publicRound2Allocation).toLocaleString()} ${
              project.tokenSymbol
            }`}
          </Text>
          <Text
            fontFamily={theme.fonts.fld}
            fontSize={'14px'}
            color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
            {`(${
              (
                (Number(vault.publicRound2Allocation) /
                  Number(vault.vaultTokenAllocation)) *
                100
              )
                .toFixed(3)
                .replace(/\.(\d\d)\d?$/, '.$1') || '-'
            }%)`}
          </Text>
        </Flex>
      </GridItem>
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text style={leftText} w={'103px'}>
          Token Allocation for Liquidiy Pool
        </Text>
        <Flex>
          <Text style={rightText} mr={'5px'}>
            {`${(
              (Number(vault.vaultTokenAllocation) *
                Number(vault.tokenAllocationForLiquidity)) /
              100
            ).toLocaleString()}  ${project.tokenSymbol}`}{' '}
          </Text>
          <Text
            fontFamily={theme.fonts.fld}
            fontSize={'14px'}
            color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
            {`(${
              (vault.tokenAllocationForLiquidity * 1)
                .toFixed(3)
                .replace(/\.(\d\d)\d?$/, '.$1') || '-'
            }%)`}
          </Text>
        </Flex>
      </GridItem>
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text style={leftText} w={'103px'}>
          {' '}
          Minimum Fund Raising Amount
        </Text>
        <Text style={rightText}>{`${Number(
          vault.hardCap,
        ).toLocaleString()}  TON`}</Text>
      </GridItem>
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text style={leftText} w={'103px'}>
          Address for receiving funds
        </Text>
        <Link
          isExternal
          href={
            vault.addressForReceiving && network === 'rinkeby'
              ? `https://rinkeby.etherscan.io/address/${vault.addressForReceiving}`
              : vault.addressForReceiving && network !== 'rinkeby'
              ? `https://etherscan.io/address/${vault.addressForReceiving}`
              : ''
          }
          style={rightText}
          textDecor={'underline'}>
          {vault.addressForReceiving
            ? shortenAddress(vault.addressForReceiving)
            : 'NA'}
        </Link>
      </GridItem>
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text style={leftText} w={'103px'}>
          Vault Admin Address
        </Text>
        <Link
          isExternal
          href={
            vault.adminAddress && network === 'rinkeby'
              ? `https://rinkeby.etherscan.io/address/${vault.adminAddress}`
              : vault.adminAddress && network !== 'rinkeby'
              ? `https://etherscan.io/address/${vault.adminAddress}`
              : ''
          }
          style={rightText}
          textDecor={'underline'}>
          {vault.adminAddress ? shortenAddress(vault.adminAddress) : 'NA'}
        </Link>
      </GridItem>
      <GridItem style={gridItemStyle}>
        <Text style={leftText} w={'103px'}>
          Vault Contract Address
        </Text>
        <Link
          isExternal
          href={
            vault.vaultAddress && network === 'rinkeby'
              ? `https://rinkeby.etherscan.io/address/${vault.vaultAddress}`
              : vault.vaultAddress && network !== 'rinkeby'
              ? `https://etherscan.io/address/${vault.vaultAddress}`
              : ''
          }
          style={rightText}
          textDecor={'underline'}>
          {vault.vaultAddress ? shortenAddress(vault.vaultAddress) : 'NA'}
        </Link>
      </GridItem>
    </Grid>
  );
};

const ScheduleComp: React.FC<TokenCompProps> = ({vault, project}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [isLabelOpen, setIsLabelOpen] = useState(false)
  const network = BASE_PROVIDER._network.name;
  const gridItemStyle = {
    display: 'flex',
    flexDire: 'row',
    justifyContent: 'space-between',
    paddingLeft: '20px',
    paddingRight: '20px',
    height: '60px',
    alignItems: 'center',
  };
  const leftText = {
    fontFamily: theme.fonts.fld,
    fontSize: '14px',
    color: colorMode === 'light' ? '#7e8993' : '#9d9ea5',
  };
  const rightText = {
    fontFamily: theme.fonts.fld,
    fontSize: '14px',
    fontWeight: 'bold',
    color: colorMode === 'light' ? '#353c48' : '#fff',
  };

  return (
    <Grid
      h={'100%'}
      bg={colorMode === 'light' ? '#fff' : 'transparent'}
      boxShadow={
        colorMode === 'light' ? '0 1px 1px 0 rgba(61, 73, 93, 0.1)' : 'none'
      }
      border={colorMode === 'light' ? 'none' : 'solid 1px #373737'}
      borderRadius="15px">
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text
          fontFamily={theme.fonts.fld}
          fontSize="14px"
          color={colorMode === 'light' ? '#353c48' : '#fff'}
          fontWeight={600}>
          Schedule
        </Text>
        {vault.isDeployed ? (
          <Flex>
            <Text letterSpacing={'1.3px'} style={rightText} mr={'5px'}>
              UTC {momentTZ.tz(momentTZ.tz.guess()).format('Z')}
            </Text>
          </Flex>
        ) : (
          <></>
        )}
      </GridItem>
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Flex justifyContent={'flex-start'} alignItems={'center'} w={'76px'}>
          <Text style={leftText} w={'103px'}>
            Snapshot
          </Text>
          <Tooltip
            label="Snapshot date must be set 1 week after Deployment completion"
            hasArrow
            isOpen={isLabelOpen}
            placement="top"
            color={colorMode === 'light' ? '#e6eaee' : '#424242'}
            aria-label={'Tooltip'}
            textAlign={'center'}
            size={'xs'}>
            <Image src={tooltipIcon} onClick={() => setIsLabelOpen(!isLabelOpen)}/>
          </Tooltip>
        </Flex>
        <Text style={rightText}>
          {' '}
          {moment.unix(vault.snapshot).format('YYYY.MM.DD HH:mm:ss')}
        </Text>
      </GridItem>
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text style={leftText} w={'103px'}>
          Whitelist
        </Text>
        <Text style={rightText} w={'111px'} textAlign={'right'}>
          {moment.unix(vault.whitelist).format('YYYY.MM.DD HH:mm:ss')} {`~`}{' '}
          {moment.unix(vault.whitelistEnd).format('MM.DD HH:mm:ss')}
        </Text>
      </GridItem>
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text style={leftText} w={'103px'}>
          Public Round 1.
        </Text>
        <Text style={rightText} w={'111px'} textAlign={'right'}>
          {moment.unix(vault.publicRound1).format('YYYY.MM.DD HH:mm:ss')} {`~`}{' '}
          {moment.unix(vault.publicRound1End).format('MM.DD HH:mm:ss')}
        </Text>
      </GridItem>
      <GridItem style={gridItemStyle}>
        <Text style={leftText} w={'103px'}>
          Public Round 2.
        </Text>
        <Text style={rightText} w={'111px'} textAlign={'right'}>
          {moment.unix(vault.publicRound2).format('YYYY.MM.DD HH:mm:ss')} {`~`}{' '}
          {moment.unix(vault.publicRound2End).format('MM.DD HH:mm:ss')}
        </Text>
      </GridItem>
    </Grid>
  );
};
const TierComp: React.FC<TokenCompProps> = ({vault, project}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const gridItemStyle = {
    display: 'flex',
    flexDire: 'row',
    justifyContent: 'space-between',
    height: '60px',
    alignItems: 'center',
  };
  const leftText = {
    fontFamily: theme.fonts.fld,
    fontSize: '14px',
    color: colorMode === 'light' ? '#7e8993' : '#9d9ea5',
  };
  const rightText = {
    fontFamily: theme.fonts.fld,
    fontSize: '14px',
    fontWeight: 'bold',
    color: colorMode === 'light' ? '#353c48' : '#fff',
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
      light: '#2a72e5',
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
    headerFont: {
      light: '#353c48',
      dark: '#fff',
    },
  };
  const sTosTier = vault.stosTier
    ? Object.keys(vault.stosTier)
        .map((tier) => {
          const tierNum =
            tier === 'oneTier'
              ? 1
              : tier === 'twoTier'
              ? 2
              : tier === 'threeTier'
              ? 3
              : 4;
          return {
            tier: tierNum,
            allocatedToken: vault.stosTier[tier].allocatedToken,
            requiredStos: vault.stosTier[tier].requiredStos,
          };
        })
        .sort((a, b) => a.tier - b.tier)
    : [];
  return (
    <Grid
      h={'100%'}
      bg={colorMode === 'light' ? '#fff' : 'transparent'}
      boxShadow={
        colorMode === 'light' ? '0 1px 1px 0 rgba(61, 73, 93, 0.1)' : 'none'
      }
      border={colorMode === 'light' ? 'none' : 'solid 1px #373737'}
      borderRadius="15px">
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }
        px='20px'>
        <Text
          fontFamily={theme.fonts.fld}
          fontSize="14px"
          color={colorMode === 'light' ? '#353c48' : '#fff'}
          fontWeight={600}>
          sTOS Tier
        </Text>
      </GridItem>
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text style={leftText} textAlign='center' w={'60px'}>Tier</Text>
        <Text style={leftText} textAlign='center' w={'108px'}>Required TOS</Text>
        <Text style={leftText} textAlign='center' w={'152px'}>Allocated Token</Text>
      </GridItem>
      {sTosTier?.map((data: any, index: number) => {
        const {tier, requiredStos, allocatedToken} = data;
        const publicRound1Allocation = vault.publicRound1Allocation;
        const percent =
          (Number(allocatedToken) * 100) / Number(publicRound1Allocation);

        return (
          <GridItem
            style={gridItemStyle}
            key={index}
            borderBottom={
              index !== sTosTier.length - 1
                ? colorMode === 'light'
                  ? '1px solid #e6eaee'
                  : '1px solid #373737'
                : 'none'
            }
           >
         
            <Text
           
            w={'60px'}
            textAlign='center'
              fontFamily={theme.fonts.fld}
              fontSize="14px"
              color={colorMode === 'light' ? '#353c48' : '#fff'}
              fontWeight={600}>
              {tier ? tier : index + 1}
            </Text>
            <Text
             w={'108px'}
             textAlign='center'
              fontFamily={theme.fonts.fld}
              fontSize="14px"
              color={colorMode === 'light' ? '#353c48' : '#fff'}
              fontWeight={600}>
              {Number(requiredStos).toLocaleString() || '-'}
            </Text>
            <Flex justifyContent={'center'} alignItems={'center'} w={'152px'}>
              <Text  fontFamily={theme.fonts.fld}
              fontSize="14px"
              color={colorMode === 'light' ? '#353c48' : '#fff'}
              fontWeight={600}>
                {Number(allocatedToken).toLocaleString() || '-'}
              </Text>
              <Text
                fontFamily={theme.fonts.fld}
                fontSize="14px"
                color={colorMode === 'light' ? '#353c48' : '#fff'}
                fontWeight={600}
                textAlign={'center'}
             >
                {isNaN(percent)
                  ? '(- %)'
                  : `(${
                      Number(percent)
                        .toFixed(3)
                        .replace(/\.(\d\d)\d?$/, '.$1') || '-'
                    }%)`}
              </Text>
            </Flex>
          </GridItem>
        );
      })}
    </Grid>
  );
};
