<script lang="ts">
	const { children } = $props();
	// In a real app, you might have dynamic navigation items
	const navLinks = [
		{ href: '/', label: 'Homepage' },
		{ href: '/analytics', label: 'Analytics' },
		{ href: '/portfolio', label: 'Portfolio' },
		{ href: '/settings', label: 'Settings' }
	];
</script>

<!-- 
  DaisyUI Drawer Component Structure
  - `lg:drawer-open`: This is the key class. It makes the drawer permanently open on large screens (1024px and up).
  - On smaller screens, this class doesn't apply, and the drawer is controlled by the checkbox.
-->
<div class="drawer lg:drawer-open bg-base-200">
	<!-- Hidden checkbox to control the drawer's state on mobile -->
	<input id="my-drawer" type="checkbox" class="drawer-toggle" />

	<!-- Page Content -->
	<div class="drawer-content flex flex-col items-start p-4">
		<!-- 
      Hamburger Menu Button
      - `lg:hidden`: This makes the button visible ONLY on screens smaller than lg.
      - The `htmlFor` attribute connects this label to the checkbox, so clicking it toggles the drawer.
    -->
		<label for="my-drawer" class="btn btn-square btn-ghost lg:hidden mb-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="inline-block w-6 h-6 stroke-current"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				></path></svg
			>
		</label>

		<!-- Your main page content goes here -->
		<div class="prose">
			{@render children()}
		</div>
	</div>

	<!-- Sidebar Content -->
	<div class="drawer-side">
		<!-- The overlay darkens the main content when the drawer is open on mobile -->
		<label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

		<!-- 
      Sidebar Menu
      - `w-80`: Sets the width of the sidebar.
      - `bg-base-100`: Gives it a background color from your DaisyUI theme.
    -->
		<ul class="menu p-4 w-80 min-h-full bg-base-100 text-base-content">
			<li class="menu-title text-4xl font-bold p-2 mb-2">Workout App</li>

			<!-- Admin Access -->
			<li class="menu-title text-lg font-bold p-2">Dictionary Tables</li>
			<li><a href="/app/movement-patterns">Movement Patterns</a></li>
			<li><a href="#!">M</a></li>
			<li><a href="#!">Movement Patterns</a></li>
		</ul>
	</div>
</div>
