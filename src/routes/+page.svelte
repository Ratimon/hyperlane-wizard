<script  lang="ts">
    import type { PageData } from './$types';

    import Solution from '$lib/ui/templates/Solution.svelte';

    type Props = {
        data: PageData;
    } & PageData;

    let { data }: Props = $props();

</script>

<Solution />
