// place files you want to import through the `$lib` alias in this folder.
export type { GenericOptions, KindedOptions } from './build-generic';
export { buildContractGeneric } from './build-generic';

export type { Contract } from './contract';
export { ContractBuilder } from './contract';

export { printContract } from './print';

export type { Access, AccessOZ } from './set-access-control';
export type { Upgradeable } from './set-upgradeable';
export type { Info } from './set-info';


export { defaults as contractInfoDefaults } from './set-info';

export {
    erc20,
} from './api';

export { buildERC20 } from './dapp/1-erc20-primary';
