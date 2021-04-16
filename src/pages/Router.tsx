import {FC, HTMLAttributes} from 'react';
import {ThemeSwitcher} from 'components/ThemeSwitcher';

export interface RouterProps extends HTMLAttributes<HTMLDivElement> {}

export const Router: FC<RouterProps> = () => {
  return <ThemeSwitcher />;
};
