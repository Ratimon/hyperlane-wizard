import { ContractBuilder } from '../contract';

import { withDefaults, defaults as commonDefaults } from "../../shared/dapp/1-option-erc20";
import type { SharedERC4626Options } from "../../shared/dapp/1-option-erc4626";

import type { AccessOZ } from '../set-access-control';
import { setAccessControlOZ, requireAccessControlOZ } from '../set-access-control';


import type { Upgradeable } from '../set-upgradeable';
import { setUpgradeable } from '../set-upgradeable';
import { setInfo } from '../set-info';
import { printContract } from '../print';

import { supportsInterface } from '../common-functions';
import { OptionsError } from '../../shared/error';


export function printERC4626(opts: SharedERC4626Options = commonDefaults): string {
  return printContract(buildERC4626(opts));
}

export function isAccessControlRequired(opts: Partial<SharedERC4626Options>): boolean {
  return  opts.upgradeable === 'uups';
}

export function buildERC4626(opts: SharedERC4626Options): ContractBuilder {
  const allOpts = withDefaults(opts);

  const c = new ContractBuilder(allOpts.contractName);

  const { access, upgradeable, contractInfo } = allOpts;

  addBase(c, allOpts.contractName, allOpts.tokenSymbol);


  setAccessControlOZ(c, access);
  setUpgradeable(c, upgradeable, access);
  setInfo(c, contractInfo);

  return c;
}

function addBase(c: ContractBuilder, name: string, symbol: string) {

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

  const ERC4626 = {
    name: 'ERC4626',
    path: '@openzeppelin-5_2_0/contracts/token/ERC20/extensions/ERC4626.sol',
  };
  c.addParent(ERC4626, [{lit: 'asset'}]);


  const ERC20 = {
    name: 'ERC20',
    path: '@openzeppelin-5_2_0/contracts/token/ERC20/ERC20.sol',
  };

  c.addImportWithNoInheritance(ERC20, [name, symbol])

//   const Ownable = {
//     name: 'Ownable',
//     path: '@openzeppelin-5_2_0/contracts/access/Ownable.sol',
//   };
//   c.addParent(Ownable, [{lit: 'initialOwner'}]);
  
  

  c.addConstructorArgument({
    type: {
      name: 'IERC20',
      transpiled: false,
    },
    name: 'asset',
  });

//   c.addConstructorArgument({
//     type: {
//       name: 'address',
//       transpiled: false,
//     },
//     name: 'initialOwner',
//   });




  
}

