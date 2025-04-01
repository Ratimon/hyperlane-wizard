import { ContractBuilder } from '../contract';

import { withDefaults, defaults as commonDefaults } from "../../shared/dapp/1-option-erc20";
import type { SharedERC20Options } from "../../shared/dapp/1-option-erc20";

import type { AccessOZ } from '../set-access-control';
import { setAccessControlOZ, requireAccessControlOZ } from '../set-access-control';
import { addPauseFunctionsOZ } from '../add-pausable';
import { defineFunctions } from '../../utils/define-functions';

import type { Upgradeable } from '../set-upgradeable';
import { setUpgradeable } from '../set-upgradeable';
import { setInfo } from '../set-info';
import { printContract } from '../print';
import type { ClockMode } from '../set-clock-mode';
import { clockModeDefault, setClockMode } from '../set-clock-mode';
import { supportsInterface } from '../common-functions';
import { OptionsError } from '../../shared/error';


export function printERC20(opts: SharedERC20Options = commonDefaults): string {
  return printContract(buildERC20(opts));
}

export function isAccessControlRequired(opts: Partial<SharedERC20Options>): boolean {
  return opts.mintable || opts.pausable || opts.upgradeable === 'uups';
}

export function buildERC20(opts: SharedERC20Options): ContractBuilder {
  const allOpts = withDefaults(opts);

  const c = new ContractBuilder(allOpts.contractName);

  const { access, upgradeable, contractInfo } = allOpts;

  addBase(c, allOpts.contractName, allOpts.tokenSymbol);

//   if (allOpts.crossChainBridging) {
//     addCrossChainBridging(c, allOpts.crossChainBridging, allOpts.upgradeable, access);
//   }

  if (allOpts.premint) {
    // addPremint(c, allOpts.premint, allOpts.premintChainId, allOpts.crossChainBridging);
    addPremint(c, allOpts.premint, allOpts.premintChainId);
  }

  if (allOpts.burnable) {
    addBurnable(c);
  }

  if (allOpts.pausable) {
    addPausableExtension(c, access);
  }

  if (allOpts.mintable) {
    addMintable(c, access);
  }

  // Note: Votes requires Permit
  if (allOpts.permit || allOpts.votes) {
    addPermit(c, allOpts.contractName);
  }

  if (allOpts.votes) {
    const clockMode = allOpts.votes === true ? clockModeDefault : allOpts.votes;
    addVotes(c, clockMode);
  }

  if (allOpts.flashmint) {
    addFlashMint(c);
  }

  setAccessControlOZ(c, access);
  setUpgradeable(c, upgradeable, access);
  setInfo(c, contractInfo);

  return c;
}

function addBase(c: ContractBuilder, name: string, symbol: string) {
  const ERC20 = {
    name: 'ERC20',
    path: '@openzeppelin-5_2_0/contracts/token/ERC20/ERC20.sol',
  };
  c.addParent(ERC20, [name, symbol]);

  c.addOverride(ERC20, functions._update);
  c.addOverride(ERC20, functions._approve); // allows override from stablecoin
}

function addPausableExtension(c: ContractBuilder, access: AccessOZ) {
  const ERC20Pausable = {
    name: 'ERC20Pausable',
    path: '@openzeppelin-5_2_0/contracts/token/ERC20/extensions/ERC20Pausable.sol',
  };
  c.addParent(ERC20Pausable);
  c.addOverride(ERC20Pausable, functions._update);

  addPauseFunctionsOZ(c, access);
}

function addBurnable(c: ContractBuilder) {
  c.addParent({
    name: 'ERC20Burnable',
    path: '@openzeppelin-5_2_0/contracts/token/ERC20/extensions/ERC20Burnable.sol',
  });
}

export const premintPattern = /^(\d*)(?:\.(\d+))?(?:e(\d+))?$/;

export const chainIdPattern = /^(?!$)[1-9]\d*$/;

export function isValidChainId(str: string): boolean {
  return chainIdPattern.test(str);
}

function addPremint(
  c: ContractBuilder,
  amount: string,
  premintChainId: string,
//   crossChainBridging: CrossChainBridging,
) {
  const m = amount.match(premintPattern);
  if (m) {
    const integer = m[1]?.replace(/^0+/, '') ?? '';
    const decimals = m[2]?.replace(/0+$/, '') ?? '';
    const exponent = Number(m[3] ?? 0);

    if (Number(integer + decimals) > 0) {
      const decimalPlace = decimals.length - exponent;
      const zeroes = new Array(Math.max(0, -decimalPlace)).fill('0').join('');
      const units = integer + decimals + zeroes;
      const exp = decimalPlace <= 0 ? 'decimals()' : `(decimals() - ${decimalPlace})`;

      c.addConstructorArgument({ type: 'address', name: 'recipient' });

      const mintLine = `_mint(recipient, ${units} * 10 ** ${exp});`;

    //   if (crossChainBridging) {
    //     if (premintChainId === '') {
    //       throw new OptionsError({
    //         premintChainId: 'Chain ID is required when using Premint with Cross-Chain Bridging',
    //       });
    //     }

    //     if (!isValidChainId(premintChainId)) {
    //       throw new OptionsError({
    //         premintChainId: 'Not a valid chain ID',
    //       });
    //     }

    //     c.addConstructorCode(`if (block.chainid == ${premintChainId}) {`);
    //     c.addConstructorCode(`    ${mintLine}`);
    //     c.addConstructorCode(`}`);
    //   } else {
    //     c.addConstructorCode(mintLine);
    //   }

      c.addConstructorCode(mintLine);
    }
  } else {
    throw new OptionsError({
      premint: 'Not a valid number',
    });
  }
}

function addMintable(c: ContractBuilder, access: AccessOZ) {
  requireAccessControlOZ(c, functions.mint, access, 'MINTER', 'minter');
  c.addFunctionCode('_mint(to, amount);', functions.mint);
}

function addPermit(c: ContractBuilder, name: string) {
  const ERC20Permit = {
    name: 'ERC20Permit',
    path: '@openzeppelin-5_2_0/contracts/token/ERC20/extensions/ERC20Permit.sol',
  };
  c.addParent(ERC20Permit, [name]);
  c.addOverride(ERC20Permit, functions.nonces);
}

function addVotes(c: ContractBuilder, clockMode: ClockMode) {
  if (!c.parents.some(p => p.contract.name === 'ERC20Permit')) {
    throw new Error('Missing ERC20Permit requirement for ERC20Votes');
  }

  const ERC20Votes = {
    name: 'ERC20Votes',
    path: '@openzeppelin-5_2_0/contracts/token/ERC20/extensions/ERC20Votes.sol',
  };
  c.addParent(ERC20Votes);
  c.addOverride(ERC20Votes, functions._update);

  c.addImportOnly({
    name: 'Nonces',
    path: '@openzeppelin-5_2_0/contracts/utils/Nonces.sol',
  });
  c.addOverride(
    {
      name: 'Nonces',
    },
    functions.nonces,
  );

  setClockMode(c, ERC20Votes, clockMode);
}

function addFlashMint(c: ContractBuilder) {
  c.addParent({
    name: 'ERC20FlashMint',
    path: '@openzeppelin-5_2_0/contracts/token/ERC20/extensions/ERC20FlashMint.sol',
  });
}

// function addCrossChainBridging(
//   c: ContractBuilder,
//   crossChainBridging: 'custom' | 'superchain',
//   upgradeable: Upgradeable,
//   access: AccessOZ,
// ) {
//   const ERC20Bridgeable = {
//     name: 'ERC20Bridgeable',
//     path: `@openzeppelin-5_2_0/community-contracts/contracts/token/ERC20/extensions/ERC20Bridgeable.sol`,
//   };

//   c.addParent(ERC20Bridgeable);
//   c.addOverride(ERC20Bridgeable, supportsInterface);

//   if (upgradeable) {
//     throw new OptionsError({
//       crossChainBridging: 'Upgradeability is not currently supported with Cross-Chain Bridging',
//     });
//   }

//   c.addOverride(ERC20Bridgeable, functions._checkTokenBridge);
//   switch (crossChainBridging) {
//     case 'custom':
//       addCustomBridging(c, access);
//       break;
//     case 'superchain':
//       addSuperchainERC20(c);
//       break;
//     default: {
//       const _: never = crossChainBridging;
//       throw new Error('Unknown value for `crossChainBridging`');
//     }
//   }
//   c.addVariable('error Unauthorized();');
// }

// function addCustomBridging(c: ContractBuilder, access: AccessOZ) {
//   switch (access) {
//     case false:
//     case 'ownable': {
//       const addedBridgeImmutable = c.addVariable(`address public immutable TOKEN_BRIDGE;`);
//       if (addedBridgeImmutable) {
//         c.addConstructorArgument({ type: 'address', name: 'tokenBridge' });
//         c.addConstructorCode(`require(tokenBridge != address(0), "Invalid TOKEN_BRIDGE address");`);
//         c.addConstructorCode(`TOKEN_BRIDGE = tokenBridge;`);
//       }
//       c.setFunctionBody([`if (caller != TOKEN_BRIDGE) revert Unauthorized();`], functions._checkTokenBridge, 'view');
//       break;
//     }
//     case 'roles': {
//       setAccessControlOZ(c, access);
//       const roleOwner = 'tokenBridge';
//       const roleId = 'TOKEN_BRIDGE_ROLE';
//       const addedRoleConstant = c.addVariable(`bytes32 public constant ${roleId} = keccak256("${roleId}");`);
//       if (addedRoleConstant) {
//         c.addConstructorArgument({ type: 'address', name: roleOwner });
//         c.addConstructorCode(`_grantRole(${roleId}, ${roleOwner});`);
//       }
//       c.setFunctionBody(
//         [`if (!hasRole(${roleId}, caller)) revert Unauthorized();`],
//         functions._checkTokenBridge,
//         'view',
//       );
//       break;
//     }
//     case 'managed': {
//         setAccessControlOZ(c, access);
//       c.addImportOnly({
//         name: 'AuthorityUtils',
//         path: `@openzeppelin-5_2_0/contracts/access/manager/AuthorityUtils.sol`,
//       });
//       c.setFunctionBody(
//         [
//           `(bool immediate,) = AuthorityUtils.canCallWithDelay(authority(), caller, address(this), bytes4(_msgData()[0:4]));`,
//           `if (!immediate) revert Unauthorized();`,
//         ],
//         functions._checkTokenBridge,
//         'view',
//       );
//       break;
//     }
//     default: {
//       const _: never = access;
//       throw new Error('Unknown value for `access`');
//     }
//   }
// }

// function addSuperchainERC20(c: ContractBuilder) {
//   c.addVariable('address internal constant SUPERCHAIN_TOKEN_BRIDGE = 0x4200000000000000000000000000000000000028;');
//   c.setFunctionBody(
//     ['if (caller != SUPERCHAIN_TOKEN_BRIDGE) revert Unauthorized();'],
//     functions._checkTokenBridge,
//     'pure',
//   );
//   c.setFunctionComments(
//     [
//       '/**',
//       ' * @dev Checks if the caller is the predeployed SuperchainTokenBridge. Reverts otherwise.',
//       ' *',
//       ' * IMPORTANT: The predeployed SuperchainTokenBridge is only available on chains in the Superchain.',
//       ' */',
//     ],
//     functions._checkTokenBridge,
//   );
// }

export const functions = defineFunctions({
  _update: {
    kind: 'internal' as const,
    args: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
  },

  _approve: {
    kind: 'internal' as const,
    args: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'emitEvent', type: 'bool' },
    ],
  },

  mint: {
    kind: 'public' as const,
    args: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
  },

  pause: {
    kind: 'public' as const,
    args: [],
  },

  unpause: {
    kind: 'public' as const,
    args: [],
  },

  snapshot: {
    kind: 'public' as const,
    args: [],
  },

  nonces: {
    kind: 'public' as const,
    args: [{ name: 'owner', type: 'address' }],
    returns: ['uint256'],
    mutability: 'view' as const,
  },

  _checkTokenBridge: {
    kind: 'internal' as const,
    args: [{ name: 'caller', type: 'address' }],
  },
});