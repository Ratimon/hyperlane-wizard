import type { SharedHypERC20CollateralOptions } from '../shared/dapp/2-option-hyp-erc20-collateral';
import { buildHypERC20Collateral } from './dapp/2-hyp-erc20-collateral';

import type { SharedHypFiatTokenOptions } from '../shared/dapp/2-option-hyp-fiat-token';
import { buildHypFiatToken } from './dapp/2-hype-fiat-token';

import type { SharedHypERC4626CollateralOptions } from '../shared/dapp/2-option-hyp-erc4626-collateral';
import { buildHypERC4626Collateral } from './dapp/2-hyp-erc4626-collateral';

import type { SharedHypERC4626OwnerCollateralOptions } from '../shared/dapp/2-option-hyp-erc4626-owner-collateral';
import { buildHypERC4626OwnerCollateral } from './dapp/2-hyp-erc4626-owner-collateral';

import type { SharedFastHypERC20CollateralOptions } from '../shared/dapp/2-option-fast-hyp-erc20-collateral';
import { buildFastHypERC20Collateral } from './dapp/2-fast-hyp-erc20-collateral';

import type { SharedHypERC20Options } from '../shared/dapp/2-option-hyp-erc20';
import { buildHypERC20 } from './dapp/2-hyp-erc20';

import type { SharedFastHypERC20Options } from '../shared/dapp/2-option-fast-hyp-erc20';
import { buildFastHypERC20 } from './dapp/2-fast-hyp-erc20';    

import type { SharedHypXERC20Options } from '../shared/dapp/2-option-hyp-xerc20';
import { buildHypXERC20 } from './dapp/2-hyp-xerc20';

import type { SharedHypXERC20LockboxOptions } from '../shared/dapp/2-option-hyp-xerc20-lockbox';
import { buildHypXERC20Lockbox } from './dapp/2-hyp-xerc20lockbox';

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

export type GenericOptions = KindedOptions[keyof KindedOptions];

export function buildContractGeneric(opts: GenericOptions) {
    switch (opts.kind) {


        case 'HypERC20Collateral':
            return buildHypERC20Collateral(opts);

        case 'HypFiatToken':
            return buildHypFiatToken(opts);

        case 'HypERC4626Collateral':
            return buildHypERC4626Collateral(opts);

        case 'HypERC4626OwnerCollateral':
            return buildHypERC4626OwnerCollateral(opts);

        case 'FastHypERC20Collateral':
            return buildFastHypERC20Collateral(opts);
          
        case 'HypERC20':
            return buildHypERC20(opts);

        case 'FastHypERC20':
            return buildFastHypERC20(opts);

        case 'HypXERC20':
            return buildHypXERC20(opts);

        case 'HypXERC20Lockbox':
            return buildHypXERC20Lockbox(opts);

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
  