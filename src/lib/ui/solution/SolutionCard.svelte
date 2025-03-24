<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/ui/utils/mics';

  type Props = {
    children: Snippet;
    button: Snippet;
    name: string;
    popular: boolean;
  };

  let { children, button, name, popular }: Props = $props();

  const solutionBaseStyles = 'bg-grey-100 flex flex-col p-8 rounded-md border-2 border-gray-200 hover:shadow';
  const solutionAnimatedStyles =  popular? 'scale-105 z-10' : '';

  const cardBaseStyles = 'text-center text-2xl font-semibold text-gray-700';
  const cardAnimatedStyles = popular? 'mt-4' : '';

</script>

<div
  class={cn(solutionBaseStyles, solutionAnimatedStyles)}
>
  {#if popular}
    <div class="self-center rounded-full bg-primary-200 px-3 py-1 text-sm font-semibold tracking-wider text-primary-600">
      No dependencies
    </div>
  {/if}

  <div class={cn(cardBaseStyles, cardAnimatedStyles)}>{name}</div>


  <ul class="mb-8 mt-4">
    {@render children?.()}
 </ul>

  {@render button?.()}

</div>