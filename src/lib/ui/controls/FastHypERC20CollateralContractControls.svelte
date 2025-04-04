<script lang="ts">
    import type { KindedAllOptions } from '$lib/wizard/shared';
    import { fastHypERC20Collateral } from '$lib/wizard/smart-contracts';
  
    const contractDefaults = fastHypERC20Collateral.defaults;
  
    type Props = {
      opts: Required<KindedAllOptions['FastHypERC20Collateral']>;
    };
  
    let {
      opts = $bindable(),
    }: Props = $props();
  
    if (opts === undefined) opts = {
      kind: 'FastHypERC20Collateral',
      ...contractDefaults,
      // ...deployDefaults,
      contractInfo: {  securityContact: 'Consult full code at https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/main/solidity/contracts/token/extensions/FastHypERC20Collateral.sol', license: 'MIT'  },
      deployInfo: {  securityContact: 'Consult full internal deploy script at ...', license: 'MIT'  },
    };
  
    $effect.pre(() => {
      if (opts === undefined) opts = {
        kind: 'FastHypERC20Collateral',
        ...contractDefaults,
        // ...deployDefaults,
        contractInfo: {  securityContact: 'Consult full code at https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/main/solidity/contracts/token/extensions/FastHypERC20Collateral.sol', license: 'MIT'  },
        deployInfo: {  securityContact: 'Consult full internal deploy script at ...', license: 'MIT'  },
      }
    });
  
  </script>
  