<script lang="ts">
	import { getLoggedInEmail } from '$lib/user.remote';
</script>

<div class="w-full h-full flex flex-col items-center justify-center">
	<svelte:boundary>
		{#snippet pending()}
			<p>Loading...</p>
		{/snippet}
		<h1 class="text-2xl font-bold">Welcome back, {await getLoggedInEmail()}!</h1>
	</svelte:boundary>
	<p class="text-lg">You are logged in.</p>
	<p><a href="/api/logout">Logout</a></p>
</div>
