<script  lang="ts">
    import type { PageData } from './$types';

    import Solution from '$lib/ui/templates/Solution.svelte';

    type Props = {
        data: PageData;
    } & PageData;

    let { data }: Props = $props();

</script>

<div class="flex flex-col gap-10 lg:gap-7 items-center justify-center text-center">
    <a href={'/dapp'}>
        <h1 class="font-bold text-3xl lg:text-5xl tracking-tight md:-mb-4 bg-gradient-to-r from-red-600 via-green-500 to-indigo-400 text-transparent bg-clip-text">
            Hyperlane Wizard
        </h1>
    </a>
    
</div>

<Solution />
