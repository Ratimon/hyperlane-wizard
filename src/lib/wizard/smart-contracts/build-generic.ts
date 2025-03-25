import type { SharedERC20PrimaryOptions} from '../shared/dapp/1-option-erc20-primary';
import { buildERC20Primary } from './dapp/1-erc20-primary';


export interface KindedOptions {
    ERC20Primary: { kind: 'ERC20Primary' } & SharedERC20PrimaryOptions;
}

export type GenericOptions = KindedOptions[keyof KindedOptions];

export function buildContractGeneric(opts: GenericOptions) {
    switch (opts.kind) {

        case 'ERC20Primary':
            return buildERC20Primary(opts);

        // tdo : bring when there are at least two casess
        
        // default:
        //     const _: never = opts;
        //     throw new Error('Unknown Contract');
    }
}
  