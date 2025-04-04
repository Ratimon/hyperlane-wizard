import type { Contract} from '../contract';
import {  ContractBuilder } from '../contract';

import { withCommonDefaults, defaults as commonDefaults } from "../../shared/dapp/2-option-fast-hyp-erc20";

import { printContract } from "../print";
import { setInfo  } from "../set-info";
import { defineFunctions } from '../../utils/define-functions';


import type { SharedFastHypERC20Options} from '../../shared/dapp/2-option-fast-hyp-erc20';

function withDefaults(opts: SharedFastHypERC20Options): Required<SharedFastHypERC20Options> {
  return {
    ...opts,
    ...withCommonDefaults(opts),
  };
}

export function printFastHypERC20(opts: SharedFastHypERC20Options = commonDefaults): string {
  return printContract(buildFastHypERC20(opts));
}

export function buildFastHypERC20(opts: SharedFastHypERC20Options): Contract {
  const allOpts = withDefaults(opts);

  const c = new ContractBuilder(allOpts.contractName);

  const HypERC20 = {
    name: 'HypERC20',
    path: '@hyperlane-core/token/HypERC20.sol',
  };
  c.addParent(HypERC20, [{ lit: '__decimals' }, { lit: '_scale' }, { lit: '_mailbox' }]);

  const FastTokenRouter = {
    name: 'FastTokenRouter',
    path: '@hyperlane-core/token/libs/FastTokenRouter.sol',
  };
  c.addParent(FastTokenRouter, []);

  const TokenRouter = {
    name: 'TokenRouter',
    path: '@hyperlane-core/token/libs/TokenRouter.sol',
  };
  c.addImportOnly(TokenRouter);


  const ERC20Upgradeable = {
    name: 'ERC20Upgradeable',
    path: '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol',
  };
  c.addImportOnly(ERC20Upgradeable);


  c.addConstructorArgument({
    type: 'uint8',
    name: '__decimals'
  });

  c.addConstructorArgument({
    type: 'uint256',
    name: '_scale'
  });

  c.addConstructorArgument({
    type: 'address',
    name: '_mailbox'
  });


  //  _handle
  c.addModifier('virtual override(FastTokenRouter, TokenRouter)', functions._handle);
  c.addFunctionCode(`FastTokenRouter._handle(_origin, _sender, _message);`, functions._handle);


  // _fastTransferTo
  c.addModifier('override', functions._fastTransferTo);
  c.addFunctionCode(`_mint(_recipient, _amount);`, functions._fastTransferTo);


  // _fastRecieveFrom
  c.addModifier('override', functions._fastRecieveFrom);
  c.addFunctionCode(`_burn(_sender, _amount);`, functions._fastRecieveFrom);

  //  balanceOf
  c.addModifier('virtual override(HypERC20, TokenRouter)', functions.balanceOf);
  c.addFunctionCode(`return ERC20Upgradeable.balanceOf(_account);`, functions.balanceOf);


  


  setInfo(c, allOpts.contractInfo);

  return c;
}

const functions = defineFunctions({

    _handle: {
      kind: 'internal' as const,
      args: [
        { name: '_origin', type: 'uint32' },
        { name: '_sender', type: 'bytes32' },
        { name: '_message', type: 'bytes calldata' },
      ],
    },

    _fastTransferTo: {
        kind: 'internal' as const,
        args: [
          { name: '_recipient', type: 'address' },
          { name: '_amount', type: 'uint256' },
        ],
      },

    _fastRecieveFrom: {
        kind: 'internal' as const,
        args: [
          { name: '_sender', type: 'address' },
          { name: '_amount', type: 'uint256' },
        ],
      },
    

    balanceOf: {
      kind: 'public' as const,
      args: [
        { name: '_account', type: 'address' },
      ],
      returns: ['uint256'],
      mutability: 'view' as const,
    },
  

 
});