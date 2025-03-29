import type { GenericContractFromOptions } from '../build-generic';

export type KindContractFrom = GenericContractFromOptions['kind'];

export function sanitizeKindContractFrom(kind: unknown): KindContractFrom {
  if (typeof kind === 'string') {
    if (isKindContractFrom(kind)) {
      return kind;
    }
  }
  return 'HypERC20Collateral';
}

function isKindContractFrom<T>(value: KindContractFrom | T): value is KindContractFrom {
  switch (value) {
    case 'HypERC20Collateral':
      return true;
    case 'HypERC4626Collateral':
      return true;
    case 'HypFiatToken':
      return true;
    case 'HypERC4626OwnerCollateral':
      return true;
    case 'HypERC20':
      return true;
    case 'FastHypERC20Collateral':
      return true;
    case 'HypXERC20':
      return true;
    case 'HypXERC20Lockbox':
      return true;
    
    case 'HypERC20':
      return true;
    case 'FastHypERC20':
      return true;


    default: {
      // Static assert that we've checked all kinds.
      const _: T = value;
      return false;
    }
  }
}