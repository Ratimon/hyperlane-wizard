import type { ContractBuilder, BaseFunction } from './contract';
import { supportsInterface } from './common-functions';

export const accessOptions = [false, 'ownable', 'roles'] as const;
export type Access = typeof accessOptions[number];

export const accessOZOptions = [false, 'ownable', 'roles', 'managed'] as const;
export type AccessOZ = typeof accessOZOptions[number];


function get_authorizeSetRoleFunction() {
  const fn = {
    name: '_authorizeSetRole',
    args: [
      { name: '', type: 'address' },
      { name: '', type: 'uint256' },
      { name: '', type: 'bool' },
    ],
    returns: [ ] , 
    kind: 'internal' as const,
  };

  return fn;
}

/**
 * Sets access control for the contract by adding inheritance.
 */
export function setAccessControl(c: ContractBuilder, access: Access) {
  switch (access) {
    case 'ownable': {

      if (c.addParent(parents.Ownable, [])) {
        c.addConstructorArgument({
          type: 'address',
          name: 'owner_'
        });

        c.addConstructorCode(`_initializeOwner(owner_);`);
      }

      break;
    }
    case 'roles': {

      if (c.addParent(parents.EnumerableRoles)) {
        c.addVariable(`uint256 public constant ADMIN_ROLE = 0;`);
        c.addConstructorArgument({
          type: 'address',
          name: 'defaultAdmin_'
        });
        c.addConstructorCode(`if (defaultAdmin_ != address(0)) {
            _setRole(defaultAdmin_, ADMIN_ROLE, true);
        }`);

        c.addModifier('override(EnumerableRoles)', get_authorizeSetRoleFunction());
        c.addFunctionCode('_checkRole(ADMIN_ROLE);', get_authorizeSetRoleFunction());

      }
      // c.addOverride(parents.EnumerableRoles, supportsInterface);

      break;
    }
    // case 'managed': {
    //   if (c.addParent(parents.AccessManaged, [ {lit: 'initialAuthority'} ])) {
    //     c.addConstructorArgument({
    //       type: 'address',
    //       name: 'initialAuthority'
    //     });
    //   }
    //   break;
    // }
  }
}

// to do: refactor
export function setAccessControlOZ(c: ContractBuilder, access: AccessOZ) {
  switch (access) {
    case 'ownable': {
      if (c.addParent(parentsOZ.Ownable, [{ lit: 'initialOwner' }])) {
        c.addConstructorArgument({
          type: 'address',
          name: 'initialOwner',
        });
      }
      break;
    }
    case 'roles': {
      if (c.addParent(parentsOZ.AccessControl)) {
        c.addConstructorArgument({
          type: 'address',
          name: 'defaultAdmin',
        });
        c.addConstructorCode('_grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);');
      }
      c.addOverride(parentsOZ.AccessControl, supportsInterface);
      break;
    }
    case 'managed': {
      if (c.addParent(parentsOZ.AccessManaged, [{ lit: 'initialAuthority' }])) {
        c.addConstructorArgument({
          type: 'address',
          name: 'initialAuthority',
        });
      }
      break;
    }
  }
}

/**
 * Enables access control for the contract and restricts the given function with access control.
 */
export function requireAccessControl(c: ContractBuilder, fn: BaseFunction, access: Access, roleIdPrefix: string, roleIdValue: string, roleOwner: string | undefined) {

  if (access === false) {
    access = 'ownable';
  }
  
  setAccessControl(c, access);

  switch (access) {
    case 'ownable': {
      c.addModifier('onlyOwner', fn);
      break;
    }
    case 'roles': {
      // const roleId = roleIdPrefix + '_ROLE';
      // const addedConstant = c.addVariable(`bytes32 public constant ${roleId} = keccak256("${roleId}");`);
      // if (roleOwner && addedConstant) {
      //   c.addConstructorArgument({type: 'address', name: roleOwner});
      //   c.addConstructorCode(`_grantRole(${roleId}, ${roleOwner});`);
      // }
      // c.addModifier(`onlyRole(${roleId})`, fn);
      // break;

      const roleId = roleIdPrefix + '_ROLE';
      const addedConstant = c.addVariable(`uint256 public constant ${roleId} = ${roleIdValue};`);
      if (roleOwner && addedConstant) {
        c.addConstructorArgument({
          type: 'address',
          name: roleOwner
        });
        // c.addConstructorCode(`_grantRole(${roleId}, ${roleOwner});`);

        c.addConstructorCode(`if (${roleOwner} != address(0)) {
          _setRole(${roleOwner}, ${roleId}, true);
        }`);
      }
      c.addModifier(`onlyRole(${roleId})`, fn);
      break;
    }
    // case 'managed': {
    //   c.addModifier('restricted', fn);
    //   break;
    // }
  }
}

/**
 * Enables access control for the contract and restricts the given function with access control.
 */
export function requireAccessControlOZ(
  c: ContractBuilder,
  fn: BaseFunction,
  access: AccessOZ,
  roleIdPrefix: string,
  roleOwner: string | undefined,
) {
  if (access === false) {
    access = 'ownable';
  }

  setAccessControlOZ(c, access);

  switch (access) {
    case 'ownable': {
      c.addModifier('onlyOwner', fn);
      break;
    }
    case 'roles': {
      const roleId = roleIdPrefix + '_ROLE';
      const addedConstant = c.addVariable(`bytes32 public constant ${roleId} = keccak256("${roleId}");`);
      if (roleOwner && addedConstant) {
        c.addConstructorArgument({ type: 'address', name: roleOwner });
        c.addConstructorCode(`_grantRole(${roleId}, ${roleOwner});`);
      }
      c.addModifier(`onlyRole(${roleId})`, fn);
      break;
    }
    case 'managed': {
      c.addModifier('restricted', fn);
      break;
    }
  }
}

const parents = {
  Ownable: {
    name: 'Ownable',
    path: '@solady-v0.1.8/auth/Ownable.sol',
  },
  EnumerableRoles: {
    name: 'EnumerableRoles',
    path: '@solady-v0.1.8/auth/EnumerableRoles.sol',
  },
  // AccessManaged: {
  //   name: 'AccessManaged',
  //   path: '@openzeppelin/contracts/access/manager/AccessManaged.sol',
  // },
};

const parentsOZ = {
  Ownable: {
    name: 'Ownable',
    path: '@openzeppelin-5_2_0/contracts/access/Ownable.sol',
  },
  AccessControl: {
    name: 'AccessControl',
    path: '@openzeppelin-5_2_0/contracts/access/AccessControl.sol',
  },
  AccessManaged: {
    name: 'AccessManaged',
    path: '@openzeppelin-5_2_0/contracts/access/manager/AccessManaged.sol',
  },
};