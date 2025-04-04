import type { Contract} from '../contract';
import {  ContractBuilder } from '../contract';

import { withCommonDefaults, defaults as commonDefaults } from "../../shared/dapp/2-option-hyp-erc4626-owner-collateral";

import { printContract } from "../print";
import { setInfo  } from "../set-info";
import { defineFunctions } from '../../utils/define-functions';


import type { SharedHypERC4626OwnerCollateralOptions} from '../../shared/dapp/2-option-hyp-erc4626-owner-collateral';

function withDefaults(opts: SharedHypERC4626OwnerCollateralOptions): Required<SharedHypERC4626OwnerCollateralOptions> {
  return {
    ...opts,
    ...withCommonDefaults(opts),
  };
}

export function printHypERC4626OwnerCollateral(opts: SharedHypERC4626OwnerCollateralOptions = commonDefaults): string {
  return printContract(buildHypERC4626OwnerCollateral(opts));
}

export function buildHypERC4626OwnerCollateral(opts: SharedHypERC4626OwnerCollateralOptions): Contract {
  const allOpts = withDefaults(opts);

  const c = new ContractBuilder(allOpts.contractName);


  const HypERC20Collateral = {
    name: 'HypERC20Collateral',
    path: '@hyperlane-core/token/HypERC20Collateral.so',
  };
  c.addParent(HypERC20Collateral, [{ lit: '_vault.asset()' }, { lit: '_scale' }, { lit: '_mailbox' }]);

  const ERC4626 = {
    name: 'ERC4626',
    path: '@openzeppelin/contracts/token/ERC20/extensions/ERC4626.so',
  };
  c.addImportOnly(ERC4626);

  c.addVariable(`ERC4626 public immutable vault;`);

  c.addVariable(`uint256 public constant PRECISION = 1e10;`);

  c.addVariable(`uint256 public assetDeposited;`);

  c.addVariable(`uint32 public rateUpdateNonce;`);

  c.addVariable(` event ExcessSharesSwept(uint256 amount, uint256 assetsRedeemed);`);

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
  c.addFunctionCode(`wrappedToken.approve(address(vault), type(uint256).max);
        _MailboxClient_initialize(_hook, _interchainSecurityModule, _owner);`, functions.initialize);


  //  _transferFromSender
  c.addModifier('override', functions._transferFromSender);
  c.addFunctionCode(`super._transferFromSender(_amount);
        _depositIntoVault(_amount);
        rateUpdateNonce++;

        return abi.encode(PRECISION, rateUpdateNonce);`, functions._transferFromSender);

  //  _depositIntoVault
  c.addFunctionCode(`assetDeposited += _amount;
        vault.deposit(_amount, address(this));`, functions._depositIntoVault);
  
  // _transferTo
  c.addModifier('virtual override', functions._transferTo);
  c.addFunctionCode(`_withdrawFromVault(_amount, _recipient);`, functions._transferTo);

  // _withdrawFromVault
  c.addFunctionCode(`assetDeposited -= _amount;
        vault.withdraw(_amount, _recipient, address(this));`, functions._withdrawFromVault);

  //  sweep
  c.addModifier('onlyOwner', functions.sweep);
  c.addFunctionCode(`uint256 excessShares = vault.maxRedeem(address(this)) -
            vault.convertToShares(assetDeposited);
        uint256 assetsRedeemed = vault.redeem(
            excessShares,
            owner(),
            address(this)
        );
        emit ExcessSharesSwept(excessShares, assetsRedeemed);`, functions.sweep);


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
  
    _transferFromSender: {
      kind: 'internal' as const,
      args: [
        { name: '_amount', type: 'uint256' },
      ],
      returns: ['bytes memory metadata'],
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
        { name: '_metadata', type: 'bytes calldata' },
      ],
    },

    _withdrawFromVault: {
      kind: 'internal' as const,
      args: [
        { name: '_amount', type: 'uint256' },
        { name: '_recipient', type: 'address' },
      ],
    },

    sweep: {
      kind: 'external' as const,
      args: [],
    },
  
  
});