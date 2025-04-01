import { ContractBuilder } from '../contract';

import { withDefaults, defaults as commonDefaults } from "../../shared/dapp/1-option-erc20";
import type { SharedXERC20LockboxOptions } from "../../shared/dapp/1-option-xerc20lockbox";


import type { Upgradeable } from '../set-upgradeable';
import { setUpgradeable } from '../set-upgradeable';
import { setInfo } from '../set-info';
import { printContract } from '../print';
import { defineFunctions } from '$lib/wizard/utils/define-functions';


export function printXERC20Lockbox(opts: SharedXERC20LockboxOptions = commonDefaults): string {
  return printContract(buildXERC20Lockbox(opts));
}

export function isAccessControlRequired(opts: Partial<SharedXERC20LockboxOptions>): boolean {
  return  opts.upgradeable === 'uups';
}

export function buildXERC20Lockbox(opts: SharedXERC20LockboxOptions): ContractBuilder {
  const allOpts = withDefaults(opts);

  const c = new ContractBuilder(allOpts.contractName);

  const {  contractInfo } = allOpts;

  addBase(c, allOpts.contractName, allOpts.tokenSymbol);

  setInfo(c, contractInfo);

  return c;
}

function addBase(c: ContractBuilder, name: string, symbol: string) {

  const IXERC20 = {
    name: 'IXERC20',
        path: '@xerc20-1_0_0/interfaces/IXERC20.sol',
      };
   c.addImportOnly(IXERC20);

  const IERC20 = {
    name: 'IERC20',
    path: '@openzeppelin-5_2_0/contracts/token/ERC20/IERC20.sol',
  };
  c.addImportOnly(IERC20);

  const SafeERC20 = {
    name: 'SafeERC20',
    path: '@openzeppelin-5_2_0/contracts/token/ERC20/utils/SafeERC20.sol',
  };
  c.addLibrary(SafeERC20, `IERC20`);

  const SafeCast = {
    name: 'SafeCast',
    path: '@openzeppelin-5_2_0/contracts/utils/math/SafeCast.sol',
  };
  c.addLibrary(SafeCast, `uint256`);

  const IXERC20Lockbox = {
    name: 'IXERC20Lockbox',
    path: '@xerc20-1_0_0/interfaces/IXERC20Lockbox.sol'
  };
  c.addParent(IXERC20Lockbox, []);

  c.addVariable(`IXERC20 public immutable XERC20;`);

  c.addVariable(`IERC20 public immutable ERC20;`);

  c.addVariable(`bool public immutable IS_NATIVE;`);

  c.addConstructorArgument({
    type: {
      name: 'address',
      transpiled: false,
    },
    name: '_xerc20',
  });
  
  c.addConstructorArgument({
    type: {
      name: 'address',
      transpiled: false,
    },
    name: '_erc20',
  });

  c.addConstructorArgument({
    type: {
      name: 'bool',
      transpiled: false,
    },
    name: '_isNative',
  });

  c.addConstructorCode(`XERC20 = IXERC20(_xerc20);
        ERC20 = IERC20(_erc20);
        IS_NATIVE = _isNative;`);

  c.addModifier('payable', functions.depositNative);
  c.addFunctionCode(`if (!IS_NATIVE) revert IXERC20Lockbox_NotNative();

        _deposit(msg.sender, msg.value);`, functions.depositNative);

  c.addFunctionCode(`if (IS_NATIVE) revert IXERC20Lockbox_Native();

        _deposit(msg.sender, _amount);`, functions.deposit);

  c.addFunctionCode(`if (IS_NATIVE) revert IXERC20Lockbox_Native();

        _deposit(_to, _amount);`, functions.depositTo);

  c.addModifier('payable', functions.depositNativeTo);
  c.addFunctionCode(`if (!IS_NATIVE) revert IXERC20Lockbox_NotNative();

        _deposit(_to, msg.value);`, functions.depositNativeTo);

  c.addFunctionCode(`_withdraw(msg.sender, _amount);`, functions.withdraw);


  c.addFunctionCode(`_withdraw(_to, _amount);`, functions.withdrawTo);

  c.addFunctionCode(`emit Withdraw(_to, _amount);

        XERC20.burn(msg.sender, _amount);

        if (IS_NATIVE) {
            (bool _success,) = payable(_to).call{value: _amount}('');
        if (!_success) revert IXERC20Lockbox_WithdrawFailed();
        } else {
            ERC20.safeTransfer(_to, _amount);
        }`, functions._withdraw);

  c.addFunctionCode(`if (!IS_NATIVE) {
            ERC20.safeTransferFrom(msg.sender, address(this), _amount);
        }

        XERC20.mint(_to, _amount);
        emit Deposit(_to, _amount);`, functions._deposit);

   c.addReceiveCode(`depositNative();`)

}

export const functions = defineFunctions({

    depositNative: {
      kind: 'public' as const,
      args: [
      ],
    },

    deposit: {
      kind: 'public' as const,
      args: [
        { name: '_amount', type: 'uint256' },
      ],
    },

    depositTo: {
      kind: 'external' as const,
      args: [
        { name: '_to', type: 'address' },
        { name: '_amount', type: 'uint256' },
      ],
    },

    depositNativeTo: {
      kind: 'external' as const,
      args: [
        { name: '_to', type: 'address' },
      ],
    },

    withdraw: {
      kind: 'external' as const,
      args: [
        { name: '_amount', type: 'uint256' },
      ],
    },

    withdrawTo: {
      kind: 'external' as const,
      args: [
        { name: '_to', type: 'address' },
        { name: '_amount', type: 'uint256' },
      ],
    },

    _withdraw: {
      kind: 'internal' as const,
      args: [
        { name: '_to', type: 'address' },
        { name: '_amount', type: 'uint256' },
      ],
    },

    _deposit: {
      kind: 'internal' as const,
      args: [
        { name: '_to', type: 'address' },
        { name: '_amount', type: 'uint256' },
      ],
    },
    


});