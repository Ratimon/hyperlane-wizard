export type {
    KindedContractFromOptions, GenericContractFromOptions,
    KindedContractToOptions, GenericContractToOptions,
    KindedERC20Options, GenericERC20Options,
} from './build-generic';


export type { CommonOptions } from './common-options';

export type { Info } from './set-info';
export { defaults as InfoDefaults } from './set-info';

export type {OptionsErrorMessages } from './error';
export { OptionsError } from './error';

export type { Kind} from './kind';
export { sanitizeKind} from './kind';

export type { KindContractFrom } from './dapp/2-kind-route-from';
export { sanitizeKindContractFrom } from './dapp/2-kind-route-from';

export type { KindContractTo } from './dapp/2-kind-route-to';
export { sanitizeKindContractTo } from './dapp/2-kind-route-to';

export type { KindERC20 } from './dapp/1-kind-erc20';
export { sanitizeKindERC20 } from './dapp/1-kind-erc20';