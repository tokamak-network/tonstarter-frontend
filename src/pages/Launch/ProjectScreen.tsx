import { Flex, Box, Text } from "@chakra-ui/react";
import {useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {PageHeader} from 'components/PageHeader';
import { Project } from "./components/Projects/Project";
const ProjectScreen = () => {
    return (
        <Flex  flexDir={'column'}
        justifyContent={'center'}
        w={'100%'}
        mt={100}
        mb={'100px'}>
 <Flex alignItems={'center'} flexDir="column" mb={'20px'}>
        <PageHeader
          title={'Project'}
          subtitle={'Make Your Own Token and Create Token Economy'}
        />
        <Flex mt={'60px'} mb={'20px'}>
         <Project name={'Project Name'}/>
        </Flex>
      </Flex>
        </Flex>
    )
}

export default ProjectScreen;