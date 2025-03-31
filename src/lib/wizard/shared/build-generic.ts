import type { SharedFastHypERC20CollateralOptions } from './dapp/2-option-fast-hyp-erc20-collateral';
import type { SharedHypERC20CollateralOptions } from './dapp/2-option-hyp-erc20-collateral';
import type { SharedHypERC4626CollateralOptions } from './dapp/2-option-hyp-erc4626-collateral';
import type { SharedHypERC4626OwnerCollateralOptions } from './dapp/2-option-hyp-erc4626-owner-collateral';
import type { SharedHypFiatTokenOptions } from './dapp/2-option-hyp-fiat-token';
import type { SharedHypXERC20Options } from './dapp/2-option-hyp-xerc20';
import type { SharedHypXERC20LockboxOptions } from './dapp/2-option-hyp-xerc20-lockbox';

import type { SharedHypERC20Options } from './dapp/2-option-hyp-erc20';


import type { SharedERC20Options} from './dapp/1-option-erc20';
import type { SharedFastHypERC20Options } from './dapp/2-option-fast-hyp-erc20';


export interface KindedFromOptions {
    HypERC20Collateral: { kind: 'HypERC20Collateral' } & SharedHypERC20CollateralOptions;
    // FastHypERC20Collateral: { kind: 'FastHypERC20Collateral' } & SharedFastHypERC20CollateralOptions;
    // HypERC4626Collateral: { kind: 'HypERC4626Collateral' } & SharedHypERC4626CollateralOptions;
    // HypERC4626OwnerCollateral: { kind: 'HypERC4626OwnerCollateral' } & SharedHypERC4626OwnerCollateralOptions;
    // HypFiatToken: { kind: 'HypFiatToken' } & SharedHypFiatTokenOptions;
    // // HypERC20: { kind: 'HypERC20' } & SharedERC20Options;
    // // FastHypERC20: { kind: 'FastHypERC20Collateral' } & SharedFastHypERC20CollateralOptions;
    // HypXERC20: { kind: 'HypXERC20' } & SharedHypXERC20Options;
    // HypXERC20Lockbox: { kind: 'HypXERC20Lockbox' } & SharedHypXERC20LockboxOptions;
}
export type GenericFromOptions = KindedFromOptions[keyof KindedFromOptions];

export interface KindedToOptions {
    HypERC20: { kind: 'HypERC20' } & SharedHypERC20Options;
    FastHypERC20: { kind: 'FastHypERC20' } & SharedFastHypERC20Options;
    HypXERC20: { kind: 'HypXERC20' } & SharedHypXERC20Options;
    HypXERC20Lockbox: { kind: 'HypXERC20Lockbox' } & SharedHypXERC20LockboxOptions;
}
export type GenericToOptions = KindedToOptions[keyof KindedToOptions];


export interface KindedERC20Options {
    ERC20: { kind: 'ERC20' } & SharedERC20Options;
}
export type GenericERC20Options = KindedERC20Options[keyof KindedERC20Options];