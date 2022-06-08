import {Box, Flex, Input, Text, useColorMode} from '@chakra-ui/react';
import {Projects} from '@Launch/types';
import {ErrorMessage, Field, useFormikContext} from 'formik';
import './input.css';

type InputComponentProps = {
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

const InputComponent: React.FC<InputComponentProps> = (props) => {
  const {name, nameDisplay, inputStyle, requirement} = props;
  const {errors, values} = useFormikContext<Projects['CreateProject']>();
  const {colorMode} = useColorMode();
  const title = name
    .split(/(?=[A-Z])/)
    .map((e) => `${e.charAt(0).toUpperCase() + e.slice(1)} `);

  const getTitleTried = () => {
    const titleTrimed = title.toString().replaceAll(',', '');
    switch (titleTrimed) {
      case 'Owner ':
        return 'Account Address';
      default:
        return titleTrimed;
    }
  };

  // //@ts-ignore
  // console.log(errors[name]);

  const titleTrimed = getTitleTried();

  return (
    <Flex flexDir={'column'} fontSize={13} pos={'relative'}>
      {nameDisplay === false ? (
        <></>
      ) : (
        <Flex justifyContent={'space-between'}>
          <Flex>
            <Text h={18} mb={2.5} color={InputComponentStyle.color[colorMode]}>
              {title}
            </Text>
            {requirement && (
              <Text ml={'5px'} color={'#FF3B3B'}>
                *
              </Text>
            )}
          </Flex>
          {name === 'projectName' && (
            <Text color={'#86929d'} fontSize={10}>
              {values.projectName && 20 - values.projectName?.length} characters
              remaining
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
          const isError = errors[name] === undefined ? false : true;

          if (name === 'sector') {
            return (
              <select
                style={{
                  height: '32px',
                  border: '1px solid #dfe4ee',
                  borderRadius: '4px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                }}>
                <option>DeFi</option>
                <option>Exchange</option>
                <option>P2E</option>
                <option>M2E</option>
                <option>Stable</option>
                <option>Social</option>
                <option>Collectible</option>
                <option>Marketplace</option>
                <option>Custom</option>
              </select>
            );
          }

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
              placeholder={`Input ${titleTrimed}`}
              {...inputStyle}></Input>
          );
        }}
      </Field>
      <Box
        pos={'absolute'}
        right={0}
        w={'50%'}
        bg={colorMode === 'light' ? 'white.100' : '#222222'}
        textAlign={'right'}>
        <ErrorMessage
          name={name}
          render={(msg) => (
            <Text color={'red.100'}>{`Invalid ${titleTrimed}`}</Text>
          )}></ErrorMessage>
      </Box>
    </Flex>
  );
};

export default InputComponent;
