<script lang="ts">
	import { getLoggedInEmail, isLoggedIn } from '$lib/user.remote';
	import { allUsers, loginUser, signupUser } from './form.remote';
</script>

<div class="w-full h-full flex flex-col items-center justify-center">
	<svelte:boundary>
		{#snippet pending()}
			<p>Loading...</p>
		{/snippet}
		{#if await isLoggedIn()}
			<div class="flex flex-col">
				<h1 class="text-2xl font-bold">Welcome back, {await getLoggedInEmail()}!</h1>
				<p class="text-lg">You are logged in.</p>
				<p><a href="/api/logout">Logout</a></p>
			</div>
		{:else}
			<div class="tabs tabs-box w-120">
				<input type="radio" name="my_tabs_6" class="tab" aria-label="Login" checked />
				<div class="tab-content bg-base-100 border-base-300 p-6">
					<form {...loginUser}>
						{#if loginUser.result?.success == false}
							<p class="text-red-500 mt-[-10px]">{loginUser.result?.message}</p>
						{/if}
						<input
							type="text"
							placeholder="email"
							name="email"
							class="input input-bordered w-full mb-4"
						/>
						<input
							type="password"
							placeholder="password"
							name="password"
							class="input input-bordered w-full mb-4"
						/>
						<button type="submit" class="btn btn-primary w-full mb-4">Login</button>
					</form>
				</div>

				<input type="radio" name="my_tabs_6" class="tab" aria-label="Signup" />
				<div class="tab-content bg-base-100 border-base-300 p-6">
					<form {...signupUser}>
						<input
							type="text"
							placeholder="email"
							name="email"
							class="input input-bordered w-full mb-4"
						/>
						{#if signupUser.result?.success == false && signupUser.result?.field === 'email'}
							<p class="text-red-500 mt-[-10px]">{signupUser.result?.message}</p>
						{/if}
						<input
							type="password"
							placeholder="password"
							name="password"
							class="input input-bordered w-full mb-4"
						/>
						{#if signupUser.result?.success == false && signupUser.result?.field === 'password'}
							<p class="text-red-500 mt-[-10px]">{signupUser.result?.message}</p>
						{/if}
						<input
							type="password"
							placeholder="confirm password"
							name="confirm_password"
							class="input input-bordered w-full mb-4"
						/>
						{#if signupUser.result?.success == false && signupUser.result?.field === 'confirm_password'}
							<p class="text-red-500 mt-[-10px]">{signupUser.result?.message}</p>
						{/if}
						<button type="submit" class="btn btn-primary w-full mb-4"> Register </button>
					</form>
				</div>
			</div>
			<div class="w-full h-full flex flex-col items-center justify-center">
				<h1 class="text-2xl font-bold">Users</h1>
				<svelte:boundary>
					{#snippet pending()}
						<p>Loading...</p>
					{/snippet}
					{#each await allUsers() as user}
						<p>{user.email}</p>
					{/each}
				</svelte:boundary>
			</div>
		{/if}
	</svelte:boundary>
</div>
