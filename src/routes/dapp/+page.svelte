<script lang="ts">
    import type { PageData } from "./$types";
    import type {Link } from '$lib/model/Link';

    import type { Contract } from '$lib/wizard/smart-contracts';
    import { ContractBuilder, buildContractGeneric } from '$lib/wizard/smart-contracts';

    import type {
      KindedPrimaryTokenFromOptions,
      KindedPrimaryTokenToOptions,
      KindPrimaryTokenFrom,
      KindPrimaryTokenTo,
      KindedFromOptions,
      KindedToOptions,
      KindFrom,
      KindTo,
      OptionsErrorMessages
    } from '$lib/wizard/shared';

    import { 
      sanitizeKindPrimaryTokenFrom,
      sanitizeKindPrimaryTokenTo,
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
    import ERC4626ContractControls from '$lib/ui/controls/ERC4626ContractControls.svelte';
    import XERC20ContractControls from '$lib/ui/controls/XERC20ContractControls.svelte';

    type Props = {
        data: PageData;
    } & PageData;

    let { data }: Props = $props();

    const stepLinks : Link[] = [
        {pathname: '#1-select-routes', title: 'Select Routes', navType: 'scroll' },
        {pathname: '#2-primary-erc20', title: 'Deploy Primary ERC20', navType: 'scroll' },
        {pathname: '#3-visualize', title: 'Visualize Bridge Flow', navType: 'scroll'},
    ];

    let initialContractPrimaryTokenFromTab: string | undefined = $state('MyERC20');
    let contractPrimaryTokenFromTab: KindPrimaryTokenFrom = $derived(sanitizeKindPrimaryTokenFrom(initialContractPrimaryTokenFromTab));
    let allOptsPrimaryTokenFrom: { [k in KindPrimaryTokenFrom]?: Required<KindedPrimaryTokenFromOptions [k]> } =  $state({});

    let contractPrimaryTokenFrom: Contract = $state(new ContractBuilder('MyPrimaryToken'));
    const optsPrimaryTokenFrom = $derived(allOptsPrimaryTokenFrom[contractPrimaryTokenFromTab]);

    let errorsPrimaryTokenFrom : { [k in KindPrimaryTokenFrom]?: OptionsErrorMessages } =  $state({});

    $effect(() => {
      if (optsPrimaryTokenFrom) {
        try {
          contractPrimaryTokenFrom = buildContractGeneric(optsPrimaryTokenFrom) as Contract;
        //   deployContract = buildDeployGeneric(opts);
        //   testContract = buildTestGeneric(opts);

          errorsPrimaryTokenFrom[contractPrimaryTokenFromTab] = undefined;
        } catch (e: unknown) {
          if (e instanceof OptionsError) {
              errorsPrimaryTokenFrom[contractPrimaryTokenFromTab] = e.messages;
          } else {
          throw e;
          }
        }
      }
    });

    let initialContractPrimaryTokenToTab: string | undefined = $state('MyERC20');
    let contractPrimaryTokenToTab: KindPrimaryTokenTo = $derived(sanitizeKindPrimaryTokenTo(initialContractPrimaryTokenToTab));
    let allOptsPrimaryTokenTo: { [k in KindPrimaryTokenTo]?: Required<KindedPrimaryTokenToOptions [k]> } =  $state({});

    let contractPrimaryTokenTo: Contract = $state(new ContractBuilder('MyPrimaryToken'));
    const optsPrimaryTokenTo = $derived(allOptsPrimaryTokenTo[contractPrimaryTokenToTab]);

    let errorsPrimaryTokenTo : { [k in KindPrimaryTokenTo]?: OptionsErrorMessages } =  $state({});

    $effect(() => {
      if (optsPrimaryTokenTo) {
        try {
          contractPrimaryTokenTo = buildContractGeneric(optsPrimaryTokenTo) as Contract;
        //   deployContract = buildDeployGeneric(opts);
        //   testContract = buildTestGeneric(opts);

          errorsPrimaryTokenTo[contractPrimaryTokenToTab] = undefined;
        } catch (e: unknown) {
          if (e instanceof OptionsError) {
              errorsPrimaryTokenTo[contractPrimaryTokenToTab] = e.messages;
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

          errorsPrimaryTokenFrom[contractPrimaryTokenFromTab] = undefined;
        } catch (e: unknown) {
          if (e instanceof OptionsError) {
              errorsPrimaryTokenFrom[contractPrimaryTokenFromTab] = e.messages;
          } else {
          throw e;
          }
        }
      }
  });

  let contactFromPrimaryStandard:  string = $state('ERC20')

  $effect(() => {
    if (initialContractFromTab) {
      contactFromPrimaryStandard = contractFromLists.find(contract => contract.name === initialContractFromTab)?.primaryToken ?? ''
      initialContractPrimaryTokenFromTab = contactFromPrimaryStandard
    }
  })

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


  let initialContractToTab: string | undefined = $state(undefined);
  let contractToTab : KindTo = $derived(sanitizeKindTo(initialContractToTab));

  let contactToPrimaryStandard:  string = $state('xERC20')

  $effect(() => {
    if (initialContractToTab) {
      contactToPrimaryStandard = contractToLists.find(contract => contract.name === initialContractToTab)?.primaryToken ?? ''
      initialContractPrimaryTokenToTab = contactToPrimaryStandard
    }
  })


  function comfirmRoute( primaryFromToken: string, primaryToToken: string ) {
    warpRouteState.state = 'DeployingPrimaryToken'
    initialContractPrimaryTokenFromTab = primaryFromToken;
    initialContractPrimaryTokenToTab = primaryToToken;
  }

  let isPrimaryTokenFromDeployed: boolean = $state(true);

  function togglePrimaryTokenFromDeployed( ) {
    isPrimaryTokenFromDeployed = !isPrimaryTokenFromDeployed
  }

  let isPrimaryTokenToDeployed: boolean = $state(true);

  function togglePrimaryTokenToDeployed( ) {
    isPrimaryTokenToDeployed = !isPrimaryTokenToDeployed
  }

</script>

<section class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-4 lg:py-10">
      
  <div class="flex flex-col gap-10 lg:gap-7 items-center justify-center text-center lg:text-left lg:items-start">
    
    <h1 class="font-bold text-3xl lg:text-5xl tracking-tight md:-mb-4 bg-gradient-to-r from-red-600 via-green-500 to-indigo-400 text-transparent bg-clip-text">
        Let Build Your Own Bridge!
    </h1>

  </div>

</section>


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
          onclick={() => comfirmRoute(contactFromPrimaryStandard, contactToPrimaryStandard)}
      >
         Confirm this Route
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

<ScrollStep links={stepLinks} titleHighlighted={stepLinks[1].title} />

{#if warpRouteState.state !== 'DeployingPrimaryToken'}

  <div class="container flex flex-row justify-center items-center p-8 mx-8 ">

    <p class="font-bold text-xl">
      Complete step One first!
    </p>

  </div>

{:else}

  <div class="container flex flex-col items-center justify-center gap-y-8 p-8 mx-8">

    <!-- Source Chain -->
    {#if contactFromPrimaryStandard === 'None'}
      <h2 class="font-semibold text-xl">
        No Address required at<div class="bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >Source Chain: </div>
      </h2>
    {:else}
      <h2 class="font-semibold text-xl">
        Address required at<div class="bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >Source Chain: </div>
      </h2>

      <div class="flex flex-row items-center gap-x-16 mx-8">
      
        <h3 class="font-semibold text-xl">
          The standard being deployed is:
        </h3>
    
        <h3 class="font-semibold text-lg">
          {contactFromPrimaryStandard}
        </h3>
    
        <fieldset class="fieldset p-4 bg-base-100 border border-base-300 rounded-box w-80">
          <legend class="fieldset-legend font-bold">
            Have Not Deployed Yet? Uncheck below to start modifying!!
          </legend>
          <label class="fieldset-label">
            <input type="checkbox" checked={isPrimaryTokenFromDeployed} class="checkbox" onclick={togglePrimaryTokenFromDeployed} />
            A contract at source chain already deployed
          </label>
        </fieldset>

        <label class="input input-xl validator">
          <!-- <legend class="fieldset-legend">Put required address here</legend> -->
          <input placeholder="Put required address here e.g. 0x.." type="text" required  minlength="42" pattern="/^0x[a-fA-F0-9]{40}$/" title="Must be a valid Ethereum address" />
        </label>
        <p class="validator-hint hidden">
          Must be in the format of 0x followed by 40 characters
        </p>
          
      </div>
      
      {#if !isPrimaryTokenFromDeployed}
        <WizardSingle initialContractTab={initialContractPrimaryTokenFromTab} contractTab={contractPrimaryTokenFromTab} opts={optsPrimaryTokenFrom} contractInstance={contractPrimaryTokenFrom}>
          {#snippet menu()}
            <div class="tab overflow-hidden">
              <Background color="bg-base-200">
                <OverflowMenu>
                  {#if contractPrimaryTokenFromTab === 'ERC20'}
                    <button class:selected={contractPrimaryTokenFromTab === 'ERC20'} onclick={() => initialContractPrimaryTokenFromTab = 'ERC20'}>
                      ERC20
                    </button>
                  {/if}
                  {#if contractPrimaryTokenFromTab === 'ERC4626'}
                    <button class:selected={contractPrimaryTokenFromTab === 'ERC4626'} onclick={() => initialContractPrimaryTokenFromTab = 'ERC4626'}>
                      ERC4626
                    </button>
                  {/if}
                  {#if contractPrimaryTokenFromTab === 'XERC20'}
                    <button class:selected={contractPrimaryTokenFromTab === 'XERC20'} onclick={() => initialContractPrimaryTokenFromTab = 'XERC20'}>
                      XERC20
                    </button>
                  {/if}
                </OverflowMenu>
              </Background>
            </div>
          {/snippet}
        
          {#snippet control()}
            <div class="controls w-64 flex flex-col shrink-0 justify-between h-[calc(150vh-80px)] overflow-auto">
    
              {#if contractPrimaryTokenFromTab === 'ERC20'}
                <div class:hidden={contractPrimaryTokenFromTab !== 'ERC20'}>
                  <ERC20ContractControls bind:opts={allOptsPrimaryTokenFrom.ERC20!}/>
                </div>
              {/if}
    
              {#if contractPrimaryTokenFromTab === 'ERC4626'}
                <div class:hidden={contractPrimaryTokenFromTab !== 'ERC4626'}>
                  <ERC4626ContractControls bind:opts={allOptsPrimaryTokenFrom.ERC4626!}/>
                </div>
              {/if}

              {#if contractPrimaryTokenFromTab === 'XERC20'}
                <div class:hidden={contractPrimaryTokenFromTab !== 'XERC20'}>
                  <XERC20ContractControls bind:opts={allOptsPrimaryTokenFrom.XERC20!}/>
                </div>
              {/if}
              
            </div>
          {/snippet}
        
        </WizardSingle>
    
      {/if}

    {/if}

    <!-- Destination Chain -->

    {#if contactToPrimaryStandard === 'None'}
      <h2 class="font-semibold text-xl">
        No Address required at<div class="bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >Destination Chain: </div>
      </h2>
    {:else}
      <h2 class="font-semibold text-xl">
        Address required at<div class="bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >Destination Chain: </div>
      </h2>

      <div class="flex flex-row items-center gap-x-16 mx-8">
      
        <h3 class="font-semibold text-xl">
          The standard being deployed is:
        </h3>
    
        <h3 class="font-semibold text-lg">
          {contactToPrimaryStandard}
        </h3>
    
        <fieldset class="fieldset p-4 bg-base-100 border border-base-300 rounded-box w-80">
          <legend class="fieldset-legend font-bold">
            Have Not Deployed Yet? Uncheck below to start modifying!!
          </legend>
          <label class="fieldset-label">
            <input type="checkbox" checked={isPrimaryTokenToDeployed} class="checkbox" onclick={togglePrimaryTokenToDeployed} />
            A contract at destimation chain already deployed
          </label>
        </fieldset>

        <label class="input input-xl validator">
          <!-- <legend class="fieldset-legend">Put required address here</legend> -->
          <input placeholder="Put required address here e.g. 0x.." type="text" required  minlength="42" pattern="/^0x[a-fA-F0-9]{40}$/" title="Must be a valid Ethereum address" />
        </label>
        <p class="validator-hint hidden">
          Must be in the format of 0x followed by 40 characters
        </p>
          
      </div>

      {#if !isPrimaryTokenToDeployed}
        <WizardSingle initialContractTab={initialContractPrimaryTokenToTab} contractTab={contractPrimaryTokenToTab} opts={optsPrimaryTokenTo} contractInstance={contractPrimaryTokenTo}>
          {#snippet menu()}
            <div class="tab overflow-hidden">
              <Background color="bg-base-200">
                <OverflowMenu>
                  {#if contractPrimaryTokenToTab === 'XERC20'}
                    <button class:selected={contractPrimaryTokenToTab === 'XERC20'} onclick={() => initialContractPrimaryTokenToTab = 'XERC20'}>
                      XERC20
                    </button>
                  {/if}
                </OverflowMenu>
              </Background>
            </div>
          {/snippet}
        
          {#snippet control()}
            <div class="controls w-64 flex flex-col shrink-0 justify-between h-[calc(150vh-80px)] overflow-auto">
    
              {#if contractPrimaryTokenToTab === 'XERC20'}
                <div class:hidden={contractPrimaryTokenToTab !== 'XERC20'}>
                  <XERC20ContractControls bind:opts={allOptsPrimaryTokenTo.XERC20!}/>
                </div>
              {/if}
              
            </div>
          {/snippet}
        
        </WizardSingle>
    
      {/if}

    {/if}







  </div>


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
