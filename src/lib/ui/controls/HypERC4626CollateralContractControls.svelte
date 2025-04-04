<script lang="ts">
    import type { KindedAllOptions } from '$lib/wizard/shared';
    import { hypERC4626Collateral } from '$lib/wizard/smart-contracts';
  
    const contractDefaults = hypERC4626Collateral.defaults;
  
    type Props = {
      opts: Required<KindedAllOptions['HypERC4626Collateral']>;
    };
  
    let {
      opts = $bindable(),
    }: Props = $props();
  
    if (opts === undefined) opts = {
      kind: 'HypERC4626Collateral',
      ...contractDefaults,
      // ...deployDefaults,
      contractInfo: {  securityContact: 'Consult full code at https://github.com/defi-wonderland/xERC4626', license: 'MIT'  },
      deployInfo: {  securityContact: 'Consult full internal deploy script at ...', license: 'MIT'  },
    };
  
    $effect.pre(() => {
      if (opts === undefined) opts = {
        kind: 'HypERC4626Collateral',
        ...contractDefaults,
        // ...deployDefaults,
        contractInfo: {  securityContact: 'Consult full code at https://github.com/defi-wonderland/xERC4626', license: 'MIT'  },
        deployInfo: {  securityContact: 'Consult full internal deploy script at ...', license: 'MIT'  },
      }
    });
  
</script>
  