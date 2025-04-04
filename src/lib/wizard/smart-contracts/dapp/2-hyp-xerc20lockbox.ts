import type { Contract} from '../contract';
import {  ContractBuilder } from '../contract';

import { withCommonDefaults, defaults as commonDefaults } from "../../shared/dapp/2-option-hyp-xerc20-lockbox";

import { printContract } from "../print";
import { setInfo  } from "../set-info";
import { defineFunctions } from '../../utils/define-functions';


import type { SharedHypXERC20LockboxOptions} from '../../shared/dapp/2-option-hyp-xerc20-lockbox';

function withDefaults(opts: SharedHypXERC20LockboxOptions): Required<SharedHypXERC20LockboxOptions> {
  return {
    ...opts,
    ...withCommonDefaults(opts),
  };
}

export function printHypXERC20Lockbox(opts: SharedHypXERC20LockboxOptions = commonDefaults): string {
  return printContract(buildHypXERC20Lockbox(opts));
}

export function buildHypXERC20Lockbox(opts: SharedHypXERC20LockboxOptions): Contract {
  const allOpts = withDefaults(opts);

  const c = new ContractBuilder(allOpts.contractName);
  
  const IXERC20Lockbox = {
    name: 'IXERC20Lockbox',
    path: '@hyperlane-core/token/interfaces/IXERC20Lockbox.sol'
  };
  c.addImportOnly(IXERC20Lockbox);


  const IXERC20 = {
    name: 'IXERC20',
    path: '@hyperlane-core/token/interfaces/IXERC20.sol',
  };
  c.addImportOnly(IXERC20);

  const IERC20 = {
    name: 'IERC20',
    path: '@hyperlane-core/token/interfaces/IXERC20.sol',
  };
  c.addImportOnly(IERC20);


  const HypERC20Collateral = {
    name: 'HypERC20Collateral',
    path: '@hyperlane-core/token/HypERC20Collateral.so',
  };
  c.addParent(HypERC20Collateral, [{ lit: 'address(IXERC20Lockbox(_lockbox).ERC20())' }, { lit: '_scale' }, { lit: '_mailbox' }]);

  c.addVariable(`uint256 constant MAX_INT = 2 ** 256 - 1;`);

  c.addVariable(`IXERC20Lockbox public immutable lockbox;`);

  c.addVariable(`IXERC20 public immutable xERC20;`);



  c.addConstructorArgument({
    type: 'address',
    name: '_lockbox'
  });

  c.addConstructorArgument({
    type: 'uint256',
    name: '_scale'
  });

  c.addConstructorArgument({
    type: 'address',
    name: '_mailbox'
  });

  c.addConstructorCode(`lockbox = IXERC20Lockbox(_lockbox);
        xERC20 = lockbox.XERC20();
        approveLockbox();
        _disableInitializers();`);


  //  approveLockbox
  c.addFunctionCode(`require(
            IERC20(wrappedToken).approve(address(lockbox), MAX_INT),
            "erc20 lockbox approve failed"
        );
        require(
            xERC20.approve(address(lockbox), MAX_INT),
            "xerc20 lockbox approve failed"
        );`, functions.approveLockbox);


  //  initialize
  c.addModifier('override initialize', functions.initialize);
  c.addFunctionCode(`approveLockbox();
        _MailboxClient_initialize(_hook, _ism, _owner);`, functions.initialize);

  //  _transferFromSender
  c.addModifier('override', functions._transferFromSender);
  c.addFunctionCode(`// transfer erc20 from sender
        super._transferFromSender(_amount);
        // convert erc20 to xERC20
        lockbox.deposit(_amount);
        // burn xERC20
        xERC20.burn(address(this), _amount);
        return bytes("");`, functions._transferFromSender);

  //  _transferTo
  c.addModifier('override', functions._transferTo);
  c.addFunctionCode(`// mint xERC20
        xERC20.mint(address(this), _amount);
        // convert xERC20 to erc20
        lockbox.withdrawTo(_recipient, _amount);`, functions._transferTo);

  setInfo(c, allOpts.contractInfo);

  return c;
}

const functions = defineFunctions({

    approveLockbox: {
        kind: 'public' as const,
        args: [],
        returns: [],
    },

    initialize: {
        kind: 'public' as const,
        args: [
          { name: '_hook', type: 'address' },
          { name: '_ism', type: 'address' },
          { name: '_owner', type: 'address' },
        ],
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
