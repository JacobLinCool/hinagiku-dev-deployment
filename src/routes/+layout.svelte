<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { sidebarOpen } from '$lib/stores/sidebar';
	import Navbar from '$lib/components/Navbar.svelte';
	import Notifications from '$lib/components/Notifications.svelte';
	import debug from 'debug';

	debug.enable('app:*');

	let { children } = $props();
</script>

<main class:sidebar-open={$sidebarOpen}>
	<Sidebar />
	<Navbar />
	{@render children()}
	<Notifications />
</main>

<style>
	main {
		margin-left: 0;
		transition: margin-left 0.3s ease;
		margin-top: 3.5rem;
	}

	main.sidebar-open {
		margin-left: 12.5rem;
	}
</style>
