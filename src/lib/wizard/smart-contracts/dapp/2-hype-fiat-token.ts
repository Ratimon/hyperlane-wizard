import type { Contract} from '../contract';
import {  ContractBuilder } from '../contract';

import { withCommonDefaults, defaults as commonDefaults } from "../../shared/dapp/2-option-hyp-fiat-token";

import { printContract } from "../print";
import { setInfo  } from "../set-info";
import { defineFunctions } from '../../utils/define-functions';


import type { SharedHypFiatTokenOptions} from '../../shared/dapp/2-option-hyp-fiat-token';

function withDefaults(opts: SharedHypFiatTokenOptions): Required<SharedHypFiatTokenOptions> {
  return {
    ...opts,
    ...withCommonDefaults(opts),
  };
}

export function printHypFiatToken(opts: SharedHypFiatTokenOptions = commonDefaults): string {
  return printContract(buildHypFiatToken(opts));
}

export function buildHypFiatToken(opts: SharedHypFiatTokenOptions): Contract {
  const allOpts = withDefaults(opts);

  const c = new ContractBuilder(allOpts.contractName);

  const HypERC20Collateral = {
    name: 'HypERC20Collateral',
    path: '@hyperlane-core/token/HypERC20Collateral.sol',
  };
  c.addParent(HypERC20Collateral, [{ lit: '_fiatToken' }, { lit: '_scale' }, { lit: '_mailbox' }]);

  const IFiatToken = {
    name: 'IFiatToken',
    path: '@hyperlane-core/token/interfaces/IFiatToken.sol',
  };
  c.addImportOnly(IFiatToken);


  c.addConstructorArgument({
    type: 'address',
    name: '_fiatToken'
  });

  c.addConstructorArgument({
    type: 'uint256',
    name: '_scale'
  });

  c.addConstructorArgument({
    type: 'address',
    name: '_mailbox'
  });


  //  _transferFromSender
  c.addModifier('override', functions._transferFromSender);
  c.addFunctionCode(`// transfer amount to address(this)
        metadata = super._transferFromSender(_amount);
        // burn amount of address(this) balance
        IFiatToken(address(wrappedToken)).burn(_amount);`, functions._transferFromSender);

  // _transferTo
  c.addModifier('override', functions._transferTo);
  c.addFunctionCode(`// transfer amount to address(this)
        require(
            IFiatToken(address(wrappedToken)).mint(_recipient, _amount),
            "FiatToken mint failed"
        );`, functions._transferTo);

  setInfo(c, allOpts.contractInfo);

  return c;
}

const functions = defineFunctions({

    _transferFromSender: {
        kind: 'internal' as const,
        args: [
          { name: '_amount', type: 'uint256' },
        ],
        returns: ['bytes memory metadata'],
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
