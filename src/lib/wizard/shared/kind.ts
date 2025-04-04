import type { GenericAllOptions } from './build-generic';

export type Kind = GenericAllOptions['kind'];

export function sanitizeKind(kind: unknown): Kind {
  if (typeof kind === 'string') {
    if (isKind(kind)) {
      return kind;
    }
  }
  return 'ERC20';
}

function isKind<T>(value: Kind | T): value is Kind {
  switch (value) {
    case 'HypERC20Collateral':
      return true;
    case 'HypERC4626Collateral':
      return true;
    case 'HypFiatToken':
      return true;
    case 'HypERC4626OwnerCollateral':
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

    case 'ERC20':
      return true;
    case 'ERC4626':
      return true;
    case 'XERC20':
      return true;
    case 'XERC20Lockbox':
      return true;
    default: {
      // Static assert that we've checked all kinds.
      const _: T = value;
      return false;
    }
  }
}
