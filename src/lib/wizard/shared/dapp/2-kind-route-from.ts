import type { GenericFromOptions } from '../build-generic';

export type KindFrom = GenericFromOptions['kind'];

export function sanitizeKindFrom(kind: unknown): KindFrom {
  if (typeof kind === 'string') {
    if (isKindFrom(kind)) {
      return kind;
    }
  }
  return 'HypERC20Collateral';
}

function isKindFrom<T>(value: KindFrom | T): value is KindFrom {
  switch (value) {
    case 'HypERC20Collateral':
      return true;
    case 'HypFiatToken':
      return true;
    case 'HypERC4626Collateral':
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


    default: {
      // Static assert that we've checked all kinds.
      const _: T = value;
      return false;
    }
  }
}