import {Text, useColorMode, Flex} from '@chakra-ui/react';
import {useRef, Dispatch, SetStateAction} from 'react';

type TabsProp = {
  list: string[];
  setValue: Dispatch<SetStateAction<any>>;
  w?: string;
  h?: string;
};

const themeDesign = {
  border: {
    light: 'solid 1px #d7d9df',
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
};

export const CustomTabs = (prop: TabsProp) => {
  const {list, setValue, w, h} = prop;
  const {colorMode} = useColorMode();
  const focusTarget = useRef<any>([]);

  const changeBorderColor = (index: any) => {
    const {current} = focusTarget;
    current.map((e: any) => (e.style.border = 'solid 1px #d7d9df'));
    current[index].style.border = 'solid 1px #2a72e5';
    setValue(current[index].id);
  };

  return (
    <Flex
      fontSize={'0.750em'}
      cursor={'pointer'}
      alignItems="center"
      justifyContent="center">
      {list.map((text, index) => (
        <Text
          w={w}
          h={h}
          id={text}
          key={index}
          ref={(el) => (focusTarget.current[index] = el)}
          borderTop={themeDesign.border[colorMode]}
          borderBottom={themeDesign.border[colorMode]}
          borderLeft={index !== 0 ? '' : themeDesign.border[colorMode]}
          borderLeftRadius={index === 0 ? 4 : 0}
          borderRightRadius={index === list.length - 1 ? 4 : 0}
          borderRight={themeDesign.border[colorMode]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => {
            changeBorderColor(index);
          }}>
          {text}
        </Text>
      ))}
    </Flex>
  );
};
