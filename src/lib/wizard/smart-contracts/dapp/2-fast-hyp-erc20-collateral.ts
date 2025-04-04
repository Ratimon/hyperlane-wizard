import type { Contract} from '../contract';
import {  ContractBuilder } from '../contract';

import { withCommonDefaults, defaults as commonDefaults } from "../../shared/dapp/2-option-fast-hyp-erc20-collateral";

import { printContract } from "../print";
import { setInfo  } from "../set-info";
import { defineFunctions } from '../../utils/define-functions';


import type { SharedFastHypERC20CollateralOptions} from '../../shared/dapp/2-option-fast-hyp-erc20-collateral';

function withDefaults(opts: SharedFastHypERC20CollateralOptions): Required<SharedFastHypERC20CollateralOptions> {
  return {
    ...opts,
    ...withCommonDefaults(opts),
  };
}

export function printFastHypERC20Collateral(opts: SharedFastHypERC20CollateralOptions = commonDefaults): string {
  return printContract(buildFastHypERC20Collateral(opts));
}

export function buildFastHypERC20Collateral(opts: SharedFastHypERC20CollateralOptions): Contract {
  const allOpts = withDefaults(opts);

  const c = new ContractBuilder(allOpts.contractName);

  const HypERC20Collateral = {
    name: 'HypERC20Collateral',
    path: '@hyperlane-core/token/HypERC20Collateral.so',
  };
  c.addParent(HypERC20Collateral, [{ lit: 'erc20' }, { lit: '_scale' }, { lit: '_mailbox' }]);

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



  const IERC20 = {
    name: 'IERC20',
    path: '@openzeppelin/contracts/token/ERC20/IERC20.sol',
  };
  c.addImportOnly(IERC20);

  const SafeERC20 = {
    name: 'SafeERC20',
    path: '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol',
  };

  c.addLibrary(SafeERC20, `IERC20`);


  c.addConstructorArgument({
    type: 'address',
    name: 'erc20'
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


  //  fastTransferTo
  c.addModifier('override', functions._fastTransferTo);
  c.addFunctionCode(`wrappedToken.safeTransfer(_recipient, _amount);`, functions._fastTransferTo);

  //  _fastRecieveFrom
  c.addFunctionCode(`wrappedToken.safeTransferFrom(_sender, address(this), _amount);`, functions._fastRecieveFrom);


  setInfo(c, allOpts.contractInfo);

  return c;
}

const functions = defineFunctions({

    _handle: {
      kind: 'internal' as const,
      args: [
        { name: '_origin', type: 'uint32' },
        { name: '_sender', type: 'bytes32' },
        { name: '_message', type: 'calldata bytes' },
      ],
    },
  

    _fastTransferTo: {
      kind: 'internal' as const,
      args: [
        { name: '_recipient', type: 'address' },
        { name: '_amount', type: 'uint256' },
      ],
    },

    _transferTo: {
      kind: 'internal' as const,
      args: [
        { name: '_recipient', type: 'address' },
        { name: '_amount', type: 'uint256' },
        { name: '_metadata', type: 'bytes calldata' },
      ],
    },

    _fastRecieveFrom: {
      kind: 'internal' as const,
      args: [
        { name: '_sender', type: 'address' },
        { name: '_amount', type: 'uint256' },
      ],
    },
  
  
});