import type { GenericERC20Options } from '../build-generic';

export type KindERC20 = GenericERC20Options['kind'];

export function sanitizeKindERC20(kind: unknown): KindERC20 {
  if (typeof kind === 'string') {
    if (isKindERC20(kind)) {
      return kind;
    }
  }
  return 'ERC20';
}

function isKindERC20<T>(value: KindERC20 | T): value is KindERC20 {
  switch (value) {
    case 'ERC20':
      return true;
    // case '///':
    //   return true;

    default: {
      // Static assert that we've checked all kinds.
      const _: T = value;
      return false;
    }
  }
}