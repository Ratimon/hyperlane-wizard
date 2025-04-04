<script  lang="ts">
    import type { Snippet } from 'svelte';
  
    import fileSaver from 'file-saver';
    import { v4 as uuid } from 'uuid';
  
    import {icons} from '$data/icon';
    import AbstractIcon from '$lib/ui/icons/AbstractIcon.svelte';
  
    import { injectHyperlinks } from '$lib/ui/utils/inject-hyperlinks';
    import {copyToClipboard} from '$lib/ui/utils/clipboard';
    import hljs  from '$lib/ui/utils/highlightjs';
  
    import type {  Kind,  } from '$lib/wizard/shared';
    import {  sanitizeKind, } from '$lib/wizard/shared';
  
    import type {  Contract } from '$lib/wizard/smart-contracts';
    import {  printContract } from '$lib/wizard/smart-contracts';
  
    // import type { GaEvent } from '$lib/analytics/analytics.Store';
    // import { analyticsStore } from '$lib/analytics/analytics.Store';
  
    type Props = {
    //   guide: Snippet;
      // menu: Snippet;
      control: Snippet;
      // contractInstance: Contract | DeployContract | TestContract;
      contractOneInstance: Contract;
      optsOne: any;
      initialContractOneTab: string | undefined ;
      contractOneTab: Kind;

      contractTwoInstance: Contract;
      optsTwo: any;
      initialContractTwoTab: string | undefined ;
      contractTwoTab: Kind;
    };
  
    let {
    //   guide,
      // menu,
      control,
      contractOneInstance,
      optsOne,
      initialContractOneTab,
      contractOneTab = sanitizeKind(initialContractOneTab),

      contractTwoInstance,
      optsTwo,
      initialContractTwoTab,
      contractTwoTab = sanitizeKind(initialContractTwoTab),
    }: Props = $props();
  
    let codeOne: string = $state("");
    let highlightedCodeOne: string | undefined = $state("");
  
    $effect(() => {
      contractOneTab = sanitizeKind(contractOneTab);


      codeOne = printContract(contractOneInstance as Contract);

      highlightedCodeOne = injectHyperlinks(hljs.highlight(codeOne, {language: 'solidity'} ).value);
    });
  
    
    let isScriptCopied = $state(false);
  
    const copyOneHandler = async () => {
        copyToClipboard(codeOne);
          isScriptCopied = true;
  
        //   if (opts) {
        //     const new_event : GaEvent  = {
        //         id:   uuid(),
        //         data: {...opts},
        //         event: `copy-${contractInstance.kind}-${contractTab}`,
        //         type: "event",
        //   }
        //   $analyticsStore = [...$analyticsStore, new_event]
        // }
  
        setTimeout(() => {
          isScriptCopied = false;
        }, 1000);
    };
  
    const downloadOneNpmHandler = async () => {
        const blob = new Blob([codeOne], { type: 'text/plain' });
        if (optsOne) {
          fileSaver.saveAs(blob, contractOneInstance.name + '.sol');
  
        //   const new_event : GaEvent  = {
        //       id:   uuid(),
        //       data: {...opts},
        //       event: `download-${contractInstance.kind}-${contractTab}`,
        //       type: "event",
        //   }
        //   $analyticsStore = [...$analyticsStore, new_event]
        }
    };

    let codeTwo: string = $state("");
    let highlightedCodeTwo: string | undefined = $state("");

    $effect(() => {
      contractTwoTab = sanitizeKind(contractTwoTab);

      codeTwo = printContract(contractTwoInstance as Contract);
      highlightedCodeTwo = injectHyperlinks(hljs.highlight(codeTwo, {language: 'solidity'} ).value);
    });

    let isScriptTwoCopied = $state(false);  

    const copyTwoHandler = async () => {
        copyToClipboard(codeTwo);
        isScriptTwoCopied = true;

        setTimeout(() => {
            isScriptTwoCopied = false;
        }, 1000);
    };

    const downloadTwoNpmHandler = async () => {
        const blob = new Blob([codeTwo], { type: 'text/plain' });
        if (optsTwo) {
            fileSaver.saveAs(blob, contractTwoInstance.name + '.sol');
        }
    };
    
    
  </script>
  
  <div class="container flex flex-col gap-4">
  
      <!-- {@render guide()} -->
    
      <div class="pt-3 pb-4 header flex flex-row justify-between">
    
        <!-- {@render menu()} -->
    
        <div class="action flex flex-row gap-2 shrink-0">
          <button class="action-button min-w-[165px]" onclick={copyOneHandler}>
            <div class="flex justify-between">
              {#if isScriptCopied}
                <AbstractIcon name={icons.Check.name} width="24" height="24" />Copied
              {:else}
                <AbstractIcon name={icons.Copy.name} width="24" height="24" />Copy .sol Code
              {/if}
            </div>
          </button>
    
          <button class="action-button min-w-[165px]" onclick={downloadOneNpmHandler}>
            <div class="flex justify-between">
              <AbstractIcon name={icons.Download.name} width="24" height="24" /> Download As .sol
            </div>
          </button>
        </div>

        <div class="action flex flex-row gap-2 shrink-0">
          <button class="action-button min-w-[165px]" onclick={copyTwoHandler}>
            <div class="flex justify-between">
              {#if isScriptTwoCopied}
                <AbstractIcon name={icons.Check.name} width="24" height="24" />Copied
              {:else}
                <AbstractIcon name={icons.Copy.name} width="24" height="24" />Copy Script Code
              {/if}
            </div>
          </button>
    
          <button class="action-button min-w-[165px]" onclick={downloadTwoNpmHandler}>
            <div class="flex justify-between">
              <AbstractIcon name={icons.Download.name} width="24" height="24" /> Download As .sol
            </div>
          </button>
    
        </div>
    
      </div>
    
      <div class="flex flex-row gap-4 grow">
    
        {@render control()}
    
        <div class="w-full output flex flex-col grow overflow-auto h-[calc(150vh-40px)]">
          <div class="badge badge-primary badge-outline badge-lg">
            Source Contract Code:
          </div>
          <div class="badge badge-primary badge-outline badge-lg">
            {contractOneInstance.name}.sol
          </div>
    
          <pre class="flex flex-col grow basis-0 overflow-auto">
            <code class="hljs grow overflow-auto p-4">
              {@html highlightedCodeOne}
            </code>
          </pre>
    
        </div>

        <div class="output flex flex-col grow overflow-auto h-[calc(150vh-40px)]">
            <div class="badge badge-primary badge-outline badge-lg">
                Destination Contract Code:
            </div>
            <div class="badge badge-primary badge-outline badge-lg">
                {contractTwoInstance.name}.sol
            </div>
      
            <pre class="flex flex-col grow basis-0 overflow-auto">
              <code class="hljs grow overflow-auto p-4">
                {@html highlightedCodeTwo}
              </code>
            </pre>
        </div>
        
      </div>
    
  </div>
        
  <style lang="postcss">
    .container {
        background-color: var(--gray-1);
        border: 1px solid var(--gray-2);
        border-radius: 10px;
        min-width: 32rem;
    }
  
    /* .header {
        font-size: var(--text-small);
    } */
  
    /* .tab {
        color: var(--gray-5);
    }
    */
    .action-button, :global(.overflow-btn) {
        padding: var(--size-1) var(--size-2);
        border-radius: 6px;
        font-weight: bold;
        cursor: pointer;
    }
  
    :global(.overflow-btn) {
        border: 0;
        background-color: transparent;
    }
  
    :global(.overflow-btn):hover {
        background-color: var(--gray-2);
    }
  
  
    .action-button {
        background-color: var(--gray-1);
        border: 1px solid var(--gray-3);
        color: var(--gray-6);
        cursor: pointer;
  
        &:hover {
        background-color: var(--gray-2);
        }
  
        /* &:active, &.active {
        background-color: var(--gray-2);
        }
        */
  
        /* &.disabled {
        color: var(--gray-4);
        } */
  
        :global(.icon) {
        margin-right: var(--size-1);
        }
    }
  
  </style>