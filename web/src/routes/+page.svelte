<script lang="ts">
  let {data} = $props()

  const buttonClass = `font-black rounded-md px-3 py-1 relative hover:bg-yellow-200 bg-orange-400 text-black`
</script>

<div class="flex flex-col justify-center align-middle mt-24 w-full h-full">
  <h1 class="text-3xl font-bold underline text-center mb-8">
    {#if !data?.user}
    Sign In
    {:else}
    Sign Out
    {/if}
  </h1>
  {#if !data.isLoggedIn}
    <form class="flex flex-col gap-8 max-w-96 self-center" method="POST" action="?/login">
      <button class={buttonClass} formaction="?/login&provider=google">Google (not set up)</button>
      <button class={buttonClass} formaction="?/login&provider=github">Github (not set up)</button>
      <button class={buttonClass} formaction="?/login&provider=discord">Discord</button>
    </form>
  {:else}
  <h1 class="text-3xl font-bold underline text-center mb-8">{data.user.user?.name}</h1>
    <form class="flex flex-col gap-8 max-w-96 self-center" method="POST" action="?/logout">
      <button class={buttonClass} formaction="?/logout">Sign Out</button>
    </form>
  {/if}
</div>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.slate.950);
    color: theme(colors.gray.200)
  }
</style>