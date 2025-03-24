<script lang="ts">

    import type { Snippet } from 'svelte';

    type Props = {
        children: Snippet;
        title?: string;
        subtitle?: string;
        description?: string;
        yPadding?: string;
    }

    let {
        children,
        title,
        subtitle,
        description,
        yPadding,
    }: Props = $props();

</script>


<div class={`mx-auto max-w-screen-xl px-3 sm:px-5 lg:px-6 ${yPadding ? yPadding : 'py-16'}`}>

    {#if title || subtitle || description}
        <div class="mx-auto mb-12 w-full text-center md:w-4/5 lg:w-3/4 xl:w-2/3">
            {#if subtitle }
                <div class="text-sm font-bold text-primary-500">
                    {subtitle}
                </div>
            {/if}
            {#if title }
                <h2 class="text-center font-extrabold text-3xl md:text-5xl tracking-tight mb-12 md:mb-20">
                    {title}
                </h2>
            {/if}

            {#if description}
                <div class="mt-4 text-xl">
                    {description}
                </div>
            {/if}
        </div>

    {/if}

    {@render children?.()}

</div>