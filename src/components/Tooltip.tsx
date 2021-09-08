import {Text, Flex, Tooltip, useTheme, Placement} from '@chakra-ui/react';
import React, {ReactNode} from 'react';
type CustomTooltipProp = {
  component: ReactNode;
  toolTipW: number;
  toolTipH: string;
  msg: string[];
  fontSize?: string;
  placement?: Placement;
  children?: React.ReactNode;
};

const tooltipMsg = (msg: CustomTooltipProp['msg']) => {
  return (
    <Flex flexDir="column" fontSize="12px" pt="6px" pl="5px" pr="5px" py="6px">
      {msg.map((text: string) => (
        <Text textAlign="center" fontSize="12px">
          {text}
        </Text>
      ))}
    </Flex>
  );
};

export const CustomTooltip = (prop: CustomTooltipProp) => {
  const {component, toolTipW, toolTipH, msg, fontSize, placement} = prop;
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
      fontSize={fontSize || '12px'}>
      {component}
    </Tooltip>
  );
};
