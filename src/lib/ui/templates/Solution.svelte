<script lang="ts">

    import Button from '$lib/ui/buttons/Button.svelte';
    import LandingSection from '$lib/ui/layouts/LandingSection.svelte';
    import SolutionModel from '$lib/ui/templates/SolutionModel.svelte';

</script>

<LandingSection title="Customizable Interoperability" subtitle="Product Features">
    <div class="mx-4 grid grid-cols-1 gap-y-12 md:grid-cols-2 lg:mx-32">
      <SolutionModel>
        {#snippet button1()}
            <a href={'/dapp'}>
                <Button
                    variant="outline"
                    type="submit"
                >
                Get Started
                </Button>
            </a>
        {/snippet}
        {#snippet button2()}
            <a href={'/rollup'}>
                <Button
                    variant="outline"
                    type="submit"
                >
                Get Started
                </Button>
            </a>
        {/snippet}
        
      </SolutionModel>
    </div>
  </LandingSection>
