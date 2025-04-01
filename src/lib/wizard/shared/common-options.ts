import type { Info } from "./set-info";
import { defaults as infoDefaults } from "./set-info";

import type { Access, AccessOZ } from "../smart-contracts/set-access-control";
import type { Upgradeable } from "../smart-contracts/set-upgradeable";


export interface CommonOptions {
  access?: Access | AccessOZ;
  upgradeable?: Upgradeable;
  contractInfo?: Info;

  deployInfo?: Info;
  testInfo?: Info;
}

export const defaults: Required<CommonOptions> = {
  access: false,
  upgradeable: false,
  contractInfo: infoDefaults,

  deployInfo: infoDefaults,
  testInfo: infoDefaults,
} as const;


// export const defaultsOnlyContract: Partial<CommonOptions> = {
//   access: false,
//   upgradeable: false,
//   contractInfo: infoDefaults,
// } as const;


export interface CommonOptions {
  access?: Access | AccessOZ;
  upgradeable?: Upgradeable;
  contractInfo?: Info;

  deployInfo?: Info;
  
  testInfo?: Info;
}

export function withCommonDefaults(opts: CommonOptions): Required<CommonOptions> {
  return {
    access: opts.access ?? false,
    upgradeable: opts.upgradeable ?? false,
    contractInfo: opts.contractInfo ?? {},

    deployInfo: opts.deployInfo ?? {},
    testInfo: opts.testInfo ?? {},
  };
}
