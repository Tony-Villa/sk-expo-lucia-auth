<script lang="ts">
  let {data} = $props()

  console.log(data)
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{#if !data.isAuthenticated}
  <form method="POST" action="?/login">
    <button formaction="?/login&provider=google">Google</button>
    <button formaction="?/login&provider=github">Github</button>
    <button formaction="?/login&provider=discord">Discord</button>
  </form>
{:else}
  <form method="POST" action="?/logout">
    <button formaction="?/logout">Sign Out</button>
  </form>
  <h1>{data.user.user?.name}</h1>
{/if}
<!-- <a href="/auth/login/google">Google</a>
<a href="/auth/login/github">Github</a>
<a href="/auth/login/discord">Discord</a> -->
