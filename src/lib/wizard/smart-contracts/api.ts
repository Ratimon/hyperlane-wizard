import type { SharedERC20Options} from '../shared/dapp/1-option-erc20';
import {  defaults as erc20Defaults } from '../shared/dapp/1-option-erc20';
import { printERC20, isAccessControlRequired as erc20IsAccessControlRequired } from './dapp/1-erc20-primary';


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