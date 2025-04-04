import type { Contract} from '../contract';
import {  ContractBuilder } from '../contract';

import { withCommonDefaults, defaults as commonDefaults } from "../../shared/dapp/2-option-hyp-xerc20";

import { printContract } from "../print";
import { setInfo  } from "../set-info";
import { defineFunctions } from '../../utils/define-functions';


import type { SharedHypXERC20Options} from '../../shared/dapp/2-option-hyp-xerc20';

function withDefaults(opts: SharedHypXERC20Options): Required<SharedHypXERC20Options> {
  return {
    ...opts,
    ...withCommonDefaults(opts),
  };
}

export function printHypXERC20(opts: SharedHypXERC20Options = commonDefaults): string {
  return printContract(buildHypXERC20(opts));
}

export function buildHypXERC20(opts: SharedHypXERC20Options): Contract {
  const allOpts = withDefaults(opts);

  const c = new ContractBuilder(allOpts.contractName);

  const IXERC20 = {
    name: 'IXERC20',
    path: '@xerc20-1_0_0/interfaces/IXERC20.sol',
  };
  c.addImportOnly(IXERC20);

  const HypERC20Collateral = {
    name: 'HypERC20Collateral',
    path: '@hyperlane-core/token/HypERC20Collateral.so',
  };
  c.addParent(HypERC20Collateral, [{ lit: '_xerc20' }, { lit: '_scale' }, { lit: '_mailbox' }]);


  c.addConstructorArgument({
    type: 'address',
    name: '_xerc20'
  });

  c.addConstructorArgument({
    type: 'uint256',
    name: '_scale'
  });

  c.addConstructorArgument({
    type: 'address',
    name: '_mailbox'
  });

  c.addConstructorCode(`_disableInitializers();`);


  //  _transferFromSender
  c.addModifier('override', functions._transferFromSender);
  c.addFunctionCode(`IXERC20(address(wrappedToken)).burn(msg.sender, _amountOrId);
        return "";`, functions._transferFromSender);

  //  _transferTo
  c.addModifier('override ', functions._transferTo);
  c.addFunctionCode(`IXERC20(address(wrappedToken)).mint(_recipient, _amountOrId);`, functions._transferTo);

  setInfo(c, allOpts.contractInfo);

  return c;
}

const functions = defineFunctions({

    _transferFromSender: {
        kind: 'internal' as const,
        args: [
          { name: '_amountOrId', type: 'uint256' },
        ],
        returns: ['bytes memory metadata'],
    },
  

    _transferTo: {
      kind: 'internal' as const,
      args: [
        { name: '_recipient', type: 'address' },
        { name: '_amountOrId', type: 'uint256' },
        { name: '', type: 'bytes calldata' },
      ],
    },
  
  
});
