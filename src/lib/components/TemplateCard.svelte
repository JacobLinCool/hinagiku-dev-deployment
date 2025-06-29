<script lang="ts">
	import { Button, Card } from 'flowbite-svelte';
	import { user } from '$lib/stores/auth';
	import { GitFork } from 'lucide-svelte';
	import { notifications } from '$lib/stores/notifications';
	import { goto } from '$app/navigation';
	import { i18n } from '$lib/i18n';
	import * as m from '$lib/paraglide/messages.js';

	let {
		id,
		title,
		task,
		subtaskSize,
		resourceSize,
		owner,
		isPublic,
		labels,
		archived = false
	}: {
		id: string;
		title: string;
		task: string;
		subtaskSize: number;
		resourceSize: number;
		owner: string;
		isPublic?: boolean;
		labels?: string[];
		archived?: boolean;
	} = $props();

	let forking = $state(false);
	async function handleForkTemplate() {
		if (forking) {
			return;
		}
		forking = true;

		try {
			const response = await fetch(`/api/template/${id}/fork`, {
				method: 'POST'
			});

			if (!response.ok) {
				throw new Error('Failed to fork template');
			}

			const {
				id: forkedId
			}: {
				id: string;
			} = await response.json();
			notifications.success('Template forked successfully');
			await goto(i18n.resolveRoute(`/template/${forkedId}`));
		} catch (error) {
			console.error('Error forking template:', error);
			notifications.error('Failed to fork template');
		} finally {
			forking = false;
		}
	}
</script>

<Card
	padding="lg"
	class="h-full transition-all hover:border-primary-500"
	style={archived ? 'opacity: 0.5;' : ''}
>
	<div class="flex h-full flex-col">
		<div class="mb-2 flex items-start justify-between">
			<h3 class="line-clamp-1 flex-1 text-xl font-bold">{title}</h3>
			{#if isPublic !== undefined}
				<span
					class="rounded-full px-3 py-1 text-sm font-medium {isPublic
						? 'bg-green-100 text-green-600'
						: 'bg-gray-100 text-gray-600'}"
				>
					{isPublic ? m.Tpublic() : m.Tprivate()}
				</span>
			{/if}
		</div>
		{#if labels?.length}
			<div class="mb-2 flex flex-wrap gap-1">
				{#each labels as label}
					<span class="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
						{label}
					</span>
				{/each}
			</div>
		{/if}
		<p class="mb-4 line-clamp-2 text-gray-600">{task}</p>
		<div class="mt-auto w-full">
			<div class="mb-4 flex items-center gap-4">
				<span class="text-sm text-gray-500">
					{m.subtasksNumber({ count: subtaskSize })}
				</span>
				<span class="text-sm text-gray-500">
					{m.resourcesNumber({ count: resourceSize })}
				</span>
			</div>
			<div class="flex gap-2">
				{#if owner === $user?.uid}
					<Button href="/template/{id}" class="flex-1">{m.useTemplate()}</Button>
				{:else if $user?.uid}
					<div class="flex w-full gap-2">
						<Button href="/template/{id}/view" color="alternative" class="flex-1">{m.view()}</Button
						>
						<Button color="alternative" class="flex-1" on:click={handleForkTemplate}>
							<GitFork class="h-4 w-4" />
							{m.fork()}
						</Button>
					</div>
				{:else}
					<div class="flex w-full gap-2">
						<Button href="/template/{id}/view" color="alternative" class="flex-1">{m.view()}</Button
						>
						<Button href="/login?redirect=/templates/public" color="alternative" class="flex-1">
							{m.loginToFork()}
						</Button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</Card>
