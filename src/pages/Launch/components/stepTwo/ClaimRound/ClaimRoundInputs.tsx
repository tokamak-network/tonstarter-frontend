import {Flex, Input, Text, useColorMode, Box} from '@chakra-ui/react';
import SingleCalendarPop from '@Launch/components/common/SingleCalendarPop';
import {
  saveTempVaultData,
  selectLaunch,
  setClaimRoundTable,
} from '@Launch/launch.reducer';
import {Projects} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import moment from 'moment';
import {useMemo, useState} from 'react';

const ClaimRoundInput = (props: {index: number}) => {
  const {index} = props;
  const {colorMode} = useColorMode();
  const {values} = useFormikContext<Projects['CreateProject']>();
  const vaultsList = values.vaults;

  const middleStyle = {
    border: colorMode === 'light' ? 'solid 1px #eff1f6' : 'solid 1px #373737',
  };

  const {
    data: {claimRoundTable},
  } = useAppSelector(selectLaunch);
  const dispatch = useAppDispatch();

  //legacy
  const [isErr, setIsErr] = useState(false);
  const [input, setInput] = useState(
    claimRoundTable !== undefined
      ? claimRoundTable[index].claimTokenAllocation
      : 0,
  );

  const component = useMemo(() => {
    if (claimRoundTable === undefined) {
      return null;
    }
    return (
      <Flex w={'100%'}>
        <Box
          d="flex"
          flexDir={'column'}
          textAlign="center"
          border={middleStyle.border}
          borderBottomWidth={0}
          lineHeight={'42px'}>
          <Flex
            h={'42px'}
            fontSize={12}
            color={colorMode === 'light' ? '#3d495d' : 'white.100'}
            fontWeight={600}
            bg={
              colorMode === 'light'
                ? index % 2 === 0
                  ? 'none'
                  : '#fafbfc'
                : 'none'
            }>
            <Text w={'91px'} borderBottom={middleStyle.border}>
              {index > 8 ? `${index + 1}` : `0${index + 1}`}
            </Text>
            <Flex
              w={'314px'}
              borderX={middleStyle.border}
              borderBottom={middleStyle.border}
              alignItems="center"
              justifyContent={'center'}>
              <Text
                mr={'5px'}
                color={colorMode === 'light' ? '#3d495d' : 'white.100'}
                fontSize={11}>
                {claimRoundTable[index].claimTime === undefined
                  ? '-'
                  : moment
                      .unix(claimRoundTable[index].claimTime as number)
                      .format('YYYY.MM.DD HH:mm:ss')}
              </Text>
              <SingleCalendarPop
                //@ts-ignore
                oldValues={claimRoundTable[index]}
                valueKey={'claimTime'}
                startTimeCap={
                  index === 0
                    ? //@ts-ignore
                      vaultsList[0].publicRound2End ||
                      moment().add(9, 'days').unix()
                    : (claimRoundTable !== undefined &&
                        Number(claimRoundTable[index - 1]?.claimTime)) ||
                      0
                }></SingleCalendarPop>
            </Flex>
            <Flex
              w={'314px'}
              alignItems="center"
              justifyContent={'center'}
              borderRight={middleStyle.border}
              borderBottom={middleStyle.border}>
              <Input
                h={`42px`}
                // ref={(el) => (inputRefs.current[index] = el)}
                _hover={{
                  borderWidth: '1px',
                  borderColor: '#257eee',
                }}
                _focus={
                  isErr ? {} : {borderWidth: '1px', borderColor: '#257eee'}
                }
                fontSize={12}
                placeholder={''}
                borderRadius={0}
                borderWidth={0}
                textAlign={'center'}
                value={input}
                onBlur={(e) => {
                  //   const {value} = e.target;
                  //   if (isNaN(Number(value)) || value === undefined) {
                  //     return;
                  //   }
                  //   const newArr: any = [];
                  //   claimRoundTable?.map((data) => {
                  //     newArr.push(data);
                  //   });
                  //   newArr.splice(index, 1);
                  //   newArr.splice(index, 0, {
                  //     claimRound: index + 1,
                  //     claimTime: 1,
                  //     claimTokenAllocation: Number(value),
                  //   });
                  //   dispatch(
                  //     saveTempVaultData({
                  //       data: newArr,
                  //     }),
                  //   );
                  //   dispatch(
                  //     setClaimRoundTable({
                  //       data: newArr,
                  //     }),
                  //   );
                }}
                onChange={(e) => {
                  const {value} = e.target;
                  console.log(value);
                  setInput(Number(value));
                  // if (inputVals) {
                  //   let oldVals = [...inputVals];
                  //   let item = {
                  //     ...oldVals[index],
                  //     claimTokenAllocation: Number(value),
                  //   };
                  //   oldVals[index] = item;
                  //   return setInputVals(oldVals);
                  // }
                }}></Input>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    );
  }, [input, claimRoundTable]);

  if (claimRoundTable === undefined) {
    return null;
  }

  return <>{component}</>;
};

export default ClaimRoundInput;
