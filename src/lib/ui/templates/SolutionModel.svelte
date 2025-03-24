<script lang="ts">
    import type { Snippet } from 'svelte';

    import SolutionCard from '$lib/ui/solution/SolutionCard.svelte';
    import SolutionFeature from '$lib/ui/solution/SolutionFeature.svelte';
  
    type Props = {
        button1: Snippet;
        button2?: Snippet;
    };
  
    let { button1, button2 }: Props = $props();
  
</script>
  
<SolutionCard
    name="For dApp developers"
    button={button1}
    popular={false}
>
    <SolutionFeature>Select Bridge Type from Hyperlane contract</SolutionFeature>
    <SolutionFeature>Bridge: Collateral to Synthetic</SolutionFeature>
    <SolutionFeature>Bridge: xERC20</SolutionFeature>
    <SolutionFeature>Fast Fee: to incentivize LPs</SolutionFeature>
    <SolutionFeature>Fast Transfer: Unique transfer identification</SolutionFeature>
</SolutionCard>

{#if button2}
    <SolutionCard
        name="For rollup developers"
        button={button2}
        popular={false}
    >
        <SolutionFeature>Customize your Own Chain</SolutionFeature>
        <SolutionFeature>Bridge: Native to Native</SolutionFeature>
        <SolutionFeature>Bridge: Native to Synthetic</SolutionFeature>
        <SolutionFeature>Fast Native Transfers: via Custom Gas Tokens</SolutionFeature>
    </SolutionCard>
{/if}