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
    name="Collateral-Backed to Synthetic"
    button={button1}
    popular={false}
>
    <SolutionFeature>Visualize Different Hyperlane's Bridge Smart contracts</SolutionFeature>
    <SolutionFeature>Select & Modify Token Features</SolutionFeature>
    <SolutionFeature>ERC20 or ERC4626</SolutionFeature>
    <SolutionFeature>Fiat-Backed Tokens: Specific mint and burn ops </SolutionFeature>
    <SolutionFeature>Fast Fee: to incentivize LPs</SolutionFeature>
    <SolutionFeature>Fast Transfer: Unique transfer identification</SolutionFeature>
</SolutionCard>

{#if button2}
    <SolutionCard
        name="xERC20"
        button={button2}
        popular={false}
    >
        <SolutionFeature>Visualize Different Hyperlane's Bridge Smart contract</SolutionFeature>
        <SolutionFeature>Select & Modify Token Features</SolutionFeature>
        <SolutionFeature>XERC20 or XERC20Lockbox</SolutionFeature>
        <SolutionFeature>Warp Route Limits Management</SolutionFeature>
    </SolutionCard>
{/if}