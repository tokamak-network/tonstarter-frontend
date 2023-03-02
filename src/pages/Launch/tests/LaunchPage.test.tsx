
// Unit Test Code

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import LaunchPage from '../LaunchPage';
import { useModal } from 'hooks/useModal';
import { useActiveWeb3React } from 'hooks/useWeb3';
import { injected } from 'connectors';

jest.mock('hooks/useModal');
jest.mock('hooks/useWeb3');

  describe('Launch Page', () => {

    it('should render the page header', () => {
      const { getByText } = render(<LaunchPage numPairs={2} />);

      expect(getByText('Launch')).toBeInTheDocument();
    });

    it('should render the create project button', () => {
      const { getByText } = render(<LaunchPage numPairs={2} />);

      expect(getByText('Create Project')).toBeInTheDocument();
    });

    it('should open metamask if not installed', () => { 

      window.open = jest.fn(); 

      const { getByText } = render(<LaunchPage numPairs={2} />); 

      fireEvent.click(getByText("Create Project")); 

      expect(window.open).toHaveBeenCalledWith("https://metamask.io/download/"); 

    }); 

    it('should activate web3 if not active', () => { 

      (useActiveWeb3React as jest.Mock).mockReturnValue({active: false, activate: jest.fn(), connector: null}); 

      const { getByText } = render(<LaunchPage numPairs={2} />); 

      fireEvent.click(getByText("Create Project")); 

      expect((useActiveWeb3React as jest.Mock).mockReturnValue().activate).toHaveBeenCalledWith(injected);  

    });  

    it('should open confirm terms modal if web3 is active', () => {  
       (useActiveWeb3React as jest