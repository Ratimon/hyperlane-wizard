import type { SharedERC20PrimaryOptions} from '../shared/dapp/1-option-erc20-primary';


export interface KindedOptions {
    ERC20Primary: { kind: 'ERC20Primary' } & SharedERC20PrimaryOptions;
}
  
export type GenericOptions = KindedOptions[keyof KindedOptions];


export interface KindedERC20PrimaryOptions {
    ERC20Primary: { kind: 'ERC20Primary' } & SharedERC20PrimaryOptions;
}
export type GenericERC20PrimaryOptions = KindedERC20PrimaryOptions[keyof KindedERC20PrimaryOptions];