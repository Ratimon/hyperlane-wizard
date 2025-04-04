<script lang="ts">
    import type { KindedAllOptions } from '$lib/wizard/shared';
    import { hypXERC20Lockbox } from '$lib/wizard/smart-contracts';
  
    const contractDefaults = hypXERC20Lockbox.defaults;
  
    type Props = {
      opts: Required<KindedAllOptions['HypXERC20Lockbox']>;
    };
  
    let {
      opts = $bindable(),
    }: Props = $props();
  
    if (opts === undefined) opts = {
      kind: 'HypXERC20Lockbox',
      ...contractDefaults,
      // ...deployDefaults,
      contractInfo: {  securityContact: 'Consult full code at https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/main/solidity/contracts/token/extensions/HypXERC20Lockbox.sol', license: 'MIT'  },
      deployInfo: {  securityContact: 'Consult full internal deploy script at ...', license: 'MIT'  },
    };
  
    $effect.pre(() => {
      if (opts === undefined) opts = {
        kind: 'HypXERC20Lockbox',
        ...contractDefaults,
        // ...deployDefaults,
        contractInfo: {  securityContact: 'Consult full code at https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/main/solidity/contracts/token/extensions/HypXERC20Lockbox.sol', license: 'MIT'  },
        deployInfo: {  securityContact: 'Consult full internal deploy script at ...', license: 'MIT'  },
      }
    });
  
</script>