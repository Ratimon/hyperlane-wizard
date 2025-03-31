<script lang="ts">
    import type { PageData } from "./$types";
    import type {Link } from '$lib/model/Link';

    import type { Contract } from '$lib/wizard/smart-contracts';
    import { ContractBuilder, buildContractGeneric } from '$lib/wizard/smart-contracts';

    import type {
      KindedERC20Options,
      KindERC20,
      KindedFromOptions,
      KindedToOptions,
      KindFrom,
      KindTo,
      OptionsErrorMessages
    } from '$lib/wizard/shared';

    import { 
      sanitizeKindERC20,
      OptionsError,
      sanitizeKindFrom,
      sanitizeKindTo,
      sanitizeKind
    } from '$lib/wizard/shared';

    import {icons} from '$data/icon';

    import AbstractIcon from '$lib/ui/icons/AbstractIcon.svelte';
    import Background from '$lib/ui/layouts/Background.svelte';
    import Button from "$lib/ui/buttons/Button.svelte";
    // import WizardSingle from '$lib/ui/components/WizardSingle.svelte';
    import ScrollStep from '$lib/ui/components/ScrollStep.svelte';
    import WizardSingle from '$lib/ui/components/WizardSingle.svelte';
    import OverflowMenu from '$lib/ui/layouts/OverflowMenu.svelte';
    import ERC20ContractControls from '$lib/ui/controls/ERC20ContractControls.svelte';

    type Props = {
        data: PageData;
    } & PageData;

    let { data }: Props = $props();

    const stepLinks : Link[] = [
        {pathname: '#1-select-routes', title: 'Select Routes', navType: 'scroll' },
        {pathname: '#2-primary-erc20', title: 'Deploy Primary ERC20', navType: 'scroll' },
        {pathname: '#3-deploy', title: 'Deploy', navType: 'scroll'},
    ];

    let initialContractPrimaryTokenTab: string | undefined = $state('MyERC20');
    let contractPrimaryTokenTab: KindERC20 = $derived(sanitizeKindERC20(initialContractPrimaryTokenTab));
    let allOptsPrimaryToken: { [k in KindERC20]?: Required<KindedERC20Options [k]> } =  $state({});

    let contractPrimaryToken: Contract = $state(new ContractBuilder('MyERC20'));
    const optsPrimaryToken = $derived(allOptsPrimaryToken[contractPrimaryTokenTab]);

    let errorsPrimaryToken : { [k in KindERC20]?: OptionsErrorMessages } =  $state({});

    $effect(() => {
      if (optsPrimaryToken) {
        try {
          contractPrimaryToken = buildContractGeneric(optsPrimaryToken) as Contract;
        //   deployContract = buildDeployGeneric(opts);
        //   testContract = buildTestGeneric(opts);

          errorsPrimaryToken[contractPrimaryTokenTab] = undefined;
        } catch (e: unknown) {
          if (e instanceof OptionsError) {
              errorsPrimaryToken[contractPrimaryTokenTab] = e.messages;
          } else {
          throw e;
          }
        }
      }
    });

    type Route = 'Pick a route'
      | 'Collateral to Synthetic'
      | 'xERC20 Routes';
    type RouteState = 'SettingUproute'
      | 'SettingTokens'
      | 'DeployingPrimaryToken'
      | 'DeployingRoutes';

    type WarpRoute = {
      state: RouteState;
      route: Route;
      // tokenFrom: string;
      // tokenTo: string;
      // error?: unknown;
    };

    const warpRouteState: WarpRoute = $state({
      state: 'SettingUproute',
      route: 'Pick a route',
      tokenFrom: '',
      tokenTo: '',
    });

    function selectRoute(warpRoute: WarpRoute) {
      warpRouteState.state = 'SettingTokens';
      warpRouteState.route = warpRoute.route;

      if (warpRoute.route === 'Collateral to Synthetic') {
        initialContractFromTab = 'HypERC20Collateral'
        initialContractToTab = 'HypERC20'

      } else if (warpRoute.route === 'xERC20 Routes') {
        initialContractFromTab = 'xERC20Lockbox'
        initialContractToTab = 'xERC20Lockbox'
      }
    }

    let openDropdownFrom: boolean = $state(false)
    function selectTokenFrom(contractName: string) {
      initialContractFromTab = contractName
      openDropdownFrom = false
    }

    let openDropdownTo: boolean = $state(false)
    function selectTokenTo(contractName: string) {
      initialContractToTab = contractName
      openDropdownTo = false
    }

  let contractFromLists = [
    {
      name: 'HypERC20Collateral',
      label: 'HypERC20Collateral.sol',
      route: 'Collateral to Synthetic',
      primaryToken: 'ERC20'
    },
    {
      name: 'HypFiatToken',
      label: 'HypFiatToken.sol',
      route: 'Collateral to Synthetic',
      primaryToken: 'ERC20'
    },
    {
      name: 'HypERC4626Collateral',
      label: 'HypERC4626Collateral.sol',
      route: 'Collateral to Synthetic',
      primaryToken: 'ERC4626'
    },
    {
      name: 'HypERC4626OwnerCollateral',
      label: 'HypERC4626OwnerCollateral',
      route: 'Collateral to Synthetic',
      primaryToken: 'ERC4626'
    },
    {
      name: 'FastHypERC20Collateral',
      label: 'FastHypERC20Collateral',
      route: 'Collateral to Synthetic',
      primaryToken: 'ERC20'
    },
    {
      name: 'HypXERC20Lockbox',
      label: 'HypXERC20Lockbox.sol',
      route: 'xERC20 Routes',
      primaryToken: 'XERC20Lockbox'
    },
    {
      name: 'HypXERC20',
      label: 'HypXERC20.sol',
      route: 'xERC20 Routes',
      primaryToken: 'XERC20'
    },
    
  ]

  let contractFromListsFiltered = $derived(
     contractFromLists.filter(contract => contract.route === warpRouteState.route)
  )

  let initialContractFromTab: string | undefined = $state(undefined);
  let contractFromTab : KindFrom = $derived(sanitizeKindFrom(initialContractFromTab));
  let allOptsFrom: { [k in KindFrom]?: Required<KindedFromOptions [k]> } =  $state({});

  let contractFrom: Contract = $state(new ContractBuilder('HypERC20Collateral'));
  const optsContractFrom = $derived(allOptsFrom[contractFromTab]);

  // let errorsContractFrom : { [k in KindFrom]?: OptionsErrorMessages } =  $state({});

  $effect(() => {
      if (optsContractFrom) {
        try {
          contractFrom = buildContractGeneric(optsContractFrom) as Contract;
        //   deployContract = buildDeployGeneric(opts);
        //   testContract = buildTestGeneric(opts);

          errorsPrimaryToken[contractPrimaryTokenTab] = undefined;
        } catch (e: unknown) {
          if (e instanceof OptionsError) {
              errorsPrimaryToken[contractPrimaryTokenTab] = e.messages;
          } else {
          throw e;
          }
        }
      }
    });


  let contractToLists = [
    {
      name: 'HypERC20',
      label: 'HypERC20.sol',
      route: 'Collateral to Synthetic',
      primaryToken: 'None'
    },
    {
      name: 'FastHypERC20',
      label: 'FastHypERC20.sol',
      route: 'Collateral to Synthetic',
      primaryToken: 'None'
    },
    {
      name: 'HypXERC20Lockbox',
      label: 'HypXERC20Lockbox.sol',
      route: 'xERC20 Routes',
      primaryToken: 'xERC20Lockbox'
    },
    {
      name: 'HypXERC20',
      label: 'HypXERC20.sol',
      route: 'xERC20 Routes',
      primaryToken: 'xERC20'
    },
  ]

  let contractToListsFiltered = $derived(
    contractToLists.filter(contract => contract.route === warpRouteState.route)
  )

  let contactFromPrimaryStandard: string = $derived(
    contractFromLists.find(contract => contract.name === initialContractFromTab)?.primaryToken ?? ''
  )



  let initialContractToTab: string | undefined = $state(undefined);
  let contractToTab : KindTo = $derived(sanitizeKindTo(initialContractToTab));


  function comfirmRoute() {
    warpRouteState.state = 'DeployingPrimaryToken'
  }


  let isPrimaryTokenDeployed: boolean = $state(true);

  function togglePrimaryTokenDeployed() {
    isPrimaryTokenDeployed = !isPrimaryTokenDeployed
  }
</script>

<section class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-4 lg:py-10">
      
  <div class="flex flex-col gap-10 lg:gap-7 items-center justify-center text-center lg:text-left lg:items-start">
    
    <h1 class="font-bold text-3xl lg:text-5xl tracking-tight md:-mb-4 bg-gradient-to-r from-red-600 via-green-500 to-indigo-400 text-transparent bg-clip-text">
        Let Build Your Own Bridge!
    </h1>

  </div>

</section>

<ScrollStep links={stepLinks} titleHighlighted={stepLinks[0].title} />

<Background color="bg-base-100 pt-3 pb-4">
  <section id={stepLinks[0].pathname}>
    <div class="divider divider-primary ">
      <p class="btn btn-accent text-2xl">Step 1 : Select Routes</p>
    </div>
  </section>
</Background>

<div class="container flex flex-col gap-4 p-8 mx-8">

  {#if warpRouteState.state === 'SettingUproute' || 'SettingTokens' || 'DeployingPrimaryToken'}

    <legend class="fieldset-legend font-bold">Routes:</legend>
    <fieldset class="fieldset">

      <select class="select select-md"
        bind:value={warpRouteState.route}
        onchange={() => selectRoute(warpRouteState)}
      >
        <option disabled selected>Pick a route</option>
        <option>Collateral to Synthetic</option>
        <option>xERC20 Routes</option>
      </select>

    </fieldset>

  {/if}

  {#if warpRouteState.state === 'SettingTokens' || warpRouteState.state === 'DeployingPrimaryToken'}

    <div class="flex flex-row justify-between grow gap-4">

      <div class="flex flex-col gap-4">

        <p class="font-bold">
          Select Contract on origin chain:
        </p>

        <details class="dropdown dropdown-right" bind:open={openDropdownFrom}>
          <summary class="btn m-1" >
            {initialContractFromTab}
            <AbstractIcon name={icons.MenuDown.name} width="24" height="24" />
          </summary>
            <ul class="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
    
              {#each contractFromListsFiltered as contract}
                <li>
                  <button onclick={() => selectTokenFrom(contract.name)}>
                    {contract.label}
                   
                  </button>
                </li>
              {/each}
          </ul>
        </details>

      </div>

      <div class="flex flex-col gap-4">

        <p class="font-bold">
          Select Contract on destination chain:
        </p>

        <details class="dropdown dropdown-left" bind:open={openDropdownTo}>
          <summary class="btn m-1">
            <AbstractIcon name={icons.MenuDown.name} width="24" height="24" />
            {initialContractToTab}
          </summary>
    
          <ul class="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
    
            {#each contractToListsFiltered as contract}
              <li>
                <button onclick={() => selectTokenTo(contract.name)}>
                  {contract.label}
                </button>
              </li>
            {/each}
          </ul>
        </details>
      </div>
    
    </div>

    <div class="flex flex-row justify-center items-center gap-x-16 ">

      <h2 class="font-semibold text-xl">
        <div class="bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >Your Routes: </div>
      </h2>

      <h2 class="font-semibold text-xl">
        {initialContractFromTab}
      </h2>

      <h2 class="font-semibold text-xl">
        <div class="bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >To</div>
      </h2>

      <h2 class="font-semibold text-xl">
        {initialContractToTab}
      </h2>

      <Button
          variant="default"
          class="button block"
          type="submit"
          onclick={comfirmRoute}
      >
         Confirm this Route and Select Your Primary Token
      </Button>

    </div>
  
  {/if}

</div>


<Background color="bg-base-100 pt-3 pb-4">
  <section id={stepLinks[1].pathname}>
    <div class="divider divider-primary ">
      <p class={`btn ${warpRouteState.state !== 'DeployingPrimaryToken' ? 'btn-disabled' : 'btn-accent'} text-2xl `}>
        Step 2 : Deploy Primary Token
      </p>
    </div>
  </section>
</Background>

{#if warpRouteState.state !== 'DeployingPrimaryToken'}

  <div class="container flex flex-row justify-center items-center gap-x-16 p-8 mx-8 ">

    <p class="font-bold text-xl">
      Complete step One first!
    </p>

  </div>

{:else}

<!-- <div class="container flex flex-col gap-4 p-8 mx-8"> -->

  <div class="container flex flex-row justify-center items-center gap-x-16 p-8 mx-8 ">

    <h2 class="font-semibold text-xl">
      <div class="bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >The Token's standard from destination chain is: </div>
    </h2>

    <h2 class="font-semibold text-xl">
      {contactFromPrimaryStandard}
    </h2>


    <fieldset class="fieldset p-4 bg-base-100 border border-base-300 rounded-box w-64">
      <legend class="fieldset-legend font-bold">
        Have Not Deployed Yet? Uncheck It !!
      </legend>
      <label class="fieldset-label">
        <input type="checkbox" checked={isPrimaryTokenDeployed} class="checkbox" onclick={togglePrimaryTokenDeployed} />
        A primary token at desination chain already deployed
      </label>
    </fieldset>
    
  </div>

  {#if !isPrimaryTokenDeployed}
    <WizardSingle initialContractTab={initialContractPrimaryTokenTab} contractTab={contractPrimaryTokenTab} opts={optsPrimaryToken} contractInstance={contractPrimaryToken}>

      {#snippet menu()}
        <div class="tab overflow-hidden">
          <Background color="bg-base-200">
            <OverflowMenu>
              <button class:selected={contractPrimaryTokenTab === 'ERC20'} onclick={() => initialContractPrimaryTokenTab = 'ERC20'}>
                ERC20
              </button>    
            </OverflowMenu>
          </Background>
        </div>
      {/snippet}
    
      {#snippet control()}
        <div class="controls w-64 flex flex-col shrink-0 justify-between h-[calc(150vh-80px)] overflow-auto">
          <div class:hidden={contractPrimaryTokenTab !== 'ERC20'}>
              <ERC20ContractControls bind:opts={allOptsPrimaryToken.ERC20!}/>
          </div>
        </div>
      {/snippet}
    
    </WizardSingle>

  {/if}

{/if}

<style lang="postcss">

  .container {
      background-color: var(--gray-1);
      border: 1px solid var(--gray-2);
      border-radius: 10px;
      min-width: 32rem;
  }

  .tab {
    color: var(--gray-5);
  }

  .tab button, :global(.overflow-btn) {
    padding: var(--size-1) var(--size-2);
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
  }

  .tab button, :global(.overflow-btn) {
    border: 0;
    background-color: transparent;
  }

  .tab button:hover, :global(.overflow-btn):hover {
    background-color: var(--gray-2);
  }

  .tab button.selected {
    background-color: var(--solidity-blue-2);
    color: white;
    order: -1;
  }

  :global(.overflow-menu) button.selected {
    order: unset;
  }

  .controls {
    background-color: white;
    padding: var(--size-4);
  }

  .controls {
    border-radius: 5px;
    box-shadow: var(--shadow);
  }
</style>
