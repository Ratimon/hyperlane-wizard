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


export interface SharedERC20Options extends CommonOptions {
    name: string;
    symbol: string;
    burnable?: boolean;
    pausable?: boolean;
    premint?: string;
    premintChainId?: string;
    mintable?: boolean;
    permit?: boolean;
    /**
     * Whether to keep track of historical balances for voting in on-chain governance, and optionally specify the clock mode.
     * Setting `true` is equivalent to 'blocknumber'. Setting a clock mode implies voting is enabled.
     */
    votes?: boolean | ClockMode;
    flashmint?: boolean;
  //   crossChainBridging?: CrossChainBridging;
}
  
  export const defaults: Required<SharedERC20Options> = {
    name: 'MyToken',
    symbol: 'MTK',
    burnable: false,
    pausable: false,
    premint: '0',
    premintChainId: '',
    mintable: false,
    permit: true,
    votes: false,
    flashmint: false,
    //   crossChainBridging: false,
    access: commonDefaults.access,
    upgradeable: commonDefaults.upgradeable,
    contractInfo: commonDefaults.contractInfo,

    deployInfo: commonDefaults.deployInfo,
    
    testInfo: commonDefaults.testInfo,
  } as const;
  
  export function withDefaults(opts: SharedERC20Options): Required<SharedERC20Options> {
    return {
      ...opts,
      ...withCommonDefaults(opts),
      burnable: opts.burnable ?? defaults.burnable,
      pausable: opts.pausable ?? defaults.pausable,
      premint: opts.premint || defaults.premint,
      premintChainId: opts.premintChainId || defaults.premintChainId,
      mintable: opts.mintable ?? defaults.mintable,
      permit: opts.permit ?? defaults.permit,
      votes: opts.votes ?? defaults.votes,
      flashmint: opts.flashmint ?? defaults.flashmint,
      // crossChainBridging: opts.crossChainBridging ?? defaults.crossChainBridging,
    };
  }