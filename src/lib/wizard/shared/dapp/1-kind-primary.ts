import type { GenericPrimaryTokenFromOptions } from '../build-generic';

export type KindPrimaryTokenFrom = GenericPrimaryTokenFromOptions['kind'];

export function sanitizeKindPrimaryTokenFrom(kind: unknown): KindPrimaryTokenFrom {
  if (typeof kind === 'string') {
    if (isKindPrimaryTokenFrom(kind)) {
      return kind;
    }
  }
  return 'ERC20';
}

function isKindPrimaryTokenFrom<T>(value: KindPrimaryTokenFrom | T): value is KindPrimaryTokenFrom {
  switch (value) {
    case 'ERC20':
      return true;
    case 'ERC4626':
      return true;

    default: {
      // Static assert that we've checked all kinds.
      const _: T = value;
      return false;
    }
  }
}