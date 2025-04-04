import type { SharedHypERC20CollateralOptions } from './dapp/2-option-hyp-erc20-collateral';
import type { SharedHypFiatTokenOptions } from './dapp/2-option-hyp-fiat-token';
import type { SharedHypERC4626CollateralOptions } from './dapp/2-option-hyp-erc4626-collateral';
import type { SharedHypERC4626OwnerCollateralOptions } from './dapp/2-option-hyp-erc4626-owner-collateral';
import type { SharedFastHypERC20CollateralOptions } from './dapp/2-option-fast-hyp-erc20-collateral';
import type { SharedHypXERC20Options } from './dapp/2-option-hyp-xerc20';
import type { SharedHypXERC20LockboxOptions } from './dapp/2-option-hyp-xerc20-lockbox';

import type { SharedHypERC20Options } from './dapp/2-option-hyp-erc20';
import type { SharedFastHypERC20Options } from './dapp/2-option-fast-hyp-erc20';

import type { SharedERC20Options} from './dapp/1-option-erc20';
import type { SharedERC4626Options } from './dapp/1-option-erc4626';
import type { SharedXERC20Options } from './dapp/1-option-xerc20';
import type { SharedXERC20LockboxOptions } from './dapp/1-option-xerc20lockbox';


export interface KindedFromOptions {
    HypERC20Collateral: { kind: 'HypERC20Collateral' } & SharedHypERC20CollateralOptions;
    HypFiatToken: { kind: 'HypFiatToken' } & SharedHypFiatTokenOptions;
    HypERC4626Collateral: { kind: 'HypERC4626Collateral' } & SharedHypERC4626CollateralOptions;
    HypERC4626OwnerCollateral: { kind: 'HypERC4626OwnerCollateral' } & SharedHypERC4626OwnerCollateralOptions;
    FastHypERC20Collateral: { kind: 'FastHypERC20Collateral' } & SharedFastHypERC20CollateralOptions;
    HypXERC20: { kind: 'HypXERC20' } & SharedHypXERC20Options;
    HypXERC20Lockbox: { kind: 'HypXERC20Lockbox' } & SharedHypXERC20LockboxOptions;
}
export type GenericFromOptions = KindedFromOptions[keyof KindedFromOptions];

export interface KindedToOptions {
    HypERC20: { kind: 'HypERC20' } & SharedHypERC20Options;
    FastHypERC20: { kind: 'FastHypERC20' } & SharedFastHypERC20Options;
    HypXERC20: { kind: 'HypXERC20' } & SharedHypXERC20Options;
    HypXERC20Lockbox: { kind: 'HypXERC20Lockbox' } & SharedHypXERC20LockboxOptions;
}
export type GenericToOptions = KindedToOptions[keyof KindedToOptions];

export interface KindedPrimaryTokenFromOptions {
    ERC20: { kind: 'ERC20' } & SharedERC20Options;
    ERC4626: { kind: 'ERC4626' } & SharedERC4626Options;
    XERC20: { kind: 'XERC20' } & SharedXERC20Options;
    XERC20Lockbox: { kind: 'XERC20Lockbox' } & SharedXERC20LockboxOptions;
}
export type GenericPrimaryTokenFromOptions = KindedPrimaryTokenFromOptions[keyof KindedPrimaryTokenFromOptions];

export interface KindedPrimaryTokenToOptions {
    XERC20: { kind: 'XERC20' } & SharedXERC20Options;
    XERC20Lockbox: { kind: 'XERC20Lockbox' } & SharedXERC20LockboxOptions;
}
export type GenericPrimaryTokenToOptions = KindedPrimaryTokenToOptions[keyof KindedPrimaryTokenToOptions];


export interface KindedAllOptions {
    HypERC20Collateral: { kind: 'HypERC20Collateral' } & SharedHypERC20CollateralOptions;
    HypFiatToken: { kind: 'HypFiatToken' } & SharedHypFiatTokenOptions;
    HypERC4626Collateral: { kind: 'HypERC4626Collateral' } & SharedHypERC4626CollateralOptions;
    HypERC4626OwnerCollateral: { kind: 'HypERC4626OwnerCollateral' } & SharedHypERC4626OwnerCollateralOptions;
    FastHypERC20Collateral: { kind: 'FastHypERC20Collateral' } & SharedFastHypERC20CollateralOptions;
    HypXERC20: { kind: 'HypXERC20' } & SharedHypXERC20Options;
    HypXERC20Lockbox: { kind: 'HypXERC20Lockbox' } & SharedHypXERC20LockboxOptions;

    HypERC20: { kind: 'HypERC20' } & SharedHypERC20Options;
    FastHypERC20: { kind: 'FastHypERC20' } & SharedFastHypERC20Options;


    ERC20: { kind: 'ERC20' } & SharedERC20Options;
    ERC4626: { kind: 'ERC4626' } & SharedERC4626Options;
    XERC20: { kind: 'XERC20' } & SharedXERC20Options;
    XERC20Lockbox: { kind: 'XERC20Lockbox' } & SharedXERC20LockboxOptions;
}
export type GenericAllOptions = KindedAllOptions[keyof KindedAllOptions];
