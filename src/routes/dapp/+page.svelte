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
  import CopyBlock from "$lib/ui/components/CopyBlock.svelte";
  import ScrollStep from '$lib/ui/components/ScrollStep.svelte';
  import WizardSingle from '$lib/ui/components/WizardSingle.svelte';
  import WizardDouble from "$lib/ui/components/WizardDouble.svelte";
  import OverflowMenu from '$lib/ui/layouts/OverflowMenu.svelte';
  import ERC20ContractControls from '$lib/ui/controls/ERC20ContractControls.svelte';
  import ERC4626ContractControls from '$lib/ui/controls/ERC4626ContractControls.svelte';
  import XERC20ContractControls from '$lib/ui/controls/XERC20ContractControls.svelte';
  import XERC20LockboxContractControls from '$lib/ui/controls/XERC20LockboxContractControls.svelte';

  import HypERC20CollateralContractControls from '$lib/ui/controls/HypERC20CollateralContractControls.svelte';
  import HypFiatTokenContractControls from '$lib/ui/controls/HypFiatTokenContractControls.svelte';
  import HypERC4626CollateralContractControls from '$lib/ui/controls/HypERC4626CollateralContractControls.svelte';
  import HypERC4626OwnerCollateralContractControls from '$lib/ui/controls/HypERC4626OwnerCollateralContractControls.svelte';
  import FastHypERC20CollateralContractControls from '$lib/ui/controls/FastHypERC20CollateralContractControls.svelte';

  import HypERC20ContractControls from '$lib/ui/controls/HypERC20ContractControls.svelte';
  import FastHypERC20ContractControls from '$lib/ui/controls/FastHypERC20ContractControls.svelte';
  import HypXERC20ContractControls from '$lib/ui/controls/HypXERC20ContractControls.svelte';
  import HypXERC20LockboxContractControls from '$lib/ui/controls/HypXERC20LockboxContractControls.svelte';

  type Props = {
      data: PageData;
  } & PageData;

  let { data }: Props = $props();

  const stepLinks : Link[] = [
      {pathname: '#1-select-routes', title: 'Select Routes', navType: 'scroll' },
      {pathname: '#2-primary', title: 'Deploy dependency contract', navType: 'scroll' },
      {pathname: '#3-deploy', title: 'Deploy & Visualize', navType: 'scroll'},
      {pathname: '#4-management', title: 'Contract Management (Optional)', navType: 'scroll'},
  ];

  type Route = 'Pick a route'
    | 'Collateral to Synthetic'
    | 'xERC20 Routes';
  type RouteState = 'SettingUproute'
    | 'SettingTokens'
    | 'DeployingPrimaryToken'
    | 'DeployingRoutes'
    | 'ManagingContract';

  type WarpRoute = {
    state: RouteState;
    route: Route;
    tokenFromAddress: string;
    tokenToAddress: string;
    // error?: unknown;
  };

  const warpRouteState: WarpRoute = $state({
    state: 'SettingUproute',
    route: 'Pick a route',
    tokenFromAddress: '0x',
    tokenToAddress: '0x',
  });

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

  function selectRoute(warpRoute: WarpRoute) {
    warpRouteState.state = 'SettingTokens';
    warpRouteState.route = warpRoute.route;

    if (warpRoute.route === 'Collateral to Synthetic') {
      initialContractFromTab = 'HypERC20Collateral'
      initialContractToTab = 'HypERC20'
      initialContractPrimaryTokenFromTab = 'ERC20'

    } else if (warpRoute.route === 'xERC20 Routes') {
      initialContractFromTab = 'HypXERC20Lockbox'
      initialContractToTab = 'HypXERC20Lockbox'
      initialContractPrimaryTokenFromTab = 'XERC20Lockbox'
      initialContractPrimaryTokenToTab = 'XERC20Lockbox'
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

  function comfirmStep1( primaryFromToken: string, primaryToToken: string ) {
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

  function areAddressesFilled( ) {
    if (warpRouteState.route === 'Collateral to Synthetic') {
      return warpRouteState.tokenFromAddress !== '0x'
    }
    if (warpRouteState.route === 'xERC20 Routes') {
      return warpRouteState.tokenFromAddress !== '0x' && warpRouteState.tokenToAddress !== '0x'
    }
    return false
  }

  function comfirmStep2() {
    if (areAddressesFilled()) {
      warpRouteState.state = 'DeployingRoutes'
    }
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
  let errorsContractFrom : { [k in KindFrom]?: OptionsErrorMessages } =  $state({});

  $effect(() => {
    if (optsContractFrom) {
      try {
        contractFrom = buildContractGeneric(optsContractFrom) as Contract;
      //   deployContract = buildDeployGeneric(opts);
      //   testContract = buildTestGeneric(opts);

        errorsContractFrom[contractFromTab] = undefined;
      } catch (e: unknown) {
        if (e instanceof OptionsError) {
          errorsContractFrom[contractFromTab] = e.messages;
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
  let allOptsTo: { [k in KindTo]?: Required<KindedToOptions [k]> } =  $state({});

  let contractTo: Contract = $state(new ContractBuilder('HypERC20'));
  const optsContractTo = $derived(allOptsTo[contractToTab]);
  let errorsContractTo : { [k in KindTo]?: OptionsErrorMessages } =  $state({});

  $effect(() => {
    if (optsContractTo) {
      try {
        contractTo = buildContractGeneric(optsContractTo) as Contract;

        errorsContractTo[contractToTab] = undefined;
      } catch (e: unknown) {
        if (e instanceof OptionsError) {
          errorsContractTo[contractToTab] = e.messages;
        } else {
        throw e;
        }
      }
    }
  });

  let contactToPrimaryStandard:  string = $state('xERC20Lockbox')

  $effect(() => {
    if (initialContractToTab) {
      contactToPrimaryStandard = contractToLists.find(contract => contract.name === initialContractToTab)?.primaryToken ?? ''
      initialContractPrimaryTokenToTab = contactToPrimaryStandard
    }
  })

  function comfirmStep3 () {
    warpRouteState.state = 'ManagingContract';
  }

</script>

<section class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-4 lg:py-10">
      
  <div class="flex flex-col gap-10 lg:gap-7 items-center justify-center text-center lg:text-left lg:items-start">
    <h1 class="font-bold text-3xl lg:text-5xl tracking-tight md:-mb-4 bg-gradient-to-r from-red-600 via-green-500 to-indigo-400 text-transparent bg-clip-text">
        Let Build Your Own Bridge!
    </h1>
  </div>

</section>

<div class="m-8">
  <a
    href="/"
    class="link !no-underline text-base-content/80 hover:text-base-content inline-flex items-center gap-1"
    title="Back to Homee"
  >
    <AbstractIcon name={icons.ArrowBack.name} width="20" height="20" />
    Back to Home
  </a>
</div>

<Background color="bg-base-100 pt-3 pb-4">
  <section id={stepLinks[0].pathname}>
    <div class="divider divider-primary ">
      <h1 class="btn btn-accent text-2xl">Step 1 : Select Routes</h1>
    </div>
  </section>
</Background>

<div class="container flex flex-col gap-4 p-8 mx-8">

  {#if warpRouteState.state === 'SettingUproute' || 'SettingTokens' || 'DeployingPrimaryToken'}

    <legend class="fieldset-legend font-bold text-xl">Routes:</legend>
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

    <h2 class="font-bold text-xl">
      Select Contract Features:
    </h2>

    <div class="flex flex-row justify-between grow gap-4">

      <div class="flex flex-col gap-4">

        <div class="font-bold text-xl bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >
          On origin chain::
        </div>

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

        <div class="font-bold text-xl bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >
          On destination chain:
        </div>

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

    <div class="flex flex-row justify-end items-center gap-x-16 ">
      <h3 class="font-semibold text-xl">
        <div class="bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >Your Routes: </div>
      </h3>

      <h3 class="font-semibold text-xl">
        {initialContractFromTab}
      </h3>

      <h3 class="font-semibold text-xl">
        <div class="bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >To</div>
      </h3>

      <h3 class="font-semibold text-xl">
        {initialContractToTab}
      </h3>

      <Button
          variant="default"
          class="button block"
          type="submit"
          onclick={() => comfirmStep1(contactFromPrimaryStandard, contactToPrimaryStandard)}
      >
         Confirm this Route
      </Button>
    </div>
  
  {/if}

</div>

<Background color="bg-base-100 pt-3 pb-4">
  <section id={stepLinks[1].pathname}>
    <div class="divider divider-primary ">
      <h1 class={`btn ${warpRouteState.state !== 'DeployingPrimaryToken' ? 'btn-disabled' : 'btn-accent'} text-2xl `}>
        Step 2 : Deploy dependency contract
      </h1>
    </div>
  </section>
</Background>

<ScrollStep links={stepLinks} titleHighlighted={stepLinks[1].title} />

{#if warpRouteState.state == 'SettingUproute' || warpRouteState.state == 'SettingTokens'}
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
        No Address required at <div class="bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >Source Chain: </div>
      </h2>
    {:else}
      <h2 class="font-semibold text-xl">
        Address required at <div class="bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >Source Chain: </div>
      </h2>

      <div class="flex flex-row items-center gap-x-8 mx-8">
      
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

        <label class="input input-primary input-xl validator">
          <!-- <legend class="fieldset-legend">Put required address here</legend> -->
          <input bind:value={warpRouteState.tokenFromAddress} placeholder="Put required address here e.g. 0x.." type="text" required  minlength="42" pattern="/^0x[a-fA-F0-9]{40}$/" title="Must be a valid Ethereum address" />
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
                  {#if contractPrimaryTokenFromTab === 'XERC20Lockbox'}
                    <button class:selected={contractPrimaryTokenFromTab === 'XERC20Lockbox'} onclick={() => initialContractPrimaryTokenFromTab = 'XERC20Lockbox'}>
                      XERC20Lockbox
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
              {#if contractPrimaryTokenFromTab === 'XERC20Lockbox'}
                <div class:hidden={contractPrimaryTokenFromTab !== 'XERC20Lockbox'}>
                  <XERC20LockboxContractControls bind:opts={allOptsPrimaryTokenFrom.XERC20Lockbox!}/>
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

        <label class="input input-primary input-xl validator">
          <!-- <legend class="fieldset-legend">Put required address here</legend> -->
          <input bind:value={warpRouteState.tokenToAddress} placeholder="Put required address here e.g. 0x.." type="text" required  minlength="42" pattern="/^0x[a-fA-F0-9]{40}$/" title="Must be a valid Ethereum address" />
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
                  {#if contractPrimaryTokenToTab === 'XERC20Lockbox'}
                    <button class:selected={contractPrimaryTokenToTab === 'XERC20Lockbox'} onclick={() => initialContractPrimaryTokenToTab = 'XERC20Lockbox'}>
                      XERC20Lockbox
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

              {#if contractPrimaryTokenToTab === 'XERC20Lockbox'}
                <div class:hidden={contractPrimaryTokenToTab !== 'XERC20Lockbox'}>
                  <XERC20LockboxContractControls bind:opts={allOptsPrimaryTokenTo.XERC20Lockbox!}/>
                </div>
              {/if}
              
            </div>
          {/snippet}
        </WizardSingle>
    
      {/if}

    {/if}

    <div class="w-full flex flex-row justify-end">
      <Button
          disabled={!areAddressesFilled()}
          variant="default"
          type="submit"
          onclick={comfirmStep2}
      >

          Confirm the Addresses
      </Button>
    </div>

  </div>

{/if}

<Background color="bg-base-100 pt-3 pb-4">
  <section id={stepLinks[2].pathname}>
    <div class="divider divider-primary ">
      <h1 class={`btn ${warpRouteState.state !== 'DeployingRoutes' ? 'btn-disabled' : 'btn-accent'} text-2xl `}>
        Step 3 : Deploy & Visualize Route
      </h1>
    </div>
  </section>
</Background>

<ScrollStep links={stepLinks} titleHighlighted={stepLinks[2].title} />

{#if warpRouteState.state == 'SettingUproute' || warpRouteState.state == 'SettingTokens' || warpRouteState.state == 'DeployingPrimaryToken'}
  <div class="container flex flex-row justify-center items-center p-8 mx-8 ">
    <p class="font-bold text-xl">
      Complete step Two first!
    </p>
  </div>
{:else}


  <div class="container flex flex-col gap-x-4 gap-y-4 p-8 mx-8">

    <div class="flex flex-col justify-center gap-y-4 pt-3 pb-4">
      <h3 class="m-4 font-semibold">
        Use <a class="bg-primary underline" href="https://docs.hyperlane.xyz/docs/reference/cli" target="_blank" rel="noreferrer">Hyperlane CLI</a> to initialize a config file:
      </h3>
      <CopyBlock
        boxClass="p-2 rounded-box font-black text-primary max-w-xl mx-auto"
        class="mb-5"
        background="bg-primary-content"
        copiedBackground="bg-success"
        copiedColor="text-success-content"
        text={`hyperlane warp init`}
      />

      <h3 class="m-4 font-semibold">
        This will generate <a class="bg-primary underline" href="https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/0e5c941b7b78779055731ad5daed79817535da7a/typescript/cli/examples/warp-route-deployment.yaml#L4" target="_blank" rel="noreferrer">warp-route-deployment.yaml</a> to prepare for deployment.
      </h3>

      <h3 class="m-4 font-semibold">
          During CLI config process, enter your contract addresses in previous step as following:
      </h3>

      <div class="flex flex-row justif-center items-center gap-x-16 ">

        <h3 class="font-medium text-base">
          <div class="bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >Source Chain Deployed Addresses: </div>
        </h3>


        {#if contactFromPrimaryStandard === 'None'}
          <h3 class="font-medium text-base">
            No Address required
          </h3>
        {:else}
          <CopyBlock
            boxClass="p-2 rounded-box font-black text-primary max-w-xl mx-auto"
            class="mb-5"
            background="bg-primary-content"
            copiedBackground="bg-success"
            copiedColor="text-success-content"
            text={warpRouteState.tokenFromAddress}
          />
        {/if}

        <h3 class="font-medium text-base">
          <div class="bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >Destination Chain Deployed Addresses: </div>
        </h3>
  
        {#if contactToPrimaryStandard === 'None'}
          <h3 class="font-medium text-base">
            No Address required
          </h3>
        {:else}

        <CopyBlock
          boxClass="p-2 rounded-box font-black text-primary max-w-xl mx-auto"
          class="mb-5"
          background="bg-primary-content"
          copiedBackground="bg-success"
          copiedColor="text-success-content"
            text={warpRouteState.tokenToAddress}
          />
        {/if}

      </div>

      <p class="m-4 text-base-300">
        Check out about warp route deployment at 
         <a class="underline" href="https://docs.hyperlane.xyz/docs/protocol/warp-routes/warp-routes-yield-routes/" target="_blank" rel="noreferrer"
           >doc</a
         >
      </p>

      <h3 class="m-4 font-semibold">
        Run the following command to deploy the warp route.
      </h3>
      <CopyBlock
        boxClass="p-2 rounded-box font-black text-primary max-w-xl mx-auto"
        class="mb-5"
        background="bg-primary-content"
        copiedBackground="bg-success"
        copiedColor="text-success-content"
        text={`hyperlane warp deploy`}
      />

    </div>

    <h3 class="font-semibold text-xl m-4">
      <div class="bg-gradient-to-r from-red-600 via-green-500 to-indigo-400 text-transparent bg-clip-text" >Smart Contract Visualization</div> - See what your are being deployed :
    </h3>

    <div class="flex flex-row justif-center items-center gap-x-16 ">

      <h3 class="font-semibold text-xl">
        <div class="bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >Left : source chain</div>
      </h3>

      <h3 class="font-semibold text-xl">
        {initialContractFromTab}
      </h3>
  
      <h3 class="font-semibold text-xl">
        <div class="bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >Right : destination chain</div>
      </h3>
  
      <h3 class="font-semibold text-xl">
        {initialContractToTab}
      </h3>

      <AbstractIcon name={icons.MenuDown.name} width="24" height="24" />
    </div>

    <WizardDouble
      initialContractOneTab={initialContractFromTab}
      contractOneTab={contractFromTab}
      optsOne={optsContractFrom}
      contractOneInstance={contractFrom}

      initialContractTwoTab={initialContractToTab}
      contractTwoTab={contractToTab}
      optsTwo={optsContractTo}
      contractTwoInstance={contractTo}
    >

      {#snippet control()}

        <!-- From Contract Controls  -->
        {#if contractFromTab === 'HypERC20Collateral'}
          <div class:hidden={contractFromTab !== 'HypERC20Collateral'}>
            <HypERC20CollateralContractControls bind:opts={allOptsFrom.HypERC20Collateral!}/>
          </div>
        {/if}
        {#if contractFromTab === 'HypFiatToken'}
          <div class:hidden={contractFromTab !== 'HypFiatToken'}>
            <HypFiatTokenContractControls bind:opts={allOptsFrom.HypFiatToken!}/>
          </div>
        {/if}
        {#if contractFromTab === 'HypERC4626Collateral'}
          <div class:hidden={contractFromTab !== 'HypERC4626Collateral'}>
            <HypERC4626CollateralContractControls bind:opts={allOptsFrom.HypERC4626Collateral!}/>
          </div>
        {/if}
        {#if contractFromTab === 'HypERC4626OwnerCollateral'}
          <div class:hidden={contractFromTab !== 'HypERC4626OwnerCollateral'}>
            <HypERC4626OwnerCollateralContractControls bind:opts={allOptsFrom.HypERC4626OwnerCollateral!}/>
          </div>
        {/if}
        {#if contractFromTab === 'HypERC4626OwnerCollateral'}
          <div class:hidden={contractFromTab !== 'HypERC4626OwnerCollateral'}>
            <HypERC4626OwnerCollateralContractControls bind:opts={allOptsFrom.HypERC4626OwnerCollateral!}/>
          </div>
        {/if}
        {#if contractFromTab === 'FastHypERC20Collateral'}
          <div class:hidden={contractFromTab !== 'FastHypERC20Collateral'}>
            <FastHypERC20CollateralContractControls bind:opts={allOptsFrom.FastHypERC20Collateral!}/>
          </div>
        {/if}
        {#if contractFromTab === 'HypXERC20'}
          <div class:hidden={contractFromTab !== 'HypXERC20'}>
            <HypXERC20ContractControls bind:opts={allOptsFrom.HypXERC20!}/>
          </div>
        {/if}
        {#if contractFromTab === 'HypXERC20Lockbox'}
          <div class:hidden={contractFromTab !== 'HypXERC20Lockbox'}>
            <HypXERC20LockboxContractControls bind:opts={allOptsFrom.HypXERC20Lockbox!}/>
          </div>
        {/if}

        <!-- To Contract Controls  -->
        {#if contractToTab === 'HypERC20'}
          <div class:hidden={contractToTab !== 'HypERC20'}>
            <HypERC20ContractControls bind:opts={allOptsTo.HypERC20!}/>
          </div>
        {/if}
        {#if contractToTab === 'FastHypERC20'}
          <div class:hidden={contractToTab !== 'FastHypERC20'}>
            <FastHypERC20ContractControls bind:opts={allOptsTo.FastHypERC20!}/>
          </div>
        {/if}
        {#if contractToTab === 'HypXERC20'}
          <div class:hidden={contractToTab !== 'HypXERC20'}>
            <HypXERC20ContractControls bind:opts={allOptsTo.HypXERC20!}/>
          </div>
        {/if}
        {#if contractToTab === 'HypXERC20Lockbox'}
          <div class:hidden={contractToTab !== 'HypXERC20Lockbox'}>
            <HypXERC20LockboxContractControls bind:opts={allOptsTo.HypXERC20Lockbox!}/>
          </div>
        {/if}

      {/snippet}

    </WizardDouble>

    <div class="w-full flex flex-row justify-end">
      <Button
          disabled={!areAddressesFilled()}
          variant="default"
          type="submit"
          onclick={comfirmStep3}
      >
          Confirm Deployment
      </Button>
    </div>
    
  </div>
{/if}

<Background color="bg-base-100 pt-3 pb-4">
  <section id={stepLinks[3].pathname}>
    <div class="divider divider-primary ">
      <h1 class={`btn ${warpRouteState.state !== 'ManagingContract' ? 'btn-disabled' : 'btn-accent'} text-2xl `}>
        Step 4 : Manage Contract
      </h1>
    </div>
  </section>
</Background>

<ScrollStep links={stepLinks} titleHighlighted={stepLinks[3].title} />

<div class="container flex flex-col gap-x-4 gap-y-4 p-8 mx-8">

  {#if warpRouteState.state == 'SettingUproute' || warpRouteState.state == 'SettingTokens' || warpRouteState.state == 'DeployingPrimaryToken' || warpRouteState.state == 'DeployingRoutes'}
    <div class="flex flex-row justify-center items-center p-8 mx-8 ">
      <p class="font-bold text-xl">
        Complete step three first!
      </p>
    </div>
  {:else}

    {#if contractFromTab === 'HypFiatToken'}

      <p class="m-4 font-semibold">
        There are three roles that are relevant on the <span class="underline bg-secondary">FiatToken</span> and <span class="underline bg-secondary">MasterMinter</span> contracts:
      </p>

      <p class="m-4 font-semibold">
        <span class="bg-secondary underline">MasterMinter owner</span> is the account that can set controllers and minters.
      </p>

      <p class="m-4 font-semibold">
        <span class="bg-secondary underline">MasterMinter controller</span> is the account that can set the mint limits for its assigned minters.
      </p>

      <p class="m-4 font-semibold">
        <span class="bg-secondary underline">MasterMinter minter</span> is the account that can actually call mint on <span class="bg-secondary underline">FiatToken</span>.
      </p>

      <p class="m-4 font-semibold">
        There are three actions that should be set on the <span class="underline bg-secondary">MasterMinter</span> contract:
      </p>


      <h2 class="m-4 font-semibold">
        <span class="bg-secondary underline">1. Remove the previous test controller:</span>
      </h2>

      <p class="m-4 font-semibold">
        As the owner, remove the previous test controller via  <a class="bg-primary underline" href="https://github.com/circlefin/stablecoin-evm/blob/master/contracts/minting/Controller.sol#L87C14-L87C51" target="_blank" rel="noreferrer">removeController(address _controller) function</a>
      </p>

      <h2 class="m-4 font-semibold">
        <span class="bg-secondary underline">2. Set the controller and minter:</span>
      </h2>

      <p class="m-4 font-semibold">
        As the owner, set the controller and minter via  <a class="bg-primary underline" href="https://github.com/circlefin/stablecoin-evm/blob/master/contracts/minting/Controller.sol#L70" target="_blank" rel="noreferrer">configureController(address controller, address worker) function</a>
      </p>

      <h2 class="m-4 font-semibold">
        <span class="bg-secondary underline">3. Set the mint limits:</span>
      </h2>
      
      <p class="m-4 font-semibold">
        As the controller, set the mint limits via  <a class="bg-primary underline" href="https://github.com/circlefin/stablecoin-evm/blob/master/contracts/minting/MintController.sol#L116" target="_blank" rel="noreferrer">configureMinter(uint256 _newAllowance) function</a>
      </p>
    
    {/if}

    {#if contractFromTab === 'HypXERC20' || contractFromTab === 'HypXERC20Lockbox' || contractToTab === 'HypXERC20' || contractToTab === 'HypXERC20Lockbox'}

      <h3 class="m-4 font-semibold">
        The minting and burning limits for the Warp Route contract are managed through the <a class="bg-primary underline" href="https://github.com/defi-wonderland/xERC20/blob/main/solidity/contracts/XERC20.sol#L85" target="_blank" rel="noreferrer">setLimits</a> to initialize a config file:
      </h3>
      <p class="m-4 font-semibold">
        The xERC20 contract uses a 24-hour window to manage limits. This is defined by the <a class="bg-secondary underline" href="https://github.com/defi-wonderland/xERC20/blob/main/solidity/contracts/XERC20.sol#L13" target="_blank" rel="noreferrer">_DURATION</a> variable, which is set to 1 days (24 hours). The current available limits are calculated dynamically using the <a class="underline" href="https://github.com/defi-wonderland/xERC20/blob/main/solidity/contracts/XERC20.sol#L234" target="_blank" rel="noreferrer">_getCurrentLimit</a> function.
      </p>
      <p class="m-4 font-semibold">
        If 24 hours <a class="bg-secondary underline" href="https://github.com/defi-wonderland/xERC20/blob/main/solidity/contracts/XERC20.sol#L13" target="_blank" rel="noreferrer">_DURATION</a> have passed since the last use, the limit will automatically restore to the full "maxLimit".
      </p>

    {/if}

  {/if}

</div>

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
