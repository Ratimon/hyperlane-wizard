<script lang="ts">
    import type { KindedAllOptions } from '$lib/wizard/shared';
    import { hypERC4626OwnerCollateral } from '$lib/wizard/smart-contracts';
  
    const contractDefaults = hypERC4626OwnerCollateral.defaults;
  
    type Props = {
      opts: Required<KindedAllOptions['HypERC4626OwnerCollateral']>;
    };
  
    let {
      opts = $bindable(),
    }: Props = $props();
  
    if (opts === undefined) opts = {
      kind: 'HypERC4626OwnerCollateral',
      ...contractDefaults,
      // ...deployDefaults,
      contractInfo: {  securityContact: 'Consult full code at https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/main/solidity/contracts/token/extensions/HypERC4626OwnerCollateral.sol', license: 'MIT'  },
      deployInfo: {  securityContact: 'Consult full internal deploy script at ...', license: 'MIT'  },
    };
  
    $effect.pre(() => {
      if (opts === undefined) opts = {
        kind: 'HypERC4626OwnerCollateral',
        ...contractDefaults,
        // ...deployDefaults,
        contractInfo: {  securityContact: 'Consult full code at https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/main/solidity/contracts/token/extensions/HypERC4626OwnerCollateral.sol', license: 'MIT'  },
        deployInfo: {  securityContact: 'Consult full internal deploy script at ...', license: 'MIT'  },
      }
    });
  
</script>
  