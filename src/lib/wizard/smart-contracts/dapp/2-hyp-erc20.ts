import type { Contract} from '../contract';
import {  ContractBuilder } from '../contract';

import { withCommonDefaults, defaults as commonDefaults } from "../../shared/dapp/2-option-hyp-erc20";

import { printContract } from "../print";
import { setInfo  } from "../set-info";
import { defineFunctions } from '../../utils/define-functions';


import type { SharedHypERC20Options} from '../../shared/dapp/2-option-hyp-erc20';

function withDefaults(opts: SharedHypERC20Options): Required<SharedHypERC20Options> {
  return {
    ...opts,
    ...withCommonDefaults(opts),
  };
}

export function printHypERC20(opts: SharedHypERC20Options = commonDefaults): string {
  return printContract(buildHypERC20(opts));
}

export function buildHypERC20(opts: SharedHypERC20Options): Contract {
  const allOpts = withDefaults(opts);

  const c = new ContractBuilder(allOpts.contractName);

  const TokenRouter = {
    name: 'TokenRouter',
    path: '@hyperlane-core/token/libs/TokenRouter.sol',
  };
  c.addImportOnly(TokenRouter);

  const FungibleTokenRouter = {
    name: 'FungibleTokenRouter',
    path: '@hyperlane-core/token/libs/FungibleTokenRouter.sol',
  };
  c.addParent(FungibleTokenRouter, [{ lit: '_scale' }, { lit: '_mailbox' }]);


  const ERC20Upgradeable = {
    name: 'ERC20Upgradeable',
    path: '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol',
  };
  c.addParent(ERC20Upgradeable, []);

  c.addVariable(`uint8 private immutable _decimals;`);


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

  c.addConstructorCode(`_decimals = __decimals;`);

  //  initialize
  c.addModifier('virtual initializer', functions.initialize);
  c.addFunctionCode(`// Initialize ERC20 metadata
        __ERC20_init(_name, _symbol);
        _mint(msg.sender, _totalSupply);
        _MailboxClient_initialize(_hook, _interchainSecurityModule, _owner);`, functions.initialize);


  //  decimals
  c.addModifier('virtual override', functions.decimals);
  c.addFunctionCode(`return _decimals;`, functions.decimals);


  //  balanceOf
  c.addModifier('virtual override(TokenRouter, ERC20Upgradeable)', functions.balanceOf);
  c.addFunctionCode(`return ERC20Upgradeable.balanceOf(_account);`, functions.balanceOf);

  //  _transferFromSender
  c.addModifier('override', functions._transferFromSender);
  c.addFunctionCode(`_burn(msg.sender, _amount);
        return bytes(""); // no metadata`, functions._transferFromSender);

  
  // _transferTo
  c.addModifier('virtual override', functions._transferTo);
  c.addFunctionCode(`_mint(_recipient, _amount);`, functions._transferTo);


  setInfo(c, allOpts.contractInfo);

  return c;
}

const functions = defineFunctions({

    initialize: {
      kind: 'public' as const,
      args: [
        { name: '_totalSupply', type: 'uint256' },
        { name: '_name', type: 'string memory' },
        { name: '_symbol', type: 'string memory' },
        { name: '_hook', type: 'address' },
        { name: '_interchainSecurityModule', type: 'address' },
        { name: '_owner', type: 'address' },
      ],
    },

    decimals: {
      kind: 'public' as const,
      args: [],
      returns: ['uint8'],
      mutability: 'view' as const,
    },
  
    balanceOf: {
      kind: 'public' as const,
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
        { name: '', type: 'bytes calldata' },
      ],
    },
  
  
});