<script lang="ts">
    import Background from '$lib/ui/layouts/Background.svelte';
  
    import HelpTooltip from '$lib/ui/controls/HelpTooltip.svelte';
    import AccessOZControlSection from '$lib/ui/controls/AccessOZControlSection.svelte';
    // import UpgradeabilitySection from '$lib/ui/controls/UpgradeabilitySection.svelte';

    import type {  OptionsErrorMessages } from '$lib/wizard/shared';
    import type { KindedAllOptions } from '$lib/wizard/shared';
  
    import { xerc20lockbox } from '$lib/wizard/smart-contracts';
  
  
    const contractDefaults = xerc20lockbox.defaults;
    // const deployDefaults = deployERC4626Votes.defaults;

    type Props = {
      opts: Required<KindedAllOptions['XERC20Lockbox']>;
    };

    let {
      opts = $bindable(),
    }: Props = $props();

    if (opts === undefined) opts = {
      kind: 'XERC20Lockbox',
      ...contractDefaults,
      // ...deployDefaults,
      contractInfo: {  securityContact: 'Consult full code at https://github.com/defi-wonderland/xERC20/blob/main/solidity/contracts/XERC20Lockbox.sol', license: 'MIT'  },
      deployInfo: {  securityContact: 'Consult full internal deploy script at ...', license: 'MIT'  },
    };

    $effect.pre(() => {
      if (opts === undefined) opts = {
        kind: 'XERC20Lockbox',
        ...contractDefaults,
        // ...deployDefaults,
        contractInfo: {  securityContact: 'Consult full code at https://github.com/defi-wonderland/xERC20/blob/main/solidity/contracts/XERC20Lockbox.sol', license: 'MIT'  },
        deployInfo: {  securityContact: 'Consult full internal deploy script at ...', license: 'MIT'  },
      }
    });

    let requireAccessControl = $state(true);

    $effect(() => {
      requireAccessControl = xerc20lockbox.isAccessControlRequired!(opts);
    });
  
</script>
  
<section class="controls-section">

    <Background color="bg-neutral-content">
        <h1>Contract Settings</h1>
    </Background>

    <h1>Parameters</h1>

    <label class="labeled-input">
        <span>Name</span>
        <input bind:value={opts.contractName}>
    </label>

    <label class="labeled-input">
        <span>Symbol</span>
        <input bind:value={opts.tokenSymbol}>
    </label>


</section>



<!-- <AccessOZControlSection bind:access={opts.access} required={requireAccessControl} /> -->
<!-- <UpgradeabilitySection bind:upgradeable={opts.upgradeable} /> -->

<section class="controls-section">
  <h1>
    <!-- svelte-ignore a11y_label_has_associated_control -->
    <label class="flex items-center tooltip-container pr-2">
      <span>Contract Info</span>
    </label>
  </h1>

  <label class="labeled-input">
    <span class="flex justify-between pr-2">
      Reference
      <HelpTooltip align="right" placement="right" link="https://github.com/defi-wonderland/xERC20/blob/main/solidity/contracts/XERC20Lockbox.sol">
          The link to original code
      </HelpTooltip>
    </span>
    <input bind:value={opts.contractInfo.securityContact} placeholder="security@example.com" />
  </label>

  <label class="labeled-input">
    <span>License</span>
    <input bind:value={opts.contractInfo.license} placeholder={opts.contractInfo.license} />
  </label>
</section>