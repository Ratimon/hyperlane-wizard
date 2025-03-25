<script  lang="ts">
    import type { PageData } from "./$types";

    import type { Contract } from '$lib/wizard/smart-contracts';
    import { ContractBuilder, buildContractGeneric } from '$lib/wizard/smart-contracts';

    import type { KindedOptions, Kind, OptionsErrorMessages } from '$lib/wizard/shared';
    import {  sanitizeKind, OptionsError } from '$lib/wizard/shared';

    // import WizardSingle from '$lib/ui/components/WizardSingle.svelte';

    type Props = {
        data: PageData;
    } & PageData;

    let { data }: Props = $props();

    let initialContractTab: string | undefined = $state('L2NativeSuperchainERC20');
    let contractTab: Kind = $derived(sanitizeKind(initialContractTab));
    let allOpts: { [k in Kind]?: Required<KindedOptions [k]> } =  $state({});

    let contract: Contract = $state(new ContractBuilder('HypERC20Collateral'));
    const opts = $derived(allOpts[contractTab]);

    let errors : { [k in Kind]?: OptionsErrorMessages } =  $state({});


    $effect(() => {
    if (opts) {
      try {
          contract = buildContractGeneric(opts);
        //   deployContract = buildDeployGeneric(opts);
        //   testContract = buildTestGeneric(opts);

          errors[contractTab] = undefined;
        } catch (e: unknown) {
          if (e instanceof OptionsError) {
              errors[contractTab] = e.messages;
          } else {
          throw e;
          }
        }
    }
  });


</script>

Test