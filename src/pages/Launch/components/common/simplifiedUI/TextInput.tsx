import {Box, Flex, Input, Select, Text, useColorMode} from '@chakra-ui/react';
import {Projects} from '@Launch/types';
import {ErrorMessage, Field, useFormikContext} from 'formik';
import {useState} from 'react';
import '../input.css';

type TextInputProps = {
  name: string;
  placeHolder: string;
  nameDisplay?: boolean;
  inputStyle?: {};
  requirement?: boolean;
};

const InputComponentStyle = {
  color: {
    light: '#2d3136',
    dark: '#f3f4f1',
  },
};

const getMaxLength = (name: string) => {
  switch (name) {
    case 'projectName':
      return 20;
    case 'tokenSymbol':
      return 8;
    case 'tokenName':
      return 8;
    default:
      return 'none';
  }
};

const getPlaceHolder = (name: string) => {
  switch (name) {
    case 'Token Symbol Image ':
      return 'Token symbol image URL here';
    default:
      return `Input ${name}`;
  }
};

const TextInput: React.FC<TextInputProps> = (props) => {
  const {name, nameDisplay, inputStyle, requirement} = props;
  const {errors, values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();
  const {colorMode} = useColorMode();
  const title = name
    .split(/(?=[A-Z])/)
    .map((e) => `${e.charAt(0).toUpperCase() + e.slice(1)} `);

  const getTitleTried = () => {
    const titleTrimed = title.toString().replaceAll(',', '');
    return titleTrimed;
  };

  const titleTrimed = getTitleTried();

  return (
    <Flex flexDir={'column'} fontSize={13} pos={'relative'}>
      {nameDisplay === false ? (
        <></>
      ) : (
        <Flex justifyContent={'space-between'}>
          <Flex>
            {requirement && (
              <Text mr={'5px'} color={'#FF3B3B'}>
                *
              </Text>
            )}
            <Text h={18} mb={2.5} color={InputComponentStyle.color[colorMode]}>
              {title}
            </Text>
          </Flex>
          {name === 'projectName' && (
            <Text color={colorMode === 'dark'?'#949494' : '#86929d'} fontSize={10}>
              {(values.projectName && 20 - values.projectName?.length) || 20}{' '}
              characters remaining
            </Text>
          )}
        </Flex>
      )}
      <Field name={name}>
        {(
          //@ts-ignore
          {field, meta: {touched, error}},
        ) => {
          //@ts-ignore
          const isError = errors[name] === '' ? false : true;

          return (
            <Input
              className={
                isError
                  ? 'input-err'
                  : colorMode === 'light'
                  ? 'input-light'
                  : 'input-dark'
              }
              borderRadius={4}
              maxLength={getMaxLength(name)}
              fontSize={13}
              {...field}
              id={name}
              h={'32px'}
              _focus={{}}
              placeholder={`${getPlaceHolder(titleTrimed)}`}
              {...inputStyle}></Input>
          );
        }}
      </Field>
      {name === 'tokenSymbolImage' ? (<Box
        pos={'absolute'}
        right={0}
        w={'40%'}
        bg={colorMode === 'light' ? 'white.100' : '#222222'}
        textAlign={'right'}>
        <ErrorMessage
          name={name}
          render={(msg) => (
            <Text color={'red.100'}>{'Invalid URL'}</Text>
          )}></ErrorMessage>
      </Box>):
       (<Box
        pos={'absolute'}
        right={0}
        w={'55%'}
        bg={colorMode === 'light' ? 'white.100' : '#222222'}
        textAlign={'right'}>
        <ErrorMessage
          name={name}
          render={(msg) => (
            <Text color={'red.100'}>{`Invalid ${titleTrimed}`}</Text>
          )}></ErrorMessage>
      </Box>)}
    </Flex>
  );
};

export default TextInput;
