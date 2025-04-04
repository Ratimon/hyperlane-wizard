import type { Contract} from '../contract';
import {  ContractBuilder } from '../contract';

import { withCommonDefaults, defaults as commonDefaults } from "../../shared/dapp/2-option-hyp-erc4626-collateral";

import { printContract } from "../print";
import { setInfo  } from "../set-info";
import { defineFunctions } from '../../utils/define-functions';


import type { SharedHypERC4626CollateralOptions} from '../../shared/dapp/2-option-hyp-erc4626-collateral';

function withDefaults(opts: SharedHypERC4626CollateralOptions): Required<SharedHypERC4626CollateralOptions> {
  return {
    ...opts,
    ...withCommonDefaults(opts),
  };
}

export function printHypERC4626Collateral(opts: SharedHypERC4626CollateralOptions = commonDefaults): string {
  return printContract(buildHypERC4626Collateral(opts));
}

export function buildHypERC4626Collateral(opts: SharedHypERC4626CollateralOptions): Contract {
  const allOpts = withDefaults(opts);

  const c = new ContractBuilder(allOpts.contractName);

  const TypeCasts = {
    name: 'TypeCasts',
    path: '@hyperlane-core/libs/TypeCasts.sol',
  };
  c.addLibrary(TypeCasts, `address`);

  const TokenMessage = {
    name: 'TokenMessage',
    path: '@hyperlane-core/token/libs/TokenMessage.sol',
  };
  c.addLibrary(TokenMessage, `bytes`);

  const HypERC20Collateral = {
    name: 'HypERC20Collateral',
    path: '@hyperlane-core/token/HypERC20Collateral.sol',
  };
  c.addParent(HypERC20Collateral, [{ lit: '_vault.asset()' }, { lit: '_scale' }, { lit: '_mailbox' }]);

  
  const ERC4626 = {
    name: 'ERC4626',
    path: '@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol',
  };
  c.addImportOnly(ERC4626);

  c.addVariable(`ERC4626 public immutable vault;`);

  c.addVariable(`uint256 public constant PRECISION = 1e10;`);

  c.addVariable(`bytes32 public constant NULL_RECIPIENT =
        0x0000000000000000000000000000000000000000000000000000000000000001;`);

  c.addVariable(`uint32 public rateUpdateNonce;`);

  c.addConstructorArgument({
    type: 'ERC4626',
    name: '_vault'
  });

  c.addConstructorArgument({
    type: 'uint256',
    name: '_scale'
  });

  c.addConstructorArgument({
    type: 'address',
    name: '_mailbox'
  });

  c.addConstructorCode(`vault = _vault;`);

  //  initialize
  c.addModifier('override initializer', functions.initialize);
  c.addFunctionCode(`_MailboxClient_initialize(_hook, _interchainSecurityModule, _owner);`, functions.initialize);


  //  _transferRemote
  c.addModifier('virtual override', functions._transferRemote);
  c.addFunctionCode(` // Can't override _transferFromSender only because we need to pass shares in the token message
        _transferFromSender(_amount);
        uint256 _shares = _depositIntoVault(_amount);
        uint256 _exchangeRate = vault.convertToAssets(PRECISION);

        rateUpdateNonce++;
        bytes memory _tokenMetadata = abi.encode(
            _exchangeRate,
            rateUpdateNonce
        );

        bytes memory _tokenMessage = TokenMessage.format(
            _recipient,
            _shares,
            _tokenMetadata
        );

        messageId = _Router_dispatch(
            _destination,
            _value,
            _tokenMessage,
            _hookMetadata,
            _hook
        );

        emit SentTransferRemote(_destination, _recipient, _shares);`, functions._transferRemote);

  //  _depositIntoVault
  c.addFunctionCode(`wrappedToken.approve(address(vault), _amount);
        return vault.deposit(_amount, address(this));`, functions._depositIntoVault);

  
  // _transferTo
  c.addModifier('virtual override', functions._transferTo);
  c.addFunctionCode(` // withdraw with the specified amount of shares
        vault.redeem(_amount, _recipient, address(this));`, functions._transferTo);

  // rebase
  c.addModifier('payable', functions.rebase);
  c.addFunctionCode(`// force a rebase with an empty transfer to 0x1
        _transferRemote(
            _destinationDomain,
            NULL_RECIPIENT,
            0,
            msg.value,
            _hookMetadata,
            _hook
        );`, functions.rebase);


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

  _transferRemote: {
    kind: 'internal' as const,
    args: [
      { name: '_destination', type: 'uint32' },
      { name: '_recipient', type: 'bytes32' },
      { name: '_amount', type: 'uint256' },
      { name: '_value', type: 'uint256' },
      { name: '_hookMetadata', type: 'bytes memory' },
      { name: '_hook', type: 'address' },
    ],
    returns: ['bytes32 messageId'],
  },


  _depositIntoVault: {
    kind: 'internal' as const,
    args: [
      { name: '_amount', type: 'uint256' },
    ],
    returns: ['uint256'],
  },

  _transferTo: {
    kind: 'internal' as const,
    args: [
      { name: '_recipient', type: 'address' },
      { name: '_amount', type: 'uint256' },
      { name: '', type: 'bytes calldata' },
    ],
  },

  rebase: {
    kind: 'public' as const,
    args: [
      { name: '_destinationDomain', type: 'uint32' },
      { name: '_hookMetadata', type: 'bytes calldata' },
      { name: '_hook', type: 'address' },
    ],
  },
  
  
});