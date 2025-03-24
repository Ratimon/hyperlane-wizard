<script lang="ts">
    import type { Snippet } from 'svelte';
  
    type Props = {
      children: Snippet;
    };
  
    let { children }: Props = $props();
  
</script>
  
<li class="mt-2 flex items-center">
    <svg
      class="mr-2 size-6 stroke-current stroke-2 text-green-500"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M0 0h24v24H0z" stroke="none" />
      <path d="M5 12l5 5L20 7" />
    </svg>
    {@render children?.()}
</li>
   