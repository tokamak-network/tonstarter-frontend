import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  useFormikContext,
  getIn,
} from 'formik';
import * as Yup from 'yup';
import {Flex, Box, Text, Button} from '@chakra-ui/react';
import {AdminObject} from '@Admin/types';
import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {CustomButton} from 'components/Basic/CustomButton';
import {LibraryType} from 'types';
import {getTotalExpectSaleAmount} from '../utils/fetchContract';
import {CustomTooltip} from 'components/Tooltip';
import {convertTimeStamp} from 'utils/convertTIme';
import WatchImg from 'assets/svgs/poll-time-active-icon.svg';

type StepProp = {
  data: AdminObject;
  lastStep: boolean;
  handleNextStep: Dispatch<SetStateAction<any>> | any;
  handlePrevStep?: Dispatch<SetStateAction<any>> | any;
  library?: LibraryType;
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

const TimeSetting = (props: {timeStamp: number | ''}) => {
  const {timeStamp} = props;
  console.log(timeStamp);
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
        <Field
          style={{...fieldStyle, width: w || '327px'}}
          name={name}
          placeHolder={placeHolder || `input ${name}`}
        />
      </Flex>
      <TimeSetting
        timeStamp={
          fieldValue === '' ? fieldValue : Number(fieldValue)
        }></TimeSetting>
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
  const {data, lastStep, handleNextStep} = props;

  const handleSubmit = (values: any) => {
    handleNextStep(values, lastStep);
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
      validationSchema={stepOneValidationSchema}
      initialValues={data}
      onSubmit={handleSubmit}>
      {({isValid}) => (
        <Form
          style={{
            display: 'flex',
            width: '100%',
            height: '520px',
            position: 'relative',
            justifyContent: 'space-between',
          }}>
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
          <Button
            pos="absolute"
            bottom={'40px'}
            type="submit"
            alignSelf="center"
            w={'150px'}
            h={'38px'}
            br={4}
            bg={'blue.500'}
            color={'white.100'}
            disabled={!isValid}
            _hover={{}}>
            Next
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export const StepTwo: React.FC<StepProp> = (props) => {
  const {data, lastStep, handleNextStep, handlePrevStep} = props;

  const handleSubmit = (values: any) => {
    handleNextStep(values, lastStep);
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

  console.log(stepOneValidationSchema);

  const titleStyle = {
    color: 'black.300',
    fontSize: 15,
  };

  return (
    <Formik
      validationSchema={stepOneValidationSchema}
      initialValues={data}
      onSubmit={handleSubmit}>
      {({isValid}) => (
        <Form
          style={{
            display: 'flex',
            width: '100%',
            height: '850px',
            position: 'relative',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
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
                <CustomField
                  name={'tokenSymbolImage'}
                  title={'Token Symbol Image'}></CustomField>
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
                <CustomField
                  name={'fundingTokenType'}
                  title={'Token Name'}></CustomField>
                <CustomField
                  name={'tokenFundRaisingTargetAmount'}
                  title={'tokenFundRaisingTargetAmount'}></CustomField>
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
            pos="absolute"
            bottom={'40px'}
            alignItems="center"
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
              type="submit"
              alignSelf="center"
              w={'150px'}
              h={'38px'}
              br={4}
              bg={'blue.500'}
              color={'white.100'}
              disabled={!isValid}
              _hover={{}}>
              Next
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

export const StepThree: React.FC<StepProp> = (props) => {
  const {lastStep, handleNextStep, handlePrevStep, library} = props;

  const [timeline, setTimeline] = useState<
    0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  >(0);

  const handleSubmit = (values: any) => {
    handleNextStep(values, lastStep);
  };

  const [data, setData] = useState({
    saleContractAddress: '',
    snapshot: '',
    startAddWhiteTime: '',
    endAddWhiteTime: '',
    startExclusiveTime: '',
    endExclusiveTime: '',
    startDepositTime: '',
    endDepositTime: '',
    startClaimTime: '',
    claimInterval: '',
    claimPeriod: '',
    claimFirst: '',
  });

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

  async function getFetch() {
    const res = await getTotalExpectSaleAmount({
      library,
      address: '0x865200f8172bf55f99b53A8fa0E26988b94dfBbE',
    });
    if (res) {
      console.log(res);
      setData({...res, saleContractAddress: 'test'});
      checkTimeLine(res);
    }
  }

  function checkTimeLine(data: any) {
    console.log('data');
    console.log(data);
    for (const [key, value] of Object.entries(data)) {
      if (key === 'snapshot' && value === '') {
        return setTimeline(1);
      }
      if (key === 'startAddWhiteTime' && value === '') {
        return setTimeline(2);
      }
      if (key === 'endAddWhiteTime' && value === '') {
        return setTimeline(3);
      }
      if (key === 'startExclusiveTime' && value === '') {
        return setTimeline(4);
      }
      if (key === 'endExclusiveTime' && value === '') {
        return setTimeline(5);
      }
      if (key === 'startDepositTime' && value === '') {
        return setTimeline(6);
      }
      if (key === 'endDepositTime' && value === '') {
        return setTimeline(7);
      }
      if (key === 'endDepositTime' && value === '') {
        return setTimeline(7);
      }
      if (key === 'startClaimTime' && value === '') {
        return setTimeline(8);
      }
      if (key === 'claimInterval' && value === '') {
        return setTimeline(8);
      }
      if (key === 'claimPeriod' && value === '') {
        return setTimeline(8);
      }
      if (key === 'claimFirst' && value === '') {
        return setTimeline(8);
      }
      return setTimeline(9);
    }
  }

  return (
    <Formik
      enableReinitialize
      validationSchema={stepOneValidationSchema}
      initialValues={data}
      onSubmit={handleSubmit}>
      {({isValid}) => (
        <Form
          style={{
            display: 'flex',
            width: '100%',
            height: '1300px',
            position: 'relative',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
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
                  func={() => getFetch()}></CustomButton>
              </Box>
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
                    name={'endExclusiveTime'}
                    title={'6. Deposit Start Time'}
                    w={'200px'}
                    placeHolder={'MM/DD/YYYY'}></CustomFieldWithTime>
                </Box>
                <Box>
                  <CustomFieldWithTime
                    name={'endExclusiveTime'}
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
                    name={'endExclusiveTime'}
                    title={'Claim Intervals (sec)'}
                    w={'200px'}></CustomField>
                </Box>
                <Box>
                  <CustomField
                    name={'endExclusiveTime'}
                    title={'Claim count'}
                    w={'300px'}></CustomField>
                </Box>
                <Box>
                  <CustomField
                    name={'endExclusiveTime'}
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
            pos="absolute"
            bottom={'40px'}
            alignItems="center"
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
        </Form>
      )}
    </Formik>
  );
};
