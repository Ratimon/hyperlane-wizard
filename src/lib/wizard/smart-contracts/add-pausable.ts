import type { ContractBuilder, BaseFunction } from './contract';
import type { AccessOZ } from './set-access-control';
import { requireAccessControlOZ } from './set-access-control';
import { defineFunctions } from '../utils/define-functions';

export function addPausableOZ(c: ContractBuilder, access: AccessOZ, pausableFns: BaseFunction[]) {
  c.addParent({
    name: 'Pausable',
    path: '@openzeppelin/contracts/utils/Pausable.sol',
  });

  for (const fn of pausableFns) {
    c.addModifier('whenNotPaused', fn);
  }

  addPauseFunctionsOZ(c, access);
}

export function addPauseFunctionsOZ(c: ContractBuilder, access: AccessOZ) {
  requireAccessControlOZ(c, functions.pause, access, 'PAUSER', 'pauser');
  c.addFunctionCode('_pause();', functions.pause);

  requireAccessControlOZ(c, functions.unpause, access, 'PAUSER', 'pauser');
  c.addFunctionCode('_unpause();', functions.unpause);
}

const functions = defineFunctions({
  pause: {
    kind: 'public' as const,
    args: [],
  },

  unpause: {
    kind: 'public' as const,
    args: [],
  },
});