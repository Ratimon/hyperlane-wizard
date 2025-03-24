<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { PageData } from './$types';

	import '../app.postcss';

	type Props = {
        children: Snippet;
		data: PageData;
    } & PageData;

	let { children, data }: Props = $props();
</script>

{@render children()}
