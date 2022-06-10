import {Text, Flex, Tooltip, useTheme, Placement} from '@chakra-ui/react';
import React, {ReactNode} from 'react';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';
import tooltipIconImportant from 'assets/launch/warning-curcle-icon.svg';

type CustomTooltipProp = {
  component?: ReactNode;
  toolTipW: number;
  toolTipH: string;
  msg: string[];
  fontSize?: string;
  placement?: Placement;
  children?: React.ReactNode;
  important?: boolean;
  style?: {};
};

const tooltipMsg = (msg: CustomTooltipProp['msg']) => {
  return (
    <Flex flexDir="column" fontSize="12px" pt="6px" pl="5px" pr="5px" py="6px">
      {msg.map((text: string) => (
        <Text
          textAlign="center"
          fontSize="12px"
          color={text.charAt(0) !== '!' ? '#FFFFFF' : '#ff3b3b'}>
          {text !== '<br />' ? (
            text.charAt(0) !== '!' ? (
              text
            ) : (
              text.substring(1)
            )
          ) : (
            <div style={{height: '12px'}}></div>
          )}
        </Text>
      ))}
    </Flex>
  );
};

export const CustomTooltip = (prop: CustomTooltipProp) => {
  const {
    component,
    toolTipW,
    toolTipH,
    msg,
    fontSize,
    placement,
    style,
    important,
  } = prop;
  const theme = useTheme();

  return (
    <Tooltip
      hasArrow
      placement={placement || 'bottom'}
      maxW={toolTipW}
      w={toolTipW}
      h={toolTipH}
      label={tooltipMsg(msg)}
      color={theme.colors.white[100]}
      bg={theme.colors.gray[375]}
      p={0}
      borderRadius={3}
      fontSize={fontSize || '12px'}
      {...style}>
      {component || (
        <img
          src={important ? tooltipIconImportant : tooltipIcon}
          alt="tooltip icon"
        />
      )}
    </Tooltip>
  );
};
