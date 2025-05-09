<script lang="ts">
	import type { Conversation } from '$lib/schema/conversation';
	import type { Group } from '$lib/schema/group';
	import Summary from './Summary.svelte';
	import GroupSummary from './GroupSummary.svelte';
	import Chatroom from '$lib/components/Chatroom.svelte';
	import { deploymentConfig } from '$lib/config/deployment';

	let { conversationDoc, groupDoc, user } = $props<{
		conversationDoc: { data: Conversation; id: string } | null;
		groupDoc: { data: Group; id: string } | null;
		user: { uid: string };
	}>();

	let activeTab = $state('summary'); // 'summary', 'groupSummary', 'chat', 'groupChat'

	let individualConversations = $derived.by(() => {
		if (!conversationDoc) return [];
		return conversationDoc.data.history.map(
			(message: { role: string; content: string; audio?: string }) => ({
				name: message.role === 'user' ? 'You' : '小菊' + deploymentConfig.siteTitle,
				content: message.content,
				self: message.role === 'user',
				audio: message.audio || undefined
			})
		);
	});

	let groupConversations = $derived.by(() => {
		if (!groupDoc) return [];
		return groupDoc.data.discussions.map(
			(discussion: {
				speaker: string;
				content: string;
				id: string | null;
				audio: string | null;
			}) => ({
				name: discussion.speaker,
				content: discussion.content,
				self: discussion.id === user.uid,
				audio: discussion.audio || undefined
			})
		);
	});
</script>

<div class="space-y-4">
	<div class="flex space-x-4">
		<button
			class="rounded-lg px-4 py-2 {activeTab === 'summary'
				? 'bg-primary-600 text-white'
				: 'bg-gray-200'}"
			onclick={() => (activeTab = 'summary')}
		>
			個人總結
		</button>
		<button
			class="rounded-lg px-4 py-2 {activeTab === 'groupSummary'
				? 'bg-primary-600 text-white'
				: 'bg-gray-200'}"
			onclick={() => (activeTab = 'groupSummary')}
		>
			小組總結
		</button>
		<button
			class="rounded-lg px-4 py-2 {activeTab === 'chat'
				? 'bg-primary-600 text-white'
				: 'bg-gray-200'}"
			onclick={() => (activeTab = 'chat')}
		>
			個人對話歷史
		</button>
		<button
			class="rounded-lg px-4 py-2 {activeTab === 'groupChat'
				? 'bg-primary-600 text-white'
				: 'bg-gray-200'}"
			onclick={() => (activeTab = 'groupChat')}
		>
			小組討論歷史
		</button>
	</div>

	{#if activeTab === 'summary' && conversationDoc}
		<Summary
			conversation={conversationDoc}
			loading={false}
			readonly={true}
			onRefresh={async () => {}}
			onUpdate={async () => {}}
		/>
	{:else if activeTab === 'groupSummary' && groupDoc}
		<GroupSummary
			group={{
				data: groupDoc.data,
				id: groupDoc.id
			}}
			loading={false}
			readonly={true}
			onRefresh={async () => {}}
			onUpdate={async () => {}}
		/>
	{:else if activeTab === 'chat' && conversationDoc}
		<div class="h-[600px] rounded-lg border bg-white p-4">
			<Chatroom conversations={individualConversations} readonly={true} />
		</div>
	{:else if activeTab === 'groupChat' && groupDoc}
		<div class="h-[600px] rounded-lg border bg-white p-4">
			<Chatroom conversations={groupConversations} readonly={true} />
		</div>
	{/if}
</div>
