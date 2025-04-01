import { ContractBuilder } from '../contract';

import { withDefaults, defaults as commonDefaults } from "../../shared/dapp/1-option-erc20";
import type { SharedXERC20Options } from "../../shared/dapp/1-option-xerc20";

import type { AccessOZ } from '../set-access-control';
import { setAccessControlOZ, requireAccessControlOZ } from '../set-access-control';
import { defineFunctions } from '../../utils/define-functions';

import type { Upgradeable } from '../set-upgradeable';
import { setUpgradeable } from '../set-upgradeable';
import { setInfo } from '../set-info';
import { printContract } from '../print';


export function printXERC20(opts: SharedXERC20Options = commonDefaults): string {
  return printContract(buildXERC20(opts));
}

export function isAccessControlRequired(opts: Partial<SharedXERC20Options>): boolean {
  return  opts.upgradeable === 'uups';
}

export function buildXERC20(opts: SharedXERC20Options): ContractBuilder {
  const allOpts = withDefaults(opts);

  const c = new ContractBuilder(allOpts.contractName);

  const { access, upgradeable, contractInfo } = allOpts;

  addBase(c, allOpts.contractName, allOpts.tokenSymbol);

  addLimit(c, access);


  if (allOpts.permit ) {
    addPermit(c, allOpts.contractName);
  }

  

  setAccessControlOZ(c, access);
  setUpgradeable(c, upgradeable, access);
  setInfo(c, contractInfo);

  return c;
}

function addBase(c: ContractBuilder, name: string, symbol: string) {
    
  const IXERC20 = {
    name: 'IXERC20',
    path: '@xerc20-1_0_0/interfaces/IXERC20.sol',
  };
  c.addParent(IXERC20, []);

  const ERC20 = {
    name: 'ERC20',
    path: '@openzeppelin-5_2_0/contracts/token/ERC20/ERC20.sol',
  };
  c.addParent(ERC20, [name, symbol]);

  c.addVariable(`uint256 private constant _DURATION = 1 days;`);

  c.addVariable(`address public lockbox;`);

  c.addVariable(`mapping(address => Bridge) public bridges;`);

  c.addConstructorArgument({
    type: {
      name: 'address',
      transpiled: false,
    },
    name: '_lockbox',
  });

  c.addConstructorCode(`lockbox = _lockbox;`);
  
}


function addPermit(c: ContractBuilder, name: string) {
  const ERC20Permit = {
    name: 'ERC20Permit',
    path: '@openzeppelin-5_2_0/contracts/token/ERC20/extensions/ERC20Permit.sol',
  };
  c.addParent(ERC20Permit, [name]);
}

function addLimit(c: ContractBuilder, access: AccessOZ) {

    requireAccessControlOZ(c, functions.setLockbox, access, 'SETTER', 'setter');
    c.addFunctionCode(`lockbox = _lockbox;

        emit LockboxSet(_lockbox);`, functions.setLockbox);


    requireAccessControlOZ(c, functions.setLimits, access, 'SETTER', 'setter');
    c.addFunctionCode(`if (_mintingLimit > (type(uint256).max / 2) || _burningLimit > (type(uint256).max / 2)) {
            revert IXERC20_LimitsTooHigh();
        }

        _changeMinterLimit(_bridge, _mintingLimit);
        _changeBurnerLimit(_bridge, _burningLimit);
        emit BridgeLimitsSet(_mintingLimit, _burningLimit, _bridge);`, functions.setLimits);
    

    requireAccessControlOZ(c, functions.mint, access, 'MINTER', 'minter');
    c.addFunctionCode(`_mintWithCaller(msg.sender, _user, _amount);`, functions.mint);

    c.addFunctionCode(`if (msg.sender != _user) {
            _spendAllowance(_user, msg.sender, _amount);
        }
    
        _burnWithCaller(msg.sender, _user, _amount);`, functions.burn);

    c.addFunctionCode(`_limit = bridges[_bridge].minterParams.maxLimit;`, functions.mintingMaxLimitOf);

    c.addFunctionCode(`_limit = bridges[_bridge].burnerParams.maxLimit;`, functions.burningMaxLimitOf);

    c.addFunctionCode(`_limit = _getCurrentLimit(
        bridges[_bridge].minterParams.currentLimit,
        bridges[_bridge].minterParams.maxLimit,
        bridges[_bridge].minterParams.timestamp,
        bridges[_bridge].minterParams.ratePerSecond
        );`, functions.mintingCurrentLimitOf);

    c.addFunctionCode(`_limit = _getCurrentLimit(
        bridges[_bridge].burnerParams.currentLimit,
        bridges[_bridge].burnerParams.maxLimit,
        bridges[_bridge].burnerParams.timestamp,
        bridges[_bridge].burnerParams.ratePerSecond
        );`, functions.burningCurrentLimitOf);

    c.addFunctionCode(`uint256 _currentLimit = mintingCurrentLimitOf(_bridge);
        bridges[_bridge].minterParams.timestamp = block.timestamp;
        bridges[_bridge].minterParams.currentLimit = _currentLimit - _change;`, functions._useMinterLimits );

    c.addFunctionCode(`uint256 _currentLimit = burningCurrentLimitOf(_bridge);
        bridges[_bridge].burnerParams.timestamp = block.timestamp;
        bridges[_bridge].burnerParams.currentLimit = _currentLimit - _change;`, functions._useBurnerLimits);

    c.addFunctionCode(`uint256 _oldLimit = bridges[_bridge].burnerParams.maxLimit;
        uint256 _currentLimit = burningCurrentLimitOf(_bridge);
        bridges[_bridge].burnerParams.maxLimit = _limit;

        bridges[_bridge].burnerParams.currentLimit = _calculateNewCurrentLimit(_limit, _oldLimit, _currentLimit);

        bridges[_bridge].burnerParams.ratePerSecond = _limit / _DURATION;
        bridges[_bridge].burnerParams.timestamp = block.timestamp;`, functions._changeMinterLimit);

    c.addFunctionCode(`uint256 _oldLimit = bridges[_bridge].burnerParams.maxLimit;
        uint256 _currentLimit = burningCurrentLimitOf(_bridge);
        bridges[_bridge].burnerParams.maxLimit = _limit;

        bridges[_bridge].burnerParams.currentLimit = _calculateNewCurrentLimit(_limit, _oldLimit, _currentLimit);`, functions._changeBurnerLimit);


    c.addFunctionCode(`uint256 _difference;

        if (_oldLimit > _limit) {
            _difference = _oldLimit - _limit;
            _newCurrentLimit = _currentLimit > _difference ? _currentLimit - _difference : 0;
        } else {
            _difference = _limit - _oldLimit;
            _newCurrentLimit = _currentLimit + _difference;
        }`, functions._calculateNewCurrentLimit);

    c.addFunctionCode(`_limit = _currentLimit;
        if (_limit == _maxLimit) {
            return _limit;
        } else if (_timestamp + _DURATION <= block.timestamp) {
            _limit = _maxLimit;
        } else if (_timestamp + _DURATION > block.timestamp) {
            uint256 _timePassed = block.timestamp - _timestamp;
            uint256 _calculatedLimit = _limit + (_timePassed * _ratePerSecond);
            _limit = _calculatedLimit > _maxLimit ? _maxLimit : _calculatedLimit;
        }`, functions._getCurrentLimit);

    c.addFunctionCode(`if (_caller != lockbox) {
        uint256 _currentLimit = mintingCurrentLimitOf(_caller);
        if (_currentLimit < _amount) revert IXERC20_NotHighEnoughLimits();
            _useMinterLimits(_caller, _amount);
        }
        _mint(_user, _amount);`, functions._mintWithCaller);

    
    c.addFunctionCode(`if (_caller != lockbox) {
        uint256 _currentLimit = burningCurrentLimitOf(_caller);
        if (_currentLimit < _amount) revert IXERC20_NotHighEnoughLimits();
            _useBurnerLimits(_caller, _amount);
        }
        _burn(_user, _amount);`, functions._burnWithCaller);

    c.addFunctionCode(`_burnWithCaller(msg.sender, _user, _amount);`, functions._burnWithCaller);
}


export const functions = defineFunctions({

  setLockbox: {
    kind: 'public' as const,
    args: [
      { name: '_lockbox', type: 'address' },
    ],
  },

  setLimits: {
    kind: 'external' as const,
    args: [
      { name: '_bridge', type: 'address' },
      { name: '_mintingLimit', type: 'uint256' },
      { name: '_burningLimit', type: 'uint256' },
    ],
  },

  mint: {
    kind: 'public' as const,
    args: [
      { name: '_user', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
  },

  burn: {
    kind: 'public' as const,
    args: [
      { name: '_user', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
  },

  mintingMaxLimitOf: {
    kind: 'public' as const,
    args: [
      { name: '_bridge', type: 'address' },
    ],
    returns: ['uint256 _limit'],
    mutability: 'view' as const,
  },

  burningMaxLimitOf: {
    kind: 'public' as const,
    args: [
      { name: '_bridge', type: 'address' },
    ],
    returns: ['uint256 _limit'],
    mutability: 'view' as const,
  },

  mintingCurrentLimitOf: {
    kind: 'public' as const,
    args: [
      { name: '_bridge', type: 'address' },
    ],
    returns: ['uint256 _limit'],
    mutability: 'view' as const,
  },

  burningCurrentLimitOf: {
    kind: 'public' as const,
    args: [
      { name: '_bridge', type: 'address' },
    ],
    returns: ['uint256 _limit'],
    mutability: 'view' as const,
  },

  _useMinterLimits: {
    kind: 'internal' as const,
    args: [
        { name: '_bridge', type: 'address' },
        { name: '_change', type: 'uint256' },
    ],
  },

  _useBurnerLimits: {
    kind: 'internal' as const,
    args: [
        { name: '_bridge', type: 'address' },
        { name: '_change', type: 'uint256' },
    ],
  },

  _changeMinterLimit: {
    kind: 'internal' as const,
    args: [
        { name: '_bridge', type: 'address' },
        { name: '_limit', type: 'uint256' },
    ],
  },

  _changeBurnerLimit: {
    kind: 'internal' as const,
    args: [
        { name: '_bridge', type: 'address' },
        { name: '_limit', type: 'uint256' },
    ],
  },

  _calculateNewCurrentLimit: {
    kind: 'internal' as const,
    args: [
        { name: '_limit', type: 'uint256' },
        { name: '_oldLimit', type: 'uint256' },
        { name: '_currentLimit', type: 'uint256' },
    ],
    returns: ['uint256 _newCurrentLimit'],
    mutability: 'pure' as const,
  },

  _getCurrentLimit: {
    kind: 'internal' as const,
    args: [
        { name: '_currentLimit', type: 'uint256' },
        { name: '_maxLimit', type: 'uint256' },
        { name: '_timestamp', type: 'uint256' },
        { name: '_ratePerSecond', type: 'uint256' },
    ],
    returns: ['uint256 _limit'],
    mutability: 'view' as const,
  },
  
  
  _mintWithCaller: {
    kind: 'internal' as const,
    args: [
        { name: '_caller', type: 'address' },
        { name: '_user', type: 'address' },
        { name: '_amount', type: 'uint256' },
    ],
  },

  _burnWithCaller: {
    kind: 'internal' as const,
    args: [
        { name: '_caller', type: 'address' },
        { name: '_user', type: 'address' },
        { name: '_amount', type: 'uint256' },
    ],
  },


});