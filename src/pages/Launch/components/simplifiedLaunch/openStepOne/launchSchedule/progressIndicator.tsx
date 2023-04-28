import {Box, Flex, useColorMode, Progress} from '@chakra-ui/react';
import React from 'react';

type ProgressIndicatorProps = {
  launchSteps: string[];
  currentStep: number;
  maxStep: number;
  isListed: boolean;
  isSnapshotPassed: boolean | number | undefined;
  isWhitelistPassed: boolean | number | undefined;
  isPublicSale1Passed: boolean | number | undefined;
  isPublicSale2Passed: boolean | number | undefined;
  isVesting1Passed: boolean | number | undefined;
  isVesting2Passed: boolean | number | undefined;
  isVesting3Passed: boolean | number | undefined;
  isVesting4Passed: boolean | number | undefined;
};

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = (props) => {
  const {
    launchSteps,
    currentStep,
    maxStep,
    isListed,
    isSnapshotPassed,
    isWhitelistPassed,
    isPublicSale1Passed,
    isPublicSale2Passed,
    isVesting1Passed,
    isVesting2Passed,
    isVesting3Passed,
    isVesting4Passed,
  } = props;
  const {colorMode} = useColorMode();

  return (
    <Flex ml={'28px'}>
      {launchSteps.map((step: string, index: number) => {
        const indexNum = index + 1;
        const isStep = currentStep === indexNum;
        const pastStep = currentStep > indexNum || maxStep > indexNum;

        const getLineWidth = () => {
          switch (step) {
            case 'Snapshot': {
              return '84px';
            }

            case 'Whitelist': {
              return '105px';
            }

            case 'Public Sale 1': {
              return '106px';
            }

            case 'Public Sale 2': {
              return '99px';
            }

            case 'Unlock 1': {
              return '98px';
            }

            case 'Unlock ..': {
              return '98px';
            }

            case 'Unlock 7': {
              return '0px';
            }
            default:
              return '0px';
          }
        };

        const isSchedulePassed = (step: string) => {
          switch (step) {
            case 'Snapshot': {
              return isListed && isSnapshotPassed;
            }
            case 'Whitelist': {
              return isListed && isWhitelistPassed;
            }
            case 'Public Sale 1': {
              return isListed && isPublicSale1Passed;
            }

            case 'Public Sale 2': {
              return isListed && isPublicSale2Passed;
            }

              case 'Unlock 1': {
                return isListed && isVesting1Passed;
              }

              case 'Unlock ..': {
                return isListed && isVesting2Passed && isVesting3Passed;
              }

              case 'Unlock 7': {
                return isListed && isVesting4Passed;
              }
            
              default:
              return false;
          }
        };

        return (
          <Flex alignItems="center" textAlign={'center'} key={index}>
            {/* Dot */}
            {index <= 6 && {step} && (
              <Box
                borderRadius={18}
                bg={isSchedulePassed(step) ? '#0070ed' : 'transparent'}
                w={'8px'}
                h={'8px'}
                alignItems="center"
                justifyContent="center"
                border={
                  isSchedulePassed(step)
                    ? ''
                    : colorMode === 'light'
                    ? 'solid 1px #e6eaee'
                    : 'solid 1px #353d48'
                }></Box>
            )}
            {/* Line */}
            {index < 6 && {step} && (
              <Box
                w={getLineWidth()}
                h={'2px'}
                bg={
                  isSchedulePassed(step)
                    ? '#0070ed'
                    : colorMode === 'light'
                    ? '#e7edf3'
                    : '#353d48'
                }
                border={
                  isSchedulePassed(step)
                    ? ''
                    : colorMode === 'light'
                    ? 'solid 1px #e7edf3'
                    : 'solid 1px #353d48'
                }></Box>
            )}
          </Flex>
        );
      })}
    </Flex>
  );
};
