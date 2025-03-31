export type {
    KindedFromOptions, GenericFromOptions,
    KindedToOptions, GenericToOptions,
    KindedERC20Options, GenericERC20Options,
} from './build-generic';


export type { CommonOptions } from './common-options';

export type { Info } from './set-info';
export { defaults as InfoDefaults } from './set-info';

export type {OptionsErrorMessages } from './error';
export { OptionsError } from './error';

export type { Kind} from './kind';
export { sanitizeKind} from './kind';

export type { KindFrom } from './dapp/2-kind-route-from';
export { sanitizeKindFrom } from './dapp/2-kind-route-from';

export type { KindTo } from './dapp/2-kind-route-to';
export { sanitizeKindTo } from './dapp/2-kind-route-to';

export type { KindERC20 } from './dapp/1-kind-erc20';
export { sanitizeKindERC20 } from './dapp/1-kind-erc20';