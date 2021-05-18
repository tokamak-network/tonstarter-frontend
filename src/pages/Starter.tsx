import { FC, HTMLAttributes } from 'react';
export interface HomeProps extends HTMLAttributes<HTMLDivElement> {
    classes?: string;
}
export const Starter: React.FC<HomeProps> = props => {
    return (
        <div>
            Starter
        </div>
    );

}