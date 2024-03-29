import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  useFormikContext,
  getIn,
} from 'formik';
import * as Yup from 'yup';
import {
  Flex,
  Box,
  Text,
  Button,
  useTheme,
  useColorMode,
  Select,
  Image,
  Checkbox,
} from '@chakra-ui/react';
import {AdminObject} from '@Admin/types';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {CustomButton} from 'components/Basic/CustomButton';
import {LibraryType} from 'types';
import {getTotalExpectSaleAmount} from '../utils/fetchContract';
import {CustomTooltip} from 'components/Tooltip';
import {convertTimeStamp} from 'utils/convertTIme';
import WatchImg from 'assets/svgs/poll-time-active-icon.svg';
import TONSymbol from 'assets/tokens/tokamak-1@3x.png';
import EtherscanLink from 'assets/images/etherscan-shortcuts-inactive-icon@3x.png';
import store from 'store';
import {TokenImage} from './TokenImage';
import {CustomCalendar} from './CustomCalendar';
import {CustomClock} from './CustomClock';
import '../css/Calendar.css';
import moment from 'moment';

type StepProp = {
  data: AdminObject;
  lastStep: boolean;
  handleNextStep: Dispatch<SetStateAction<any>> | any;
  handlePrevStep?: Dispatch<SetStateAction<any>> | any;
  library?: LibraryType;
  final: boolean;
};

const fieldWrap = {
  fontSize: 13,
};

const fieldStyle = {
  width: '327px',
  border: '1px solid #dfe4ee',
  height: '32px',
  borderRadius: 4,
  paddingLeft: '15px',
  verticalTextAlign: 'center',
};

const Line = () => {
  return (
    <Box
      w={'774px'}
      pos={'absolute'}
      h={'1px'}
      top={0}
      bg={'#f4f6f8'}
      left={'-35px'}></Box>
  );
};

export const SubmitButton = (props: {
  final: boolean;
  saveHandleSubmit: any;
}) => {
  const {final, saveHandleSubmit} = props;
  const {values} = useFormikContext();
  const theme = useTheme();
  return (
    <CustomButton
      w={'180px'}
      h={'45px'}
      text={'Project Save'}
      isDisabled={!final}
      style={{
        fontFamily: theme.fonts.roboto,
        fontWeight: 600,
      }}
      func={() => saveHandleSubmit(values)}></CustomButton>
  );
};

const TimeSetting = (props: {timeStamp: number | ''}) => {
  const {timeStamp} = props;
  return (
    <Flex h={'13px'} alignSelf="center" ml={'10px'} pt={'3px'}>
      <Text
        fontSize={10}
        color={timeStamp === '' ? 'gray.175' : 'gray.225'}
        mr={'5px'}>
        {timeStamp === ''
          ? 'Time setting'
          : convertTimeStamp(timeStamp, 'A hh:mm:ss')}
      </Text>
      <img
        src={WatchImg}
        alt={`watch_icon`}
        style={{width: '15px', height: '15px'}}></img>
    </Flex>
  );
};

const CustomFieldWithTime = (props: {
  name: string;
  title?: string;
  w?: string;
  placeHolder?: string;
}) => {
  const {name, title, w, placeHolder} = props;

  const {values} = useFormikContext();
  const fieldValue = getIn(values, name);
  const [startTime, setStartTime] = useState<number>(0);
  const [startTimeArray, setStartTimeArray] = useState([]);
  useEffect(() => {
    const starts = moment.unix(startTime);
    const startDates = moment(starts).set({
      hour: startTimeArray[0],
      minute: startTimeArray[1],
      second: startTimeArray[2],
    });
    setStartTime(startDates.unix());
  }, [startTimeArray, startTime]);
  return (
    <Box d="flex">
      <Flex style={fieldWrap} flexDir="column" mb={'20px'} pos="relative">
        <Flex mb={'10px'}>
          <Text>{title || name}</Text>
          <ErrorMessage
            name={name}
            render={() => (
              <div
                style={{
                  marginLeft: '3px',
                  color: 'red',
                  fontSize: '15px',
                  verticalAlign: 'center',
                  textAlign: 'center',
                }}>
                *
              </div>
            )}
          />
        </Flex>
        <Flex alignItems={'center'} h={'45px'}>
          <CustomCalendar
            setValue={setStartTime}
            // startTime={startTime}
            // endTime={endTime}
            // calendarType={'start'}
            // created={created}
          />

          <CustomClock setTime={setStartTimeArray} />
        </Flex>
      </Flex>
      {/* <TimeSetting
        timeStamp={
          fieldValue === '' ? fieldValue : Number(fieldValue)
        }></TimeSetting> */}
    </Box>
  );
};

const CustomTextAreaField = (props: {name: string; title?: string}) => {
  const {name, title} = props;
  return (
    <Flex style={fieldWrap} flexDir="column" mb={'20px'} pos="relative">
      <Flex mb={'10px'}>
        <Text>{title || name}</Text>
        <ErrorMessage
          name={name}
          render={() => (
            <div
              style={{
                marginLeft: '3px',
                color: 'red',
                fontSize: '15px',
                verticalAlign: 'center',
                textAlign: 'center',
              }}>
              *
            </div>
          )}
        />
      </Flex>
      <Field
        name={name}
        as="textarea"
        style={{
          width: '327px',
          height: '112px',
          border: '1px solid #dfe4ee',
          borderRadius: 4,
          paddingLeft: '15px',
          paddingTop: '5px',
        }}
        placeHolder={`input description`}
      />
    </Flex>
  );
};

const CustomField = (props: {
  name: string;
  title?: string;
  w?: string;
  placeHolder?: string;
}) => {
  const {name, title, w, placeHolder} = props;

  return (
    <Flex style={fieldWrap} flexDir="column" mb={'20px'} pos="relative">
      <Flex mb={'10px'}>
        <Text>{title || name}</Text>
        <ErrorMessage
          name={name}
          render={() => (
            <div
              style={{
                marginLeft: '3px',
                color: 'red',
                fontSize: '15px',
                verticalAlign: 'center',
                textAlign: 'center',
              }}>
              *
            </div>
          )}
        />
      </Flex>
      <Field
        style={{...fieldStyle, width: w || '327px'}}
        name={name}
        placeHolder={placeHolder || `input ${name}`}
      />
    </Flex>
  );
};

export const StepOne: React.FC<StepProp> = (props) => {
  const {data, lastStep, handleNextStep, final} = props;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {btnStyle} = theme;

  const handleSubmit = (values: AdminObject) => {
    handleNextStep(values, lastStep);
  };

  const saveHandleSubmit = (values: AdminObject) => {
    handleNextStep(values, true);
  };

  const names = [
    'name',
    'description',
    'image',
    'adminAddress',
    'website',
    'telegram',
    'medium',
    'twitter',
    'discord',
  ];

  const obj = {};

  names.map((name: string) => {
    //@ts-ignore
    const nameType = typeof data[name];
    const isRequired =
      name === 'name' || name === 'description' || name === 'adminAddress';
    if (!isRequired) {
      return null;
    }
    if (nameType === 'string') {
      //@ts-ignore
      return (obj[name] = Yup.string().required().label(name));
    }
    if (nameType === 'number') {
      //@ts-ignore
      return (obj[name] = Yup.number().required().label(name));
    }
    //@ts-ignore
    return (obj[name] = Yup.boolean().required().label(name));
  });

  const stepOneValidationSchema = Yup.object({
    ...obj,
  });

  return (
    <Formik
      enableReinitialize
      validationSchema={stepOneValidationSchema}
      initialValues={data}
      validateOnMount={true}
      onSubmit={handleSubmit}>
      {({isValid, errors, isValidating}) => {
        return (
          <Form
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              // height: '520px',
              position: 'relative',
              paddingTop: '40px',
            }}>
            <Line />
            <Flex justifyContent="space-between">
              <Flex flexDir="column">
                <CustomField name={'name'} title={'Name'}></CustomField>
                <CustomTextAreaField
                  name={'description'}
                  title={'Description'}></CustomTextAreaField>
                <CustomField
                  name={'image'}
                  title={'Upload Project Main Image'}></CustomField>
                <CustomField
                  name={'adminAddress'}
                  title={'Admin address'}></CustomField>
              </Flex>
              <Flex flexDir="column">
                <CustomField name={'website'}></CustomField>
                <CustomField name={'telegram'}></CustomField>
                <CustomField name={'medium'}></CustomField>
                <CustomField name={'twitter'}></CustomField>
                <CustomField name={'discord'}></CustomField>
              </Flex>
            </Flex>
            <Flex w={'100%'} justifyContent="center" mt={'20px'} mb={'40px'}>
              <Button
                {...(!isValid
                  ? {...btnStyle.btnDisable({colorMode})}
                  : {...btnStyle.btnAble()})}
                type="submit"
                w={'150px'}
                h={'38px'}
                br={4}
                disabled={!isValid}
                _hover={{}}>
                Next
              </Button>
            </Flex>
            <Flex
              pos="absolute"
              w={'100%'}
              bottom={'-330px'}
              alignItems="center"
              justifyContent="center">
              <SubmitButton
                final={final}
                saveHandleSubmit={saveHandleSubmit}></SubmitButton>
            </Flex>
          </Form>
        );
      }}
    </Formik>
  );
};

export const StepTwo: React.FC<StepProp> = (props) => {
  const {data, lastStep, handleNextStep, handlePrevStep, final} = props;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {btnStyle} = theme;

  const handleSubmit = (values: any) => {
    handleNextStep(values, lastStep);
  };

  const saveHandleSubmit = (values: AdminObject) => {
    handleNextStep(values, true);
  };

  const names = [
    'tokenName',
    'tokenAddress',
    'tokenSymbol',
    'tokenSymbolImage',
    'tokenAllocationAmount',
    'tokenFundRaisingTargetAmount',
    'fundingTokenType',
    'tokenFundingRecipient',
    'projectTokenRatio',
    'projectFundingTokenRatio',
  ];

  const obj = {};

  names.map((name: string) => {
    //@ts-ignore
    const nameType = typeof data[name];
    // const isRequired =
    //   name === 'name' || name === 'description' || name === 'adminAddress';
    // if (!isRequired) {
    //   return null;
    // }
    if (nameType === 'string') {
      //@ts-ignore
      return (obj[name] = Yup.string().required().label(name));
    }
    if (nameType === 'number') {
      //@ts-ignore
      return (obj[name] = Yup.number().required().label(name));
    }
    //@ts-ignore
    return (obj[name] = Yup.boolean().required().label(name));
  });

  const stepOneValidationSchema = Yup.object({
    ...obj,
  });

  const titleStyle = {
    color: 'black.300',
    fontSize: 15,
  };

  return (
    <Formik
      enableReinitialize
      validationSchema={stepOneValidationSchema}
      initialValues={data}
      onSubmit={handleSubmit}>
      {({isValid, setFieldValue, isValidating, values, setValues}) => {
        const {
          fundingTokenType,
          projectTokenRatio,
          projectFundingTokenRatio,
          tokenSymbolImage,
        } = values;

        const checkTokenRatio =
          projectTokenRatio === 0 || projectFundingTokenRatio === 0;

        return (
          <Form
            style={{
              display: 'flex',
              // width: '120%',
              // height: '800px',
              position: 'relative',
              flexDirection: 'column',
              justifyContent: 'space-between',
              // borderTop: '1px solid #f4f6f8',
            }}>
            <Line />
            <Flex flexDir="column">
              <Flex
                style={titleStyle}
                alignItems="center"
                mt={'40px'}
                mb={'25px'}>
                <span style={{fontSize: '4px'}}>○ </span>
                <Text ml={'3px'}>Project Token</Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Flex flexDir="column">
                  <CustomField
                    name={'tokenName'}
                    title={'Token Name'}></CustomField>
                  <CustomField
                    name={'tokenSymbol'}
                    title={'Token Symbol'}></CustomField>
                  <CustomField
                    name={'tokenAllocationAmount'}
                    title={'Token Allocation Amount'}></CustomField>
                </Flex>
                <Flex flexDir="column">
                  <CustomField
                    name={'tokenAddress'}
                    title={'Token Address'}></CustomField>
                  <Box d="flex" pos="relative">
                    <CustomField
                      w={'185px'}
                      name={'tokenSymbolImage'}
                      title={'Token Symbol Image'}></CustomField>
                    <Box mt={'15px'} ml={'10px'}>
                      <TokenImage imageLink={tokenSymbolImage}></TokenImage>
                    </Box>
                  </Box>
                </Flex>
              </Flex>
              <Flex
                style={titleStyle}
                alignItems="center"
                mt={'40px'}
                mb={'25px'}>
                <span style={{fontSize: '4px'}}>○ </span>
                <Text ml={'3px'}>Funding Token</Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Flex flexDir="column">
                  <Flex pos="relative" flexDir={'column'} mb={'10px'}>
                    <Text style={fieldWrap} mb={'10px'}>
                      Token Name
                    </Text>
                    <Flex
                      pos="absolute"
                      w={'26px'}
                      h={'26px'}
                      bottom={'3px'}
                      left={'10px'}
                      border={'1px solid #e7edf3'}
                      borderRadius={25}
                      alignItems="center"
                      justifyContent="center">
                      <img
                        src={fundingTokenType === 'TON' ? TONSymbol : ''}
                        alt={'TON_SYMBOL'}
                        style={{
                          width: '18.2px',
                          height: '18.2px',
                        }}
                      />
                    </Flex>
                    <Select
                      w={'200px'}
                      h={'32px'}
                      iconColor={'#dfe4ee'}
                      fontSize={13}
                      value={fundingTokenType}
                      style={{paddingLeft: '43px', paddingTop: '3px'}}
                      onChange={(e) => {
                        const tokenType = e.target.value;
                        setFieldValue('fundingTokenType', tokenType);
                      }}>
                      <option value="TON">TON</option>
                    </Select>
                  </Flex>

                  <CustomField
                    name={'tokenFundRaisingTargetAmount'}
                    title={'Token Fund Rasing Target Amount'}></CustomField>
                </Flex>
                <Flex>
                  <CustomField
                    name={'tokenFundingRecipient'}
                    title={'Funding Token Recipient'}></CustomField>
                </Flex>
              </Flex>
              <Flex
                style={titleStyle}
                alignItems="center"
                mt={'40px'}
                mb={'25px'}>
                <span style={{fontSize: '4px'}}>○ </span>
                <Text ml={'3px'}>Token Price Ratio</Text>
              </Flex>
              <Flex>
                <CustomField
                  name={'projectTokenRatio'}
                  title={'Project Token'}
                  w={'150px'}
                  placeHolder={'0.00'}></CustomField>
                <Text alignSelf="center" pt={'10px'} px={'11px'}>
                  :
                </Text>
                <CustomField
                  name={'projectFundingTokenRatio'}
                  title={'Funding Token'}
                  w={'150px'}
                  placeHolder={'0.00'}></CustomField>
              </Flex>
            </Flex>

            <Flex
              // pos="absolute"
              w={'100%'}
              mt={'30px'}
              mb={'40px'}
              // bottom={'35px'}
              justifyContent="center">
              <Button
                w={'150px'}
                h={'38px'}
                br={4}
                bg={'blue.500'}
                color={'white.100'}
                mr={'12px'}
                onClick={() => handlePrevStep()}
                _hover={{}}>
                Prev
              </Button>
              <Button
                {...(checkTokenRatio || !isValid
                  ? {...btnStyle.btnDisable({colorMode})}
                  : {...btnStyle.btnAble()})}
                type="submit"
                w={'150px'}
                h={'38px'}
                br={4}
                disabled={checkTokenRatio || !isValid}
                _hover={{}}>
                Next
              </Button>
            </Flex>
            <Flex
              pos="absolute"
              w={'100%'}
              bottom={'-255px'}
              alignItems="center"
              justifyContent="center">
              <SubmitButton
                final={final}
                saveHandleSubmit={saveHandleSubmit}></SubmitButton>
            </Flex>
          </Form>
        );
      }}
    </Formik>
  );
};

export const StepThree: React.FC<StepProp> = (props) => {
  const {data, lastStep, handleNextStep, handlePrevStep, library, final} =
    props;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {btnStyle} = theme;
  // const {data: appConfig} = useAppSelector(selectApp);

  const [timeline, setTimeline] = useState<
    0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  >(0);

  const handleSubmit = (values: any) => {
    handleNextStep(values, lastStep);
  };

  const saveHandleSubmit = (values: AdminObject) => {
    handleNextStep(values, true);
  };

  const names = [
    'saleContractAddress',
    'snapshot',
    'startAddWhiteTime',
    'endAddWhiteTime',
    'startExclusiveTime',
    'endExclusiveTime',
    'startDepositTime',
    'endDepositTime',
    'startClaimTime',
    'claimInterval',
    'claimPeriod',
    'claimFirst',
  ];

  const obj = {};

  names.map((name: string) => {
    //@ts-ignore
    const nameType = typeof data[name];
    // const isRequired =
    //   name === 'name' || name === 'description' || name === 'adminAddress';
    // if (!isRequired) {
    //   return null;
    // }
    if (nameType === 'string') {
      //@ts-ignore
      return (obj[name] = Yup.string().required().label(name));
    }
    if (nameType === 'number') {
      //@ts-ignore
      return (obj[name] = Yup.number().required().label(name));
    }
    //@ts-ignore
    return (obj[name] = Yup.boolean().required().label(name));
  });

  const stepOneValidationSchema = Yup.object({
    ...obj,
  });

  const titleStyle = {
    color: 'black.300',
    fontSize: 15,
  };

  const circleStyle = {
    display: 'flex',
    width: '24px',
    height: '24px',
    borderRadius: '18px',
    border: '1px solid #e6eaee',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 600,
    backgroundColor: '#ffffff',
    paddingLeft: '1px',
  };

  const timeLineStyle = (props: any) => ({
    display: 'flex',
    width: '24px',
    height: '24px',
    borderRadius: '18px',
    border: props.isTimeLine ? '1px solid #0070ed' : '',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 600,
    backgroundColor: props.isTimeLine ? '#ffffff' : '#0070ed',
    color: props.isTimeLine ? '#0070ed' : '#ffffff',
    paddingLeft: '1px',
  });

  const getFetch = useCallback(
    (address, setFieldValue) => {
      async function tryFetch(address: string, setFieldValue: any) {
        const res = await getTotalExpectSaleAmount({
          library,
          address,
        });
        if (res) {
          for (const [key, value] of Object.entries(res)) {
            setFieldValue(key, value);
          }
          setFieldValue('saleContractAddress', address);
          checkTimeLine(res);
        }
      }
      if (address) {
        tryFetch(address, setFieldValue);
      }
    },
    [library],
  );

  function checkTimeLine(data: any) {
    for (const [key, value] of Object.entries(data)) {
      if (key === 'snapshot' && value === 0) {
        return setTimeline(1);
      }
      if (key === 'startAddWhiteTime' && value === 0) {
        return setTimeline(2);
      }
      if (key === 'endAddWhiteTime' && value === 0) {
        return setTimeline(3);
      }
      if (key === 'startExclusiveTime' && value === 0) {
        return setTimeline(4);
      }
      if (key === 'endExclusiveTime' && value === 0) {
        return setTimeline(5);
      }
      if (key === 'startDepositTime' && value === 0) {
        return setTimeline(6);
      }
      if (key === 'endDepositTime' && value === 0) {
        return setTimeline(7);
      }
      if (key === 'endDepositTime' && value === 0) {
        return setTimeline(7);
      }
      if (key === 'startClaimTime' && value === 0) {
        return setTimeline(8);
      }
      if (key === 'claimInterval' && value === 0) {
        return setTimeline(8);
      }
      if (key === 'claimPeriod' && value === 0) {
        return setTimeline(8);
      }
      if (key === 'claimFirst' && value === 0) {
        return setTimeline(8);
      }
      return setTimeline(9);
    }
  }

  useEffect(() => {
    if (data) {
      checkTimeLine(data);
    }
  }, [data]);

  return (
    <Formik
      validationSchema={stepOneValidationSchema}
      initialValues={data}
      validateOnMount={true}
      onSubmit={handleSubmit}>
      {({isValid, values, setFieldValue, isValidating, errors}) => {
        const {saleContractAddress} = values;
        // putExistingData(setFieldValue);
        return (
          <Form
            style={{
              display: 'flex',
              width: '100%',
              // height: '1300px',
              position: 'relative',
              flexDirection: 'column',
              justifyContent: 'space-between',
              paddingTop: '40px',
            }}>
            <Line />
            <Flex flexDir="column">
              <Flex>
                <CustomField
                  name={'saleContractAddress'}
                  title={'Sale Contract Address'}
                  w={'300px'}></CustomField>
                <Box d="flex" alignItems="center" ml={'10px'}>
                  <CustomButton
                    w={'64px'}
                    h={'32px'}
                    style={{mt: '8px'}}
                    text={'Query'}
                    func={() =>
                      getFetch(saleContractAddress, setFieldValue)
                    }></CustomButton>
                </Box>
                <Image
                  mt={2}
                  ml={'5px'}
                  alignSelf="center"
                  src={EtherscanLink}
                  alt={'Etherscan'}
                  w={'24px'}
                  h={'24px'}
                  cursor={'pointer'}
                  onClick={() => {
                    window.open(
                      `${
                        store.getState().appConfig.data.explorerLink
                      }${saleContractAddress}`,
                    );
                  }}></Image>
              </Flex>
              <Flex mt={'15px'}>
                <Flex flexDir="column" w={'380px'}>
                  <Flex style={titleStyle} alignItems="center" mb={'17px'}>
                    <span style={{fontSize: '4px'}}>○ </span>
                    <Text ml={'3px'}>Sale Timeline</Text>
                  </Flex>
                  <Flex pos="relative" w={'310px'}>
                    <Flex flexDir="column" pos="absolute" left={'60px'}>
                      <Box
                        fontSize={'13px'}
                        pt={'3px'}
                        fontWeight={600}
                        mb={'405px'}
                        d="flex"
                        justifyContent="center">
                        <Text>Round 1</Text>
                        <Box paddingTop={'1px'} pl={'5px'}>
                          <CustomTooltip
                            toolTipW={242}
                            toolTipH={'64px'}
                            fontSize="12px"
                            msg={[
                              `This is the sale period for sTOS holders.`,
                              `sTOS holders can participate in the token`,
                              `sale after registering on the white list.`,
                            ]}
                            placement={'top'}></CustomTooltip>
                        </Box>
                      </Box>
                      <Box
                        fontSize={'13px'}
                        pt={'3px'}
                        fontWeight={600}
                        mb={'202px'}
                        d="flex"
                        justifyContent="center">
                        <Text>Round 2</Text>
                        <Box paddingTop={'1px'} pl={'5px'}>
                          <CustomTooltip
                            toolTipW={312}
                            toolTipH={'96px'}
                            fontSize="12px"
                            msg={[
                              `This is the period when anyone can`,
                              `participate in the sale.`,
                              `After deposit for tokens, you can purchase tokens.`,
                              `Purchased tokens are locked up and can be withdrawn`,
                              `sequentially during the vesting period.`,
                            ]}
                            placement={'top'}></CustomTooltip>
                        </Box>
                      </Box>
                      <Box
                        fontSize={'13px'}
                        pt={'3px'}
                        fontWeight={600}
                        d="flex"
                        justifyContent="center">
                        <Text>Vesting</Text>
                        <Box paddingTop={'1px'} pl={'5px'}>
                          <CustomTooltip
                            toolTipW={334}
                            toolTipH={'64px'}
                            fontSize="12px"
                            msg={[
                              `This is the period during which you can claim the tokens`,
                              `allocated to you.`,
                              `Tokens are unlocked sequentially during the vesting period.`,
                            ]}
                            placement={'top'}></CustomTooltip>
                        </Box>
                      </Box>
                    </Flex>
                    <Flex flexDir="column" pos="absolute" left={'190px'}>
                      <Box
                        fontSize={'13px'}
                        pt={'3px'}
                        h={'16px'}
                        mb={'104px'}
                        d="flex"
                        justifyContent="center">
                        <Text>Snpashot</Text>
                        <Box paddingTop={'1px'} pl={'5px'}>
                          <CustomTooltip
                            toolTipW={220}
                            toolTipH={'64px'}
                            fontSize="12px"
                            msg={[
                              `The tier of participants is determined`,
                              `based on the sTOS balance at this`,
                              `point.`,
                            ]}
                            placement={'top'}></CustomTooltip>
                        </Box>
                      </Box>
                      <Box fontSize={'13px'} pt={'3px'} h={'16px'} mb={'145px'}>
                        <Text>Add Whitelist</Text>
                      </Box>
                      <Box fontSize={'13px'} pt={'3px'} h={'16px'} mb={'215px'}>
                        <Text>Sale</Text>
                      </Box>
                      <Box fontSize={'13px'} pt={'3px'} h={'16px'} mb={'165px'}>
                        <Text>Deposit</Text>
                      </Box>
                      <Box fontSize={'13px'} pt={'3px'}>
                        <Text>Claim</Text>
                      </Box>
                    </Flex>
                    <Flex justifyContent="center" w={'100%'}>
                      <Flex zIndex={100} pl={0.5} flexDir="column">
                        <Box
                          style={
                            timeline < 1
                              ? circleStyle
                              : timeLineStyle({
                                  isTimeLine: timeline === 1,
                                })
                          }
                          // color={false ? 'gray757' : 'white.100'}
                          // bg={false ? 'white.100' : 'blue.100'}
                          mb={'57px'}>
                          <Text>1</Text>
                        </Box>
                        <Box
                          style={
                            timeline < 2
                              ? circleStyle
                              : timeLineStyle({
                                  isTimeLine: timeline === 2,
                                })
                          }
                          mb={'57px'}>
                          <Text>2</Text>
                        </Box>
                        <Box
                          style={
                            timeline < 3
                              ? circleStyle
                              : timeLineStyle({
                                  isTimeLine: timeline === 3,
                                })
                          }
                          mb={'57px'}>
                          <Text>3</Text>
                        </Box>
                        <Box
                          style={
                            timeline < 4
                              ? circleStyle
                              : timeLineStyle({
                                  isTimeLine: timeline === 4,
                                })
                          }
                          mb={'57px'}>
                          <Text>4</Text>
                        </Box>
                        <Box
                          style={
                            timeline < 5
                              ? circleStyle
                              : timeLineStyle({
                                  isTimeLine: timeline === 5,
                                })
                          }
                          mb={'117px'}>
                          <Text>5</Text>
                        </Box>
                        <Box
                          style={
                            timeline < 6
                              ? circleStyle
                              : timeLineStyle({
                                  isTimeLine: timeline === 6,
                                })
                          }
                          mb={'57px'}>
                          <Text>6</Text>
                        </Box>
                        <Box
                          style={
                            timeline < 7
                              ? circleStyle
                              : timeLineStyle({
                                  isTimeLine: timeline === 7,
                                })
                          }
                          mb={'124px'}>
                          <Text>7</Text>
                        </Box>
                        <Box
                          style={
                            timeline < 8
                              ? circleStyle
                              : timeLineStyle({
                                  isTimeLine: timeline === 8,
                                })
                          }>
                          <Text>8</Text>
                        </Box>
                      </Flex>
                      <Flex></Flex>
                    </Flex>
                    <Box
                      w={'4px'}
                      h={'700px'}
                      left={'50%'}
                      bg={'#e7edf3'}
                      borderRadius={100}
                      pos={'absolute'}></Box>
                    <Box
                      w={'4px'}
                      h={
                        timeline === 0
                          ? '0px'
                          : timeline === 1
                          ? '54px'
                          : timeline === 2
                          ? '135px'
                          : timeline === 3
                          ? '218px'
                          : timeline === 4
                          ? '298px'
                          : timeline === 5
                          ? '415px'
                          : timeline === 6
                          ? '520px'
                          : timeline === 7
                          ? '635px'
                          : '700px'
                      }
                      left={'50%'}
                      bg={'#0070ed'}
                      borderRadius={100}
                      pos={'absolute'}></Box>
                  </Flex>
                </Flex>
                <Flex flexDir="column">
                  <Flex style={titleStyle} alignItems="center" mb={'20px'}>
                    <Text>Round 1</Text>
                  </Flex>
                  <Box>
                    <CustomFieldWithTime
                      name={'snapshot'}
                      title={'1. Snapshot Timestamp'}
                      w={'200px'}
                      placeHolder={'MM/DD/YYYY'}></CustomFieldWithTime>
                  </Box>
                  <Box>
                    <CustomFieldWithTime
                      name={'startAddWhiteTime'}
                      title={'2. AddWhiltelist Start Time'}
                      w={'200px'}
                      placeHolder={'MM/DD/YYYY'}></CustomFieldWithTime>
                  </Box>
                  <Box>
                    <CustomFieldWithTime
                      name={'endAddWhiteTime'}
                      title={'3. EndWhitelist End Time'}
                      w={'200px'}
                      placeHolder={'MM/DD/YYYY'}></CustomFieldWithTime>
                  </Box>
                  <Box>
                    <CustomFieldWithTime
                      name={'startExclusiveTime'}
                      title={'4. Exclusive Start Time'}
                      w={'200px'}
                      placeHolder={'MM/DD/YYYY'}></CustomFieldWithTime>
                  </Box>
                  <Box>
                    <CustomFieldWithTime
                      name={'endExclusiveTime'}
                      title={'5. Exclusive End Time'}
                      w={'200px'}
                      placeHolder={'MM/DD/YYYY'}></CustomFieldWithTime>
                  </Box>
                  <Flex
                    style={titleStyle}
                    alignItems="center"
                    mt={'20px'}
                    mb={'20px'}>
                    <Text>Round 2</Text>
                  </Flex>
                  <Box>
                    <CustomFieldWithTime
                      name={'startDepositTime'}
                      title={'6. Deposit Start Time'}
                      w={'200px'}
                      placeHolder={'MM/DD/YYYY'}></CustomFieldWithTime>
                  </Box>
                  <Box>
                    <CustomFieldWithTime
                      name={'endDepositTime'}
                      title={'7. Deposit End Time'}
                      w={'200px'}
                      placeHolder={'MM/DD/YYYY'}></CustomFieldWithTime>
                  </Box>
                  <Flex
                    style={titleStyle}
                    alignItems="center"
                    mt={'20px'}
                    mb={'20px'}>
                    <Text>Vesting</Text>
                  </Flex>
                  <Box>
                    <CustomFieldWithTime
                      name={'startClaimTime'}
                      title={'8. Claim Start Time'}
                      w={'200px'}
                      placeHolder={'MM/DD/YYYY'}></CustomFieldWithTime>
                  </Box>
                  <Box>
                    <CustomField
                      name={'claimInterval'}
                      title={'Claim Intervals (sec)'}
                      w={'200px'}></CustomField>
                  </Box>
                  <Box>
                    <CustomField
                      name={'claimPeriod'}
                      title={'Claim count'}
                      w={'300px'}></CustomField>
                  </Box>
                  <Box>
                    <CustomField
                      name={'claimFirst'}
                      title={'Percentage of claims in the first round'}
                      w={'300px'}
                      placeHolder={
                        'input percentage of claims in the first round'
                      }></CustomField>
                  </Box>
                </Flex>
              </Flex>
            </Flex>
            <Flex
              // pos="absolute"
              w={'100%'}
              mt={'30px'}
              mb={'40px'}
              // bottom={'35px'}
              justifyContent="center">
              <Button
                w={'150px'}
                h={'38px'}
                br={4}
                bg={'blue.500'}
                color={'white.100'}
                mr={'12px'}
                onClick={() => handlePrevStep()}
                _hover={{}}>
                Prev
              </Button>
              <Button
                {...(!isValid
                  ? {...btnStyle.btnDisable({colorMode})}
                  : {...btnStyle.btnAble()})}
                type="submit"
                w={'150px'}
                h={'38px'}
                br={4}
                disabled={!isValid}
                _hover={{}}>
                Next
              </Button>
            </Flex>
            <Flex
              pos="absolute"
              w={'100%'}
              bottom={'-185px'}
              alignItems="center"
              justifyContent="center">
              <SubmitButton
                final={final}
                saveHandleSubmit={saveHandleSubmit}></SubmitButton>
            </Flex>
          </Form>
        );
      }}
    </Formik>
  );
};

export const StepFour: React.FC<
  StepProp & {
    setFinal: Dispatch<SetStateAction<boolean>>;
  }
> = (props) => {
  const {data, lastStep, handleNextStep, handlePrevStep, setFinal, final} =
    props;
  // const {colorMode} = useColorMode();

  const handleSubmit = (values: any) => {
    handleNextStep(values, lastStep);
  };

  const saveHandleSubmit = (values: AdminObject) => {
    handleNextStep(values, true);
  };

  const names = [
    'tokenName',
    'tokenAddress',
    'tokenSymbol',
    'tokenSymbolImage',
    'tokenAllocationAmount',
    'tokenFundRaisingTargetAmount',
    'fundingTokenType',
    'tokenFundingRecipient',
    'projectTokenRatio',
    'projectFundingTokenRatio',
  ];

  const obj = {};

  names.map((name: string) => {
    //@ts-ignore
    const nameType = typeof data[name];
    // const isRequired =
    //   name === 'name' || name === 'description' || name === 'adminAddress';
    // if (!isRequired) {
    //   return null;
    // }
    if (nameType === 'string') {
      //@ts-ignore
      return (obj[name] = Yup.string().required().label(name));
    }
    if (nameType === 'number') {
      //@ts-ignore
      return (obj[name] = Yup.number().required().label(name));
    }
    //@ts-ignore
    return (obj[name] = Yup.boolean().required().label(name));
  });

  const stepOneValidationSchema = Yup.object({
    ...obj,
  });

  useEffect(() => {
    setFinal(true);
  }, []);

  return (
    <Formik
      enableReinitialize
      validationSchema={stepOneValidationSchema}
      initialValues={data}
      validateOnMount={true}
      onSubmit={handleSubmit}>
      {({isValid, setFieldValue, isValidating, values}) => {
        const {position, production, topSlideExposure} = values;
        return (
          <Form
            style={{
              display: 'flex',
              // width: '120%',
              // height: '800px',
              position: 'relative',
              flexDirection: 'column',
              justifyContent: 'space-between',
              // borderTop: '1px solid #f4f6f8',
            }}>
            <Line />
            <Flex mt={'40px'}>
              <Flex flexDir={'column'} mr={'50px'}>
                <Text style={fieldWrap} mb={'10px'}>
                  Position
                </Text>
                <Select
                  w={'200px'}
                  h={'32px'}
                  iconColor={'#dfe4ee'}
                  fontSize={13}
                  value={position}
                  style={{paddingLeft: '15px', paddingTop: '3px'}}
                  onChange={(e) => {
                    const position = e.target.value;
                    setFieldValue('position', position);
                  }}>
                  <option value="">None</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                </Select>
              </Flex>
              <Flex flexDir={'column'} mr={'50px'}>
                <Text style={fieldWrap} mb={'10px'}>
                  Production
                </Text>
                <Select
                  w={'200px'}
                  h={'32px'}
                  iconColor={'#dfe4ee'}
                  fontSize={13}
                  value={production}
                  style={{paddingLeft: '15px', paddingTop: '3px'}}
                  onChange={(e) => {
                    const production = e.target.value;
                    setFieldValue('production', production);
                  }}>
                  <option value="">None</option>
                  <option value="dev">Dev</option>
                  <option value="production">Production</option>
                </Select>
              </Flex>
              <Flex flexDir={'column'} mr={'50px'}>
                <Text style={fieldWrap} mb={'10px'}>
                  Top Slide Exposure
                </Text>
                <Checkbox
                  w={'18px'}
                  h={'18px'}
                  pt={'15px'}
                  isChecked={topSlideExposure}
                  borderRadius={'4px'}
                  onChange={(e) => {
                    setFieldValue('topSlideExposure', e.target.checked);
                  }}></Checkbox>
              </Flex>
            </Flex>

            <Flex
              // pos="absolute"
              w={'100%'}
              mt={'30px'}
              mb={'40px'}
              // bottom={'35px'}
              justifyContent="center">
              <Button
                w={'150px'}
                h={'38px'}
                br={4}
                bg={'blue.500'}
                color={'white.100'}
                mr={'12px'}
                onClick={() => handlePrevStep()}
                _hover={{}}>
                Prev
              </Button>
            </Flex>
            <Flex
              pos="absolute"
              w={'100%'}
              bottom={'-111px'}
              alignItems="center"
              justifyContent="center">
              <SubmitButton
                final={final}
                saveHandleSubmit={saveHandleSubmit}></SubmitButton>
            </Flex>
          </Form>
        );
      }}
    </Formik>
  );
};
