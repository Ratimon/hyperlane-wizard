import type { CommonOptions} from '../common-options';
import { defaults as infoDefaults } from "../set-info";

import type { ClockMode} from '../../smart-contracts/set-clock-mode';


export const commonDefaults: Required<CommonOptions> = {
    //contract
    access: false,
    upgradeable: false,
    contractInfo: infoDefaults,
  
    //deploy
    deployInfo: infoDefaults,
  
    //test
    testInfo: infoDefaults,
} as const;
  
  
export function withCommonDefaults(opts: CommonOptions): Required<CommonOptions> {
    return {
      access: opts.access ?? false,
      upgradeable: opts.upgradeable ?? false,
      contractInfo: opts.contractInfo ?? {},
      
      deployInfo: opts.deployInfo ?? {},
  
      testInfo: opts.testInfo ?? {},
    };
}


export interface SharedERC4626Options extends CommonOptions {
    contractName: string;
    tokenSymbol: string;


  //   crossChainBridging?: CrossChainBridging;
}
  
  export const defaults: Required<SharedERC4626Options> = {
    contractName: 'MyERC4626',
    tokenSymbol: 'ME',
    
    //   crossChainBridging: false,
    access: commonDefaults.access,
    upgradeable: commonDefaults.upgradeable,
    contractInfo: commonDefaults.contractInfo,

    deployInfo: commonDefaults.deployInfo,
    
    testInfo: commonDefaults.testInfo,
  } as const;
  
  export function withDefaults(opts: SharedERC4626Options): Required<SharedERC4626Options> {
    return {
      ...opts,
      ...withCommonDefaults(opts),

    };
  }