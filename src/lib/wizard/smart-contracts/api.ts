import type { SharedERC20Options} from '../shared/dapp/1-option-erc20';
import {  defaults as erc20Defaults } from '../shared/dapp/1-option-erc20';
import { printERC20, isAccessControlRequired as erc20IsAccessControlRequired } from './dapp/1-erc20-primary';

import type { SharedERC4626Options } from '../shared/dapp/1-option-erc4626';
import {  defaults as erc4626Defaults } from '../shared/dapp/1-option-erc4626';
import { printERC4626, isAccessControlRequired as erc4626IsAccessControlRequired } from './dapp/1-erc4626-primary';

import type { SharedXERC20Options } from '../shared/dapp/1-option-xerc20';
import {  defaults as xerc20Defaults } from '../shared/dapp/1-option-xerc20';
import { printXERC20, isAccessControlRequired as xerc20IsAccessControlRequired } from './dapp/1-xerc20-primary';


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