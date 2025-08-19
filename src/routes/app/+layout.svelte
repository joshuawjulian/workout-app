<script lang="ts">
	const { children } = $props();
</script>

<div class="drawer">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		{@render children()}
		<label for="my-drawer" class="btn btn-primary drawer-button">Open drawer</label>
	</div>
	<div class="drawer-side">
		<label for="my-drawer" class="drawer-overlay"></label>
		<ul class="menu p-4 w-80 bg-base-100 text-base-content">
			<li><a href="#!">Sidebar Item 1</a></li>
			<li><a href="#!">Sidebar Item 2</a></li>
		</ul>
	</div>
</div>
