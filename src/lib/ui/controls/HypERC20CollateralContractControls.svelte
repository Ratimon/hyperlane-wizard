<script lang="ts">
  import type { KindedAllOptions } from '$lib/wizard/shared';
  import { hypERC20Collateral } from '$lib/wizard/smart-contracts';

  const contractDefaults = hypERC20Collateral.defaults;
  // const deployDefaults = deployERC4626Votes.defaults;

  type Props = {
    opts: Required<KindedAllOptions['HypERC20Collateral']>;
  };

  let {
    opts = $bindable(),
  }: Props = $props();

  if (opts === undefined) opts = {
    kind: 'HypERC20Collateral',
    ...contractDefaults,
    // ...deployDefaults,
    contractInfo: {  securityContact: 'Consult full code at https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/main/solidity/contracts/token/HypERC20Collateral.sol', license: 'MIT'  },
    deployInfo: {  securityContact: 'Consult full internal deploy script at ...', license: 'MIT'  },
  };

  $effect.pre(() => {
    if (opts === undefined) opts = {
      kind: 'HypERC20Collateral',
      ...contractDefaults,
      // ...deployDefaults,
      contractInfo: {  securityContact: 'Consult full code at https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/main/solidity/contracts/token/HypERC20Collateral.sol', license: 'MIT'  },
      deployInfo: {  securityContact: 'Consult full internal deploy script at ...', license: 'MIT'  },
    }
  });

</script>
