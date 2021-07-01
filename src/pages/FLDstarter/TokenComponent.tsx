import {FC} from 'react';
import {
  Flex,
  Text,
  Button,
  Image,
  Container,
  useTheme,
  Avatar,
  Tooltip,
} from '@chakra-ui/react';
import {useColorMode} from '@chakra-ui/react';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';
import {useCallback} from 'react';
import {checkTokenType} from 'utils/token';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';
import {openModal} from 'store/modal.reducer';

type TokenComponentProps = {
  data: any;
};

export const TokenComponent: FC<TokenComponentProps> = ({data}) => {
  const {phase, period, token, stakeBalanceTON} = data;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const tokenType = checkTokenType(token);
  const history = useHistory();
  const dispatch = useDispatch();
  const handleStakingNavigation = useCallback(() => {
    dispatch(openModal({type: 'stake', data}));
    history.push(`/staking`);
  }, [data, dispatch, history]);
  const handleInfoNavigation = useCallback(() => {
    dispatch(openModal({type: 'manage', data}));
    history.push(`/staking`);
  }, [data, dispatch, history]);
  return (
    <Container
      bg={colorMode === 'light' ? theme.colors.white[100] : 'transparent'}
      boxShadow="base"
      rounded={15}
      borderWidth={colorMode === 'light' ? 0 : 1}
      borderColor={theme.colors.gray[75]}
      p="4">
      <Flex direction={'row'} pos="relative">
        <Avatar
          src={tokenType.symbol}
          backgroundColor={tokenType.bg}
          bg="transparent"
          color="#c7d1d8"
          name="T"
          h="48px"
          w="48px"
        />
        <Flex direction={'column'} px={6}>
          <Text
            fontWeight={'bold'}
            fontSize={26}
            fontFamily={theme.fonts.fld}
            lineHeight={1}
            color={
              colorMode === 'light'
                ? theme.colors.gray[275]
                : theme.colors.white[100]
            }>
            {phase}
          </Text>
          <Flex mb={2}>
            <Text className={'fld-text1'} mr={1}>
              Period
            </Text>
            <Text className={'fld-text2'} mr={1}>
              {period}
            </Text>
            <Text
              fontWeight={'semibold'}
              fontSize={16}
              fontFamily={theme.fonts.fld}
              mx={1}
              color={theme.colors.gray[10]}></Text>
          </Flex>
          <Flex>
            <Text className={'fld-text1'} mr={1}>
              Earning Per Block
            </Text>
            <Text className={'fld-text2'} mr={1}></Text>
          </Flex>
          <Flex mt={3} alignItems={'center'}>
            <Text
              fontWeight={'semibold'}
              fontSize={32}
              fontFamily={theme.fonts.fld}
              mr={2}
              color={
                colorMode === 'light'
                  ? theme.colors.gray[125]
                  : theme.colors.white[100]
              }
              lineHeight={1}>
              {stakeBalanceTON}
            </Text>
            <Text
              fontWeight={'semibold'}
              fontSize={20}
              fontFamily={theme.fonts.fld}
              color={
                colorMode === 'light'
                  ? theme.colors.gray[125]
                  : theme.colors.white[100]
              }
              mr={2}>
              TON
            </Text>
            <Tooltip
              hasArrow
              placement="right"
              label="Total Staked"
              color={theme.colors.white[100]}
              bg={theme.colors.gray[375]}>
              <Image src={tooltipIcon} />
            </Tooltip>
          </Flex>
          <Text className={'fld-text1'} fontWeight={'normal'}>
            1644.99 USD
          </Text>
          <Flex mt={4} mb={2}>
            <Button
              onClick={() => handleStakingNavigation()}
              h={8}
              fontSize={16}
              fontWeight={700}
              rounded={18}
              bg={theme.colors.yellow[200]}
              px={34}
              fontFamily={theme.fonts.fld}
              mr={2}
              color={'black'}
              _hover={{bg: theme.colors.yellow[300]}}>
              Staking
            </Button>

            <Button
              borderWidth={1}
              onClick={() => handleInfoNavigation()}
              borderColor={
                colorMode === 'light' ? 'transparent' : theme.colors.gray[75]
              }
              h={8}
              fontSize={16}
              fontWeight={700}
              color={
                colorMode === 'light' ? theme.colors.gray[125] : '!currentcolor'
              }
              rounded={18}
              bg={
                colorMode === 'light' ? theme.colors.gray[200] : '!currentcolor'
              }
              px={34}
              fontFamily={theme.fonts.fld}
              _hover={{
                bg:
                  colorMode === 'light'
                    ? theme.colors.gray[325]
                    : 'transparent',
                borderColor:
                  colorMode === 'light'
                    ? 'transparent'
                    : theme.colors.gray[350],
                color:
                  colorMode === 'light'
                    ? theme.colors.gray[125]
                    : theme.colors.gray[0],
              }}>
              {' '}
              Details{' '}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
};
