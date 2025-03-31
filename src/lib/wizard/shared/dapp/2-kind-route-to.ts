import type { GenericToOptions } from '../build-generic';

export type KindTo = GenericToOptions['kind'];

export function sanitizeKindTo(kind: unknown): KindTo {
  if (typeof kind === 'string') {
    if (isKindTo(kind)) {
      return kind;
    }
  }
  return 'HypERC20';
}

function isKindTo<T>(value: KindTo | T): value is KindTo {
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