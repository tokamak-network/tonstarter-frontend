import * as React from "react"
import {useColorMode, useTheme} from '@chakra-ui/react';
export const IconMedium = (props: React.SVGProps<SVGSVGElement>) =>{
    const theme = useTheme();
    const {colorMode} = useColorMode();
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    id="prefix__medium-s-icon"
    width={20}
    height={20}
    viewBox="0 0 20 20"
  >
    <defs>
      <style>{`.prefix__cls-2{fill:${colorMode==='light'? '#354052': '#7e8993'}}`}</style>
    </defs>
    <path id="prefix__Base" fill="none" d="M0 0h20v20H0z" />
    <g id="prefix__\uADF8\uB8F9_5284" transform="translate(0 4)">
      <circle
        id="prefix__\uD0C0\uC6D0_1"
        cx={5.677}
        cy={5.677}
        r={5.677}
        className="prefix__cls-2"
      />
      <ellipse
        id="prefix__\uD0C0\uC6D0_2"
        cx={2.775}
        cy={5.313}
        className="prefix__cls-2"
        rx={2.775}
        ry={5.313}
        transform="translate(11.929 .364)"
      />
      <ellipse
        id="prefix__\uD0C0\uC6D0_3"
        cx={1.015}
        cy={4.772}
        className="prefix__cls-2"
        rx={1.015}
        ry={4.772}
        transform="translate(17.97 .905)"
      />
    </g>
  </svg>
  )
}
