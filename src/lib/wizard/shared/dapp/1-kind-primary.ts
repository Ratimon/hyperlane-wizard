import type {
  GenericPrimaryTokenFromOptions,
  GenericPrimaryTokenToOptions,
} from '../build-generic';

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

export type KindPrimaryTokenTo = GenericPrimaryTokenToOptions['kind'];

export function sanitizeKindPrimaryTokenTo(kind: unknown): KindPrimaryTokenTo {
  if (typeof kind === 'string') {
    if (isKindPrimaryTokenTo(kind)) {
      return kind;
    }
  }
  return 'XERC20';
}

function isKindPrimaryTokenTo<T>(value: KindPrimaryTokenTo | T): value is KindPrimaryTokenTo {
  switch (value) {
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