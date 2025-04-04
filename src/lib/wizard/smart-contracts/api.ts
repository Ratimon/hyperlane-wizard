import type { SharedERC20Options} from '../shared/dapp/1-option-erc20';
import {  defaults as erc20Defaults } from '../shared/dapp/1-option-erc20';
import { printERC20, isAccessControlRequired as erc20IsAccessControlRequired } from './dapp/1-erc20-primary';

import type { SharedERC4626Options } from '../shared/dapp/1-option-erc4626';
import {  defaults as erc4626Defaults } from '../shared/dapp/1-option-erc4626';
import { printERC4626, isAccessControlRequired as erc4626IsAccessControlRequired } from './dapp/1-erc4626-primary';

import type { SharedXERC20Options } from '../shared/dapp/1-option-xerc20';
import {  defaults as xerc20Defaults } from '../shared/dapp/1-option-xerc20';
import { printXERC20, isAccessControlRequired as xerc20IsAccessControlRequired } from './dapp/1-xerc20-primary';

import type { SharedXERC20LockboxOptions } from '../shared/dapp/1-option-xerc20lockbox';
import {  defaults as xerc20lockboxDefaults } from '../shared/dapp/1-option-xerc20lockbox';
import { printXERC20Lockbox, isAccessControlRequired as xerc20lockboxIsAccessControlRequired } from './dapp/1-xerc20lockbox-primary';

import type { SharedHypERC20CollateralOptions } from '../shared/dapp/2-option-hyp-erc20-collateral';
import {  defaults as hypERC20CollateralDefaults } from '../shared/dapp/2-option-hyp-erc20-collateral';
import { printHypERC20Collateral } from './dapp/2-hyp-erc20-collateral';

import type { SharedHypERC4626CollateralOptions } from '../shared/dapp/2-option-hyp-erc4626-collateral';
import {  defaults as hypERC4626CollateralDefaults } from '../shared/dapp/2-option-hyp-erc4626-collateral';
import { printHypERC4626Collateral } from './dapp/2-hyp-erc4626-collateral';

import type { SharedHypERC4626OwnerCollateralOptions } from '../shared/dapp/2-option-hyp-erc4626-owner-collateral';
import {  defaults as hypERC4626OwnerCollateralDefaults } from '../shared/dapp/2-option-hyp-erc4626-owner-collateral';
import { printHypERC4626OwnerCollateral } from './dapp/2-hyp-erc4626-owner-collateral';

import type { SharedHypFiatTokenOptions } from '../shared/dapp/2-option-hyp-fiat-token';
import {  defaults as hypFiatTokenDefaults } from '../shared/dapp/2-option-hyp-fiat-token';
import { printHypFiatToken } from './dapp/2-hype-fiat-token';

import type { SharedFastHypERC20CollateralOptions } from '../shared/dapp/2-option-fast-hyp-erc20-collateral';
import {  defaults as fastHypERC20CollateralDefaults } from '../shared/dapp/2-option-fast-hyp-erc20-collateral';
import { printFastHypERC20Collateral } from './dapp/2-fast-hyp-erc20-collateral';

import type { SharedHypERC20Options } from '../shared/dapp/2-option-hyp-erc20';
import {  defaults as hypERC20Defaults } from '../shared/dapp/2-option-hyp-erc20';
import { printHypERC20 } from './dapp/2-hyp-erc20';

import type { SharedFastHypERC20Options } from '../shared/dapp/2-option-fast-hyp-erc20';
import {  defaults as fastHypERC20Defaults } from '../shared/dapp/2-option-fast-hyp-erc20';
import { printFastHypERC20 } from './dapp/2-fast-hyp-erc20';

import type { SharedHypXERC20Options } from '../shared/dapp/2-option-hyp-xerc20';
import {  defaults as hypXERC20Defaults } from '../shared/dapp/2-option-hyp-xerc20';
import { printHypXERC20 } from './dapp/2-hyp-xerc20';

import type { SharedHypXERC20LockboxOptions } from '../shared/dapp/2-option-hyp-xerc20-lockbox';
import {  defaults as hypXERC20LockboxDefaults } from '../shared/dapp/2-option-hyp-xerc20-lockbox';
import { printHypXERC20Lockbox } from './dapp/2-hyp-xerc20lockbox';

import type { CommonOptions } from '../shared/common-options';

export interface WizardContractAPI<Options extends CommonOptions> {
    /**
     * Returns a string representation of a contract generated using the provided options. If opts is not provided, uses `defaults`.
     */
    print: (opts?: Options) => string,
    /**
     * The default options that are used for `print`.
     */
    defaults: Required<Options>;
    /**
     * Whether any of the provided options require access control to be enabled. If this returns `true`, then calling `print` with the 
     * same options would cause the `access` option to default to `'ownable'` if it was `undefined` or `false`. 
     */
    isAccessControlRequired?: (opts: Partial<Options>) => boolean,
}

export type ERC20 = WizardContractAPI<SharedERC20Options>;
export const erc20: ERC20 = {
  print: printERC20,
  defaults: erc20Defaults,
  isAccessControlRequired: erc20IsAccessControlRequired
}

export type ERC4626 = WizardContractAPI<SharedERC4626Options>;
export const erc4626: ERC4626 = {
  print: printERC4626,
  defaults: erc4626Defaults,
  isAccessControlRequired: erc4626IsAccessControlRequired
}

export type XERC20 = WizardContractAPI<SharedXERC20Options>;
export const xerc20: XERC20 = {
  print: printXERC20,
  defaults: xerc20Defaults,
  isAccessControlRequired: xerc20IsAccessControlRequired
}

export type XERC20Lockbox = WizardContractAPI<SharedXERC20LockboxOptions>;
export const xerc20lockbox: XERC20Lockbox = {
  print: printXERC20Lockbox,
  defaults: xerc20lockboxDefaults,
  isAccessControlRequired: xerc20lockboxIsAccessControlRequired
}

export type HypERC20Collateral = WizardContractAPI<SharedHypERC20CollateralOptions>;
export const hypERC20Collateral: HypERC20Collateral = {
  print: printHypERC20Collateral,
  defaults: hypERC20CollateralDefaults,
}

export type HypFiatToken = WizardContractAPI<SharedHypFiatTokenOptions>;
export const hypFiatToken: HypFiatToken = {
  print: printHypFiatToken,
  defaults: hypFiatTokenDefaults,
}

export type HypERC4626Collateral = WizardContractAPI<SharedHypERC4626CollateralOptions>;
export const hypERC4626Collateral: HypERC4626Collateral = {
  print: printHypERC4626Collateral,
  defaults: hypERC4626CollateralDefaults,
}

export type HypERC4626OwnerCollateral = WizardContractAPI<SharedHypERC4626OwnerCollateralOptions>;
export const hypERC4626OwnerCollateral: HypERC4626OwnerCollateral = {
  print: printHypERC4626OwnerCollateral,
  defaults: hypERC4626OwnerCollateralDefaults,
}

export type FastHypERC20Collateral = WizardContractAPI<SharedFastHypERC20CollateralOptions>;
export const fastHypERC20Collateral: FastHypERC20Collateral = {
  print: printFastHypERC20Collateral,
  defaults: fastHypERC20CollateralDefaults,
}

export type HypERC20 = WizardContractAPI<SharedHypERC20Options>;
export const hypERC20: HypERC20 = {
  print: printHypERC20,
  defaults: hypERC20Defaults,
}

export type FastHypERC20 = WizardContractAPI<SharedFastHypERC20Options>;
export const fastHypERC20: FastHypERC20 = {
  print: printFastHypERC20,
  defaults: fastHypERC20Defaults,
}

export type HypXERC20 = WizardContractAPI<SharedHypXERC20Options>;
export const hypXERC20: HypXERC20 = {
  print: printHypXERC20,
  defaults: hypXERC20Defaults,
}

export type HypXERC20Lockbox = WizardContractAPI<SharedHypXERC20LockboxOptions>;
export const hypXERC20Lockbox: HypXERC20Lockbox = {
  print: printHypXERC20Lockbox,
  defaults: hypXERC20LockboxDefaults,
}