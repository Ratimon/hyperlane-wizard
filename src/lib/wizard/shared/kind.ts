import type { GenericERC20PrimaryOptions } from './build-generic';

export type Kind = GenericERC20PrimaryOptions['kind'];

export function sanitizeKind(kind: unknown): Kind {
  if (typeof kind === 'string') {
    if (isKind(kind)) {
      return kind;
    }
  }
  return 'ERC20Primary';
}

function isKind<T>(value: Kind | T): value is Kind {
  switch (value) {
    case 'ERC20Primary':
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