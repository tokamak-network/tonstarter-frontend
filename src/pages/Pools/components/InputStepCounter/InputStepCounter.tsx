import { useState, useCallback, useEffect, ReactNode } from 'react'
// import { OutlineCard } from 'components/Card'
import { Input as NumericalInput } from '../NumericalInput'
import styled, { keyframes } from 'styled-components/macro'
import { TYPE } from 'theme'
import { ButtonStep } from '../Button'
import { FeeAmount } from '@uniswap/v3-sdk'
import { Text, Flex } from '@chakra-ui/react'
import minus_icon_Normal from 'assets/svgs/minus_icon_Normal.svg';
import Plus_icon_Normal from 'assets/svgs/Plus_icon_Normal.svg';


const pulse = (color: string) => keyframes`
  0% {
    box-shadow: 0 0 0 0 ${color};
  }

  70% {
    box-shadow: 0 0 0 2px ${color};
  }

  100% {
    box-shadow: 0 0 0 0 ${color};
  }
`

const SmallButton = styled(ButtonStep)`
  padding: 4px;
`

const StyledInput = styled(NumericalInput)<{ usePercent?: boolean }>`
  background-color: transparent;
  text-align: center;
  width: 100%;
  font-weight: 500;
  padding: 0 10px;
`

const ButtonLabel = styled(TYPE.white)<{ disabled: boolean }>`
  color: ${({ theme, disabled }) => (disabled ? theme.text2 : theme.text1)} !important;
`

const borderLineStyle = '1px solid #d7d9df';

interface StepCounterProps {
  value: string
  onUserInput: (value: string) => void
  decrement: () => string
  increment: () => string
  decrementDisabled?: boolean
  incrementDisabled?: boolean
  feeAmount?: FeeAmount
  label?: string
  width?: string
  locked?: boolean // disable input
  title: ReactNode
  tokenA: string | undefined
  tokenB: string | undefined
}

const StepCounter = ({
  value,
  decrement,
  increment,
  decrementDisabled = false,
  incrementDisabled = false,
  width,
  locked,
  onUserInput,
  title,
  tokenA,
  tokenB,
}: StepCounterProps) => {
  //  for focus state, styled components doesnt let you select input parent container
  const [active, setActive] = useState(false)

  // let user type value and only update parent value on blur
  const [localValue, setLocalValue] = useState('')
  const [useLocalValue, setUseLocalValue] = useState(false)

  // animation if parent value updates local value
  const [pulsing, setPulsing] = useState<boolean>(false)

  const handleOnFocus = () => {
    setUseLocalValue(true)
    setActive(true)
  }

  const handleOnBlur = useCallback(() => {
    setUseLocalValue(false)
    setActive(false)
    onUserInput(localValue) // trigger update on parent value
  }, [localValue, onUserInput])

  // for button clicks
  const handleDecrement = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(decrement())
  }, [decrement, onUserInput])

  const handleIncrement = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(increment())
  }, [increment, onUserInput])

  useEffect(() => {
    if (localValue !== value && !useLocalValue) {
      setTimeout(() => {
        setLocalValue(value) // reset local value to match parent
        setPulsing(true) // trigger animation
        setTimeout(function () {
          setPulsing(false)
        }, 1800)
      }, 0)
    }
  }, [localValue, useLocalValue, value])

  return (
    <Flex
      w={230}
      h={'78px'}
      pulsing={pulsing}
      active={active}
      onFocus={handleOnFocus}
      onBlur={handleOnBlur}
      border={borderLineStyle}
      borderRadius={10}
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      pl={15}
      pr={15}>
      <Flex flexDir="column" gap="6px">
        <Text fontSize={12} textAlign="center">
          {title}
        </Text>

        <Flex justifyContent="space-around" alignItems="center">
          {!locked && (
            <SmallButton onClick={handleDecrement} disabled={decrementDisabled}>
              <ButtonLabel disabled={decrementDisabled} fontSize="12px">
                <img src={minus_icon_Normal} alt="plus_icon" />
              </ButtonLabel>
            </SmallButton>
          )}

          <StyledInput
            className="rate-input-0"
            value={localValue}
            fontSize="20px"
            disabled={locked}
            onUserInput={(val) => {
              setLocalValue(val)
            }}
          />

          {!locked && (
            <SmallButton onClick={handleIncrement} disabled={incrementDisabled}>
              <ButtonLabel disabled={incrementDisabled} fontSize="12px">
                <img src={Plus_icon_Normal} alt="plus_icon" />
              </ButtonLabel>
            </SmallButton>
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default StepCounter
