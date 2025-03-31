import type { SharedHypERC20CollateralOptions } from '../shared/dapp/2-option-hyp-erc20-collateral';
import { buildHypERC20Collateral } from './dapp/2-hyp-erc20-collateral';

// import type { SharedHypERC4626CollateralOptions } from '../shared/dapp/2-option-hyp-erc4626-collateral';
// import { buildHypERC46 } from './dapp/2';

import type { SharedERC20Options} from '../shared/dapp/1-option-erc20';
import { buildERC20 } from './dapp/1-erc20-primary';



export interface KindedOptions {
    HypERC20Collateral : {kind: 'HypERC20Collateral'} & SharedHypERC20CollateralOptions;
    ERC20: { kind: 'ERC20' } & SharedERC20Options;
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

        // tdo : bring when there are at least two casess
        
        // default:
        //     const _: never = opts;
        //     throw new Error('Unknown Contract');
    }
}
  