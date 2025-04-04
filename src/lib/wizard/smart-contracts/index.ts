// place files you want to import through the `$lib` alias in this folder.
export type { GenericOptions, KindedOptions } from './build-generic';
export { buildContractGeneric } from './build-generic';

export type { Contract } from './contract';
export { ContractBuilder } from './contract';

export { printContract } from './print';

export type { Access, AccessOZ } from './set-access-control';
export type { Upgradeable } from './set-upgradeable';
export type { Info } from './set-info';

export { defaults as contractInfoDefaults } from './set-info';

export {
    erc20,
    erc4626,
    xerc20,
    xerc20lockbox,
    hypERC20Collateral,
    hypFiatToken,
    hypERC4626Collateral,
    hypERC4626OwnerCollateral,
    fastHypERC20Collateral,
    hypERC20,
    fastHypERC20,
    hypXERC20,
    hypXERC20Lockbox,
} from './api';

export { buildERC20 } from './dapp/1-erc20-primary';
export { buildERC4626 } from './dapp/1-erc4626-primary';
export { buildXERC20 } from './dapp/1-xerc20-primary';
export { buildXERC20Lockbox } from './dapp/1-xerc20lockbox-primary';
export { buildHypERC20Collateral } from './dapp/2-hyp-erc20-collateral';
export { buildHypFiatToken } from './dapp/2-hype-fiat-token';
export { buildHypERC4626Collateral } from './dapp/2-hyp-erc4626-collateral';
export { buildHypERC4626OwnerCollateral } from './dapp/2-hyp-erc4626-owner-collateral';
export { buildFastHypERC20Collateral } from './dapp/2-fast-hyp-erc20-collateral';
export { buildHypERC20 } from './dapp/2-hyp-erc20';
export { buildFastHypERC20 } from './dapp/2-fast-hyp-erc20';
export { buildHypXERC20 } from './dapp/2-hyp-xerc20';
export { buildHypXERC20Lockbox } from './dapp/2-hyp-xerc20lockbox';