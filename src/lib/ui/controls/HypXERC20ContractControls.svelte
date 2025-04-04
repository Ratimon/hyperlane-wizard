<script lang="ts">
    import type { KindedAllOptions } from '$lib/wizard/shared';
    import { hypXERC20 } from '$lib/wizard/smart-contracts';
  
    const contractDefaults = hypXERC20.defaults;
  
    type Props = {
      opts: Required<KindedAllOptions['HypXERC20']>;
    };
  
    let {
      opts = $bindable(),
    }: Props = $props();
  
    if (opts === undefined) opts = {
      kind: 'HypXERC20',
      ...contractDefaults,
      // ...deployDefaults,
      contractInfo: {  securityContact: 'Consult full code athttps://github.com/hyperlane-xyz/hyperlane-monorepo/blob/main/solidity/contracts/token/extensions/HypXERC20.sol', license: 'MIT'  },
      deployInfo: {  securityContact: 'Consult full internal deploy script at ...', license: 'MIT'  },
    };
  
    $effect.pre(() => {
      if (opts === undefined) opts = {
        kind: 'HypXERC20',
        ...contractDefaults,
        // ...deployDefaults,
        contractInfo: {  securityContact: 'Consult full code at https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/main/solidity/contracts/token/extensions/HypXERC20.sol', license: 'MIT'  },
        deployInfo: {  securityContact: 'Consult full internal deploy script at ...', license: 'MIT'  },
      }
    });
  
</script>