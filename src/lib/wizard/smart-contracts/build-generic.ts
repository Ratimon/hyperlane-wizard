import type { SharedHypERC20CollateralOptions } from '../shared/dapp/2-option-hyp-erc20-collateral';
import { buildHypERC20Collateral } from './dapp/2-hyp-erc20-collateral';

// import type { SharedHypERC4626CollateralOptions } from '../shared/dapp/2-option-hyp-erc4626-collateral';
// import { buildHypERC46 } from './dapp/2';

import type { SharedERC20Options} from '../shared/dapp/1-option-erc20';
import { buildERC20 } from './dapp/1-erc20-primary';

import type { SharedERC4626Options } from '../shared/dapp/1-option-erc4626';
import { buildERC4626 } from './dapp/1-erc4626-primary';

import type { SharedXERC20Options} from '../shared/dapp/1-option-xerc20';
import { buildXERC20 } from './dapp/1-xerc20-primary';

import type { SharedXERC20LockboxOptions } from '../shared/dapp/1-option-xerc20lockbox';
import { buildXERC20Lockbox } from './dapp/1-xerc20lockbox-primary';

export interface KindedOptions {
    HypERC20Collateral : {kind: 'HypERC20Collateral'} & SharedHypERC20CollateralOptions;
    ERC20: { kind: 'ERC20' } & SharedERC20Options;
    ERC4626: { kind: 'ERC4626' } & SharedERC4626Options;
    XERC20: { kind: 'XERC20' } & SharedXERC20Options;
    XERC20Lockbox: { kind: 'XERC20Lockbox' } & SharedXERC20LockboxOptions;
}

export type GenericOptions = KindedOptions[keyof KindedOptions];

export function buildContractGeneric(opts: GenericOptions) {
    switch (opts.kind) {


        case 'HypERC20Collateral':
            return buildHypERC20Collateral(opts);


            //   case 'HypERC4626Collateral':
            //     return true;
            //   case 'HypFiatToken':
            //     return true;
            //   case 'HypERC4626OwnerCollateral':
            //     return true;
            //   case 'HypERC20':
            //     return true;
            //   case 'FastHypERC20Collateral':
            //     return true;
          
            //   case 'HypXERC20':
            //     return true;
            //   case 'HypXERC20Lockbox':
            //     return true;
          
        case 'ERC20':
            return buildERC20(opts);
        
        case 'ERC4626':
            return buildERC4626(opts);

        case 'XERC20':
            return buildXERC20(opts);

        case 'XERC20Lockbox':
            return buildXERC20Lockbox(opts);
        
        default:
            const _: never = opts;
            throw new Error('Unknown Contract');
    }
}
  