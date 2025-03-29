<script  lang="ts">
    import type { PageData } from "./$types";
    import type {Link } from '$lib/model/Link';

    import type { Contract } from '$lib/wizard/smart-contracts';
    import { ContractBuilder, buildContractGeneric } from '$lib/wizard/smart-contracts';

    import type {
      KindedERC20Options,
      KindERC20,
      KindedContractFromOptions,
      KindedContractToOptions,
      KindContractFrom,
      KindContractTo,
      OptionsErrorMessages
    } from '$lib/wizard/shared';
    import { 
      sanitizeKindERC20,
      OptionsError,
      sanitizeKindContractFrom,
      sanitizeKindContractTo,
      sanitizeKind
    } from '$lib/wizard/shared';

    import Background from '$lib/ui/layouts/Background.svelte';
    import Button from "$lib/ui/buttons/Button.svelte";
    // import WizardSingle from '$lib/ui/components/WizardSingle.svelte';
    import ScrollStep from '$lib/ui/components/ScrollStep.svelte';


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

    type Route = 'Pick a route' | 'Collateral to Synthetic' | 'xERC20 Routes';
    type RouteState = 'SettingUproute' | 'SettingTokens' | 'DeployingPrimaryToken' | 'DeployingRoutes';

    type WarpRoute = {
      state: RouteState;
      route: Route;
      tokenFrom: string;
      tokenTo: string;
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

    function selectTokenFrom(contractName: string) {
      initialContractFromTab = contractName
    }

    function selectTokenTo(contractName: string) {
      // warpRouteState.tokenTo = token;
      initialContractToTab = contractName
    }


  // let routeSelected : Route = $state('Pick a route');
  // let disabledSteps: boolean = $derived(warpRouteState.route === 'Pick a route');

  // $effect(() => {
  //   if (warpRouteState.route !== 'Pick a route') {
  //     try {
  //       // contract = buildContractGeneric(opts);
  //       //   deployContract = buildDeployGeneric(opts);
  //       //   testContract = buildTestGeneric(opts);

  //       errors[contractTab] = undefined;
  //     } catch (e: unknown) {
  //       if (e instanceof OptionsError) {
  //           errors[contractTab] = e.messages;
  //       } else {
  //       throw e;
  //       }
  //     }
  //   }
  // });

  let contractFromLists = [
    {
      name: 'HypERC20Collateral',
      label: 'HypERC20Collateral.sol',
      route: 'Collateral to Synthetic'
    },
    {
      name: 'HypFiatToken',
      label: 'HypFiatToken.sol',
      route: 'Collateral to Synthetic'
    },
    {
      name: 'HypERC4626Collateral',
      label: 'HypERC4626Collateral.sol',
      route: 'Collateral to Synthetic'
    },
    {
      name: 'HypERC4626OwnerCollateral',
      label: 'HypERC4626OwnerCollateral',
      route: 'Collateral to Synthetic'
    },
    {
      name: 'FastHypERC20Collateral',
      label: 'FastHypERC20Collateral',
      route: 'Collateral to Synthetic'
    },
    {
      name: 'xERC20Lockbox',
      label: 'xERC20Lockbox.sol',
      route: 'xERC20 Routes'
    },
    {
      name: 'HypXERC20',
      label: 'HypXERC20.sol',
      route: 'xERC20 Routes'
    },
    
  ]

  let contractFromListsFiltered = $derived(
     contractFromLists.filter(contract => contract.route === warpRouteState.route)
  )

  let initialContractFromTab: string | undefined = $state(undefined);
  let contractFromTab : KindContractFrom = $derived(sanitizeKindContractFrom(initialContractFromTab));


  let contractToLists = [
    {
      name: 'HypERC20',
      label: 'HypERC20.sol',
      route: 'Collateral to Synthetic'
    },
    {
      name: 'FastHypERC20',
      label: 'FastHypERC20.sol',
      route: 'Collateral to Synthetic'
    },
    {
      name: 'xERC20Lockbox',
      label: 'xERC20Lockbox.sol',
      route: 'xERC20 Routes'
    },
    {
      name: 'HypXERC20',
      label: 'HypXERC20.sol',
      route: 'xERC20 Routes'
    },
  ]

  let contractToListsFiltered = $derived(
    contractToLists.filter(contract => contract.route === warpRouteState.route)
  )


  let initialContractToTab: string | undefined = $state(undefined);
  let contractToTab : KindContractTo = $derived(sanitizeKindContractTo(initialContractToTab));


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


{#if warpRouteState.state === 'SettingUproute' || warpRouteState.state === 'SettingTokens'}

  <fieldset class="fieldset">
    <legend class="fieldset-legend">Routes:</legend>

    <select class="select"
      bind:value={warpRouteState.route}
      onchange={() => selectRoute(warpRouteState)}
    >
      <option disabled selected>Pick a route</option>
      <option>Collateral to Synthetic</option>
      <option>xERC20 Routes</option>
    </select>

    <!-- <span class="fieldset-label">Optional</span> -->
  </fieldset>
{/if}

{#if warpRouteState.state === 'SettingTokens'}

  <details class="dropdown">

    <summary class="btn m-1">{initialContractFromTab}</summary>
      <ul class="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">

        {#each contractFromListsFiltered as contract}
          <li>
            <button onclick={() => selectTokenFrom(contract.name)}>
              {contract.label}
            </button>
          </li>
        {/each}
  <!-- 
      <li>
        <button onclick={() => initialContractFromTab = 'HypERC20Collateral'}>
          HypERC20Collateral.sol
        </button>
      </li>
      <li>
        <button onclick={() => initialContractFromTab = 'HypFiatToken'}>
          HypFiatToken.sol
        </button>
      </li>
      <li>
        <button onclick={() => initialContractFromTab = 'HypERC4626OwnerCollateral'}>
          HypERC4626OwnerCollateral
        </button>
      </li>
      <li>
        <button onclick={() => initialContractFromTab = 'FastHypERC20Collateral'}>
          FastHypERC20Collateral
        </button>
      </li> -->
    </ul>
  </details>

  <details class="dropdown">

    <summary class="btn m-1">{initialContractToTab}</summary>
    <ul class="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">

      {#each contractToListsFiltered as contract}
        <li>
          <button onclick={() => selectTokenTo(contract.name)}>
            {contract.label}
          </button>
        </li>
      {/each}

      <!-- <li >
        <button onclick={() => initialContractToTab = 'HypERC20'}>
          HypERC20.sol
        </button>
      </li>
      <li>
        <button onclick={() => initialContractToTab = 'FastHypERC20'}>
          FastHypERC20.sol
        </button>
      </li> -->
      
    </ul>
  </details>
{/if}



<Background color="bg-base-100 pt-3 pb-4">
  <section id={stepLinks[1].pathname}>
    <div class="divider divider-primary ">
      <p class="btn btn-accent text-2xl">Step 2 : Deploy Primary ERC20</p>
    </div>
  </section>
</Background>

