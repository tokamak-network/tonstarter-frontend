import React, { useCallback } from 'react'
import { Price, Currency } from '@uniswap/sdk-core'
import { Input, Text, Box, useTheme } from '@chakra-ui/react'

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

export const SwapCurrencyPanel = React.memo(function InnerInput({
  value,
  onUserInput,
} : {
  value: string | number
  onUserInput: (input: string) => void
  error?: boolean
} & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) {
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' ) {
      onUserInput(nextUserInput)
    }
  }
  console.log(value)

  return (
    <Input 
      value={value}
      width={'xs'}
      mr={6}
      variant={'outline'}
      borderWidth={0}
      textAlign={'center'}
      fontWeight={'bold'}
      fontSize={'4xl'}
      onChange={(event) => {
        enforcer(event.target.value.replace(/,/g, '.'))
      }}
    />
  )
})

export default Input