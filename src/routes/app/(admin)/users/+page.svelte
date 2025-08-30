<script lang="ts">
	import { websiteRolesEnumSchema } from '$lib/schema/auth.schema';
	import { allUsersWithRoles, updateUserRole } from '$lib/user.remote';

	const websiteRoles = ['user', 'admin', 'super'];

	const truncateString = (str: string, maxLength = 10) => {
		if (str.length <= maxLength) return str;
		const frontLength = Math.ceil((maxLength - 3) / 2);
		const backLength = Math.trunc((maxLength - 3) / 2);
		return `${str.slice(0, frontLength)}...${str.slice(-1 * backLength)}`;
	};

	const updateRole = async (userId: string, role: string | null) => {
		const result = websiteRolesEnumSchema.safeParse(role);
		if (!result.success) {
			console.error('role === null');
			return;
		}
		console.log(`update ${userId} to ${role}`);
		await updateUserRole({ userId, role: result.data });
	};
</script>

<div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-300">
	<svelte:boundary>
		{#snippet pending()}
			<p>Loading...</p>
		{/snippet}
		<table class="table">
			<thead>
				<tr>
					<th></th>
					<th>Email</th>
					<th>Role</th>
				</tr>
			</thead>
			<tbody>
				{#each await allUsersWithRoles() as user}
					<tr>
						<th>{truncateString(user.id, 12)}</th>
						<td>{user.email}</td>
						<td>
							<select
								id="websiteRole"
								name="websiteRole"
								class="select select-ghost"
								onchange={async (event) =>
									await updateRole(user.id, event.currentTarget.value as string)}
							>
								{#each websiteRoles as role}
									<option value={role} selected={role === user.userWebsiteRole.role}>{role}</option>
								{/each}
							</select>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</svelte:boundary>
</div>
