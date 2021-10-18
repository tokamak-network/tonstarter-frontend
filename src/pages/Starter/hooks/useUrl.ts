import {ProjectStatus} from '@Starter/types';
import {useRouteMatch} from 'react-router';

export const useUrl: () => {projectStatus: ProjectStatus} = () => {
  const match = useRouteMatch();
  const {url} = match;
  //   if (url.split('/')[2] !== 'active' || 'upcoming' || 'past') {
  //     return console.error('url couldnt go for parsing');
  //   }
  const projectStatus: ProjectStatus = url.split('/')[2] as ProjectStatus;

  return {projectStatus};
};
