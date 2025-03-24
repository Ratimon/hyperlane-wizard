<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLButtonAttributes } from 'svelte/elements';

    import { type VariantProps, tv } from "tailwind-variants";
    import { cn } from "$lib/ui/utils/mics";

    type Variant = VariantProps<typeof buttonVariants>["variant"];
    type Size = VariantProps<typeof buttonVariants>["size"];

    type Props = {
        children: Snippet;
        class?: string | undefined | null;
        variant?: Variant;
        size?: Size;
    } & HTMLButtonAttributes;

    let {
        children,
        class: className,
        variant = "default",
        size = "default",
        ...rest
    }: Props = $props();
    

    const buttonVariants = tv({
        base: "ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants: {
            variant: {
                default: "bg-primary text-primary-content hover:bg-primary/90",
                warning: "bg-warning text-warning-content hover:bg-warning/90",
                outline:
                    "border-input bg-base-200 text-primary-content hover:bg-accent hover:text-primary-content/80 border",
                secondary: "bg-secondary text-secondary-content hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-content",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    });
  
  
  </script>
  
  <button
    class={cn(buttonVariants({ className, variant, size  }))}
    {...rest}
  >
      {@render children?.()}
  </button>