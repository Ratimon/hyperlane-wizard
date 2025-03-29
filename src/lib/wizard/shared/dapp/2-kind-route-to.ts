import type { GenericContractToOptions } from '../build-generic';

export type KindContractTo = GenericContractToOptions['kind'];

export function sanitizeKindContractTo(kind: unknown): KindContractTo {
  if (typeof kind === 'string') {
    if (isKindContractTo(kind)) {
      return kind;
    }
  }
  return 'HypERC20';
}

function isKindContractTo<T>(value: KindContractTo | T): value is KindContractTo {
  switch (value) {
    case 'HypERC20':
      return true;
    case 'FastHypERC20':
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