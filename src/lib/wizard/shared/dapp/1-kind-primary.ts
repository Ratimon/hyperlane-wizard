import type { GenericPrimaryTokenOptions } from '../build-generic';

export type KindPrimaryToken = GenericPrimaryTokenOptions['kind'];

export function sanitizeKindPrimaryToken(kind: unknown): KindPrimaryToken {
  if (typeof kind === 'string') {
    if (isKindPrimaryToken(kind)) {
      return kind;
    }
  }
  return 'ERC20';
}

function isKindPrimaryToken<T>(value: KindPrimaryToken | T): value is KindPrimaryToken {
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