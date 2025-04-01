<script lang="ts">
    import Background from '$lib/ui/layouts/Background.svelte';
  
    import HelpTooltip from '$lib/ui/controls/HelpTooltip.svelte';
    import ToggleRadio from '$lib/ui/inputs/ToggleRadio.svelte';
    import AccessOZControlSection from '$lib/ui/controls/AccessOZControlSection.svelte';
    // import UpgradeabilitySection from '$lib/ui/controls/UpgradeabilitySection.svelte';

    import type {  OptionsErrorMessages } from '$lib/wizard/shared';
    import type { KindedPrimaryTokenOptions } from '$lib/wizard/shared';
  
    import { erc4626 } from '$lib/wizard/smart-contracts';
    // import { deployERC4626 } from '$lib/wizard/deploy-scripts';
  
  
    const contractDefaults = erc4626.defaults;
    // const deployDefaults = deployERC4626Votes.defaults;

    type Props = {
      opts: Required<KindedPrimaryTokenOptions['ERC4626']>;
    };

    let {
      opts = $bindable(),
    }: Props = $props();

    if (opts === undefined) opts = {
      kind: 'ERC4626',
      ...contractDefaults,
      //   premint: '', // default to empty premint in UI instead of 0
      // ...deployDefaults,
      contractInfo: {  securityContact: 'Consult full code at https://github.com/OpenZeppelin/openzeppelin-contracts', license: 'MIT'  },
      deployInfo: {  securityContact: 'Consult full internal deploy script at https://github.com/Ratimon/superfuse-forge', license: 'MIT'  },
    };

    $effect.pre(() => {
      if (opts === undefined) opts = {
        kind: 'ERC4626',
        ...contractDefaults,
        //   premint: '', // default to empty premint in UI instead of 0
        // ...deployDefaults,
        contractInfo: {  securityContact: 'Consult full code at https://github.com/OpenZeppelin/openzeppelin-contracts', license: 'MIT'  },
        deployInfo: {  securityContact: 'Consult full internal deploy script at https://github.com/Ratimon/superfuse-forge', license: 'MIT'  },
      }
    });

    let requireAccessControl = $state(true);

    $effect(() => {
      requireAccessControl = erc4626.isAccessControlRequired!(opts);
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


    <!-- <label class="labeled-input">
        <span class="flex justify-between pr-2">
            Premint
            <HelpTooltip placement="right" align="right" link="https://docs.openzeppelin.com/contracts/api/token/ERC4626#ERC4626-_mint-address-uint256-">
            Create an initial amount of tokens for the deployer.</HelpTooltip>
        </span>
        <input bind:value={opts.premint} placeholder="0" pattern={premintPattern.source}>
    </label> -->

</section>



<AccessOZControlSection bind:access={opts.access} required={requireAccessControl} />
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
      <HelpTooltip align="right" placement="right" link="https://github.com/Ratimon/superfuse-forge/tree/main">
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