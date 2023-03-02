
//Unit Test Code
import { shallow, mount } from 'enzyme';
import React from 'react';
import {Grid, GridItem} from '@chakra-ui/react';
import {changeVault} from '@Launch/launch.reducer';
import {Projects, VaultCommon} from '@Launch/types';
import {saveProject} from '@Launch/utils/saveProject';
import {useFormikContext} from 'formik';
import {useAppDispatch} from 'hooks/useRedux';
import {useActiveWeb3React} from 'hooks/useWeb3';
import DeployToken from '../../components/stepThree/DeployContainer';
import DeployVault from '../../components/stepThree/DeployVault';
import DeployContainer from '../../components/stepThree/DeployContainer';

 describe('<DeployContainer />', () => {

    let wrapper: any; 

    beforeEach(() => { 

        wrapper = shallow(<DeployContainer />); 

    }); 

    it('should render a <Grid />', () => { 

        expect(wrapper.find(Grid)).toHaveLength(1); 

    }); 

    it('should render a <GridItem />', () => { 

        expect(wrapper.find(GridItem)).toHaveLength(1); 

    }); 

    it('should render a <DeployToken />', () => { 

        expect(wrapper.find(DeployToken)).toHaveLength(1); 

    });  

    it('should render a <DeployVault />', () => {  

        expect(wrapper.find(DeployVault)).toHaveLength(1);  

     });  
});