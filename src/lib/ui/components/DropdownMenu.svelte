<script lang="ts">
	import type { Snippet } from "svelte";
	import { DropdownMenu, type WithoutChild } from "bits-ui";
 
	type Props = {
		children: Snippet;
		open: boolean;
		buttonText: string;
		items: string[];
		contentProps?: WithoutChild<DropdownMenu.ContentProps>;
		// other component props if needed
	};
 
	let {
    children,
		open = $bindable(false),
		buttonText,
		items,
		contentProps,
		...rest
	}: Props = $props();
</script>
 
<DropdownMenu.Root bind:open {...rest}>
	<DropdownMenu.Trigger>
		{buttonText}
	</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content {...contentProps}>
			<DropdownMenu.Group aria-label={buttonText}>
				{#each items as item}
					<DropdownMenu.Item textValue={item}>
						{item}
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>