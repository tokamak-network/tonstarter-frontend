import * as React from "react"
import {useColorMode, useTheme} from '@chakra-ui/react';
export const IconTwitter = (props: React.SVGProps<SVGSVGElement>) =>{
    const theme = useTheme();
    const {colorMode} = useColorMode();
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    viewBox="0 0 20 20"
  >
    <path fill="none" d="M0 0h20v20H0z" />
    <path
      fill={colorMode==='light'? '#354052': '#7e8993'}
      d="M18 5.538a6.517 6.517 0 01-1.885.517 3.294 3.294 0 001.443-1.815 6.575 6.575 0 01-2.085.8 3.286 3.286 0 00-5.594 2.99A9.322 9.322 0 013.113 4.6a3.287 3.287 0 001.016 4.383 3.273 3.273 0 01-1.486-.411v.041a3.284 3.284 0 002.632 3.219 3.3 3.3 0 01-1.482.056 3.287 3.287 0 003.066 2.279 6.586 6.586 0 01-4.076 1.406A6.635 6.635 0 012 15.526 9.3 9.3 0 007.032 17a9.275 9.275 0 009.34-9.338c0-.142 0-.284-.01-.425A6.658 6.658 0 0018 5.538z"
    />
  </svg>
  )
}