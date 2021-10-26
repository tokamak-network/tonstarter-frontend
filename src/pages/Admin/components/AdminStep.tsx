import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {
  Flex,
  Box,
  Text,
  useColorMode,
  useTheme,
  Button,
} from '@chakra-ui/react';
import {AdminObject} from '@Admin/types';
import {Dispatch, SetStateAction, useState} from 'react';

type StepProp = {
  data: AdminObject;
  lastStep: boolean;
  handleNextStep: Dispatch<SetStateAction<any>> | any;
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

const CustomTextAreaField = (props: {name: string; title?: string}) => {
  const {name, title} = props;
  return (
    <Flex style={fieldWrap} flexDir="column" mb={'20px'} pos="relative">
      <Text mb={'10px'}>{title || name}</Text>
      <Field
        name={name}
        as="textarea"
        style={{
          width: '327px',
          height: '112px',
          border: '1px solid #dfe4ee',
          borderRadius: 4,
          paddingLeft: '15px',
        }}
      />
      <Box color="red" pos="absolute" bottom={-5}>
        <ErrorMessage name={name} />
      </Box>
    </Flex>
  );
};

const CustomField = (props: {name: string; title?: string}) => {
  const {name, title} = props;
  return (
    <Flex style={fieldWrap} flexDir="column" mb={'20px'} pos="relative">
      <Text mb={'10px'}>{title || name}</Text>
      <Field style={fieldStyle} name={name} placeHolder={`input ${name}`} />
      <Box color="red" pos="absolute" bottom={-5}>
        <ErrorMessage name={name} />
      </Box>
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
  const {data, lastStep, handleNextStep} = props;

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
    'tokenFundingRecipient',
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
            <CustomField name={'tokenName'} title={'Token Name'}></CustomField>
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
            Prev
          </Button>
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
