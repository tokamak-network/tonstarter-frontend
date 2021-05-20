import { HTMLAttributes } from 'react';
export interface HomeProps extends HTMLAttributes<HTMLDivElement> {
    classes?: string;
}
export const Pools: React.FC<HomeProps> = props => {
    return (
        <div>
            Pools
        </div>
    );

}