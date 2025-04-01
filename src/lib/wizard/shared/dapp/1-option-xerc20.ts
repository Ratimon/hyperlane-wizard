import type { CommonOptions} from '../common-options';
import { defaults as infoDefaults } from "../set-info";


export const commonDefaults: Required<CommonOptions> = {
    //contract
    access: "ownable",
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

export interface SharedXERC20Options extends CommonOptions {
    contractName: string;
    tokenSymbol: string;

    permit?: boolean;
}
  
  export const defaults: Required<SharedXERC20Options> = {
    contractName: 'MyXERC20',
    tokenSymbol: 'ME',

    permit: true,

    access: commonDefaults.access,
    upgradeable: commonDefaults.upgradeable,
    contractInfo: commonDefaults.contractInfo,

    deployInfo: commonDefaults.deployInfo,
    
    testInfo: commonDefaults.testInfo,
  } as const;
  
  export function withDefaults(opts: SharedXERC20Options): Required<SharedXERC20Options> {
    return {
      ...opts,
      ...withCommonDefaults(opts),

      permit: opts.permit ?? defaults.permit,

    };
  }