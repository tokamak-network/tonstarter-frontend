import { FC, HTMLAttributes } from 'react';
export interface HomeProps extends HTMLAttributes<HTMLDivElement> {
    classes?: string;
}
export const Support: React.FC<HomeProps> = props => {
    return (
        <div>
            Support
        </div>
    );

}