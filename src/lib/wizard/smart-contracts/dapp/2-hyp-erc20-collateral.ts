import type { Contract} from '../contract';
import {  ContractBuilder } from '../contract';

import { withCommonDefaults, defaults as commonDefaults } from "../../shared/dapp/2-option-hyp-erc20-collateral";

import { printContract } from "../print";
import { setInfo  } from "../set-info";
import { defineFunctions } from '../../utils/define-functions';


import type { SharedHypERC20CollateralOptions} from '../../shared/dapp/2-option-hyp-erc20-collateral';

function withDefaults(opts: SharedHypERC20CollateralOptions): Required<SharedHypERC20CollateralOptions> {
  return {
    ...opts,
    ...withCommonDefaults(opts),
  };
}

export function printHypERC20Collateral(opts: SharedHypERC20CollateralOptions = commonDefaults): string {
  return printContract(buildHypERC20Collateral(opts));
}

export function buildHypERC20Collateral(opts: SharedHypERC20CollateralOptions): Contract {
  const allOpts = withDefaults(opts);

  const c = new ContractBuilder(allOpts.contractName);

  const FungibleTokenRouter = {
    name: 'FungibleTokenRouter',
    path: '@hyperlane-core/token/libs/FungibleTokenRouter.sol',
  };
  c.addParent(FungibleTokenRouter, [{ lit: '_scale' }, { lit: '_mailbox' }]);

  const TokenRouter = {
    name: 'TokenRouter',
    path: '@hyperlane-core/token/libs/TokenRouter.sol',
  };
  c.addImportOnly(TokenRouter);

  const TokenMessage = {
    name: 'TokenMessage',
    path: '@hyperlane-core/token/libs/TokenMessage.sol',
  };
  c.addImportOnly(TokenMessage);

  const Address = {
    name: 'Address',
    path: '@openzeppelin/contracts/utils/Address.sol',
  };
  c.addImportOnly(Address);

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

  c.addVariable(`IERC20 public immutable wrappedToken;`);

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

  c.addConstructorCode(`require(Address.isContract(erc20), "HypERC20Collateral: invalid token");
        wrappedToken = IERC20(erc20);`);

  //  initialize
  c.addModifier('virtual initializer ', functions.initialize);
  c.addFunctionCode(`_MailboxClient_initialize(_hook, _interchainSecurityModule, _owner);`, functions.initialize);


  //  balanceOf
  c.addModifier('override', functions.balanceOf);
  c.addFunctionCode(`return wrappedToken.balanceOf(_account);`, functions.balanceOf);

  //  _transferFromSender
  c.addModifier('virtual override', functions._transferFromSender);
  c.addFunctionCode(` wrappedToken.safeTransferFrom(msg.sender, address(this), _amount);
        return bytes(""); // no metadata`, functions._transferFromSender);

  
  // _transferTo
  c.addModifier('virtual override', functions._transferTo);
  c.addFunctionCode(`wrappedToken.safeTransfer(_recipient, _amount);`, functions._transferTo);


  setInfo(c, allOpts.contractInfo);

  return c;
}

const functions = defineFunctions({

    initialize: {
      kind: 'public' as const,
      args: [
        { name: '_hook', type: 'address' },
        { name: '_interchainSecurityModule', type: 'address' },
        { name: '_owner', type: 'address' },
      ],
    },
  
    balanceOf: {
      kind: 'external' as const,
      args: [
        { name: '_account', type: 'address' },
      ],
      returns: ['uint256'],
      mutability: 'view' as const,
    },
  
  
    _transferFromSender: {
      kind: 'internal' as const,
      args: [
        { name: '_amount', type: 'uint256' },
      ],
      returns: ['bytes memory'],
    },

    _transferTo: {
      kind: 'internal' as const,
      args: [
        { name: '_recipient', type: 'address' },
        { name: '_amount', type: 'uint256' },
        { name: '_metadata', type: 'bytes calldata' },
      ],
    },
  
  
});
