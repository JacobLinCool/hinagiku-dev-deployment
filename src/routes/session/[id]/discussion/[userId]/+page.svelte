<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { deploymentConfig } from '$lib/config/deployment';

	let messages = $state([{ sender: 'Support', text: 'Hello! How can I assist you today?' }]);
	let inputText = $state('');
	import { Mic } from 'lucide-svelte';
	const Recording = () => {
		console.log('Recording...');
	};
	const sendMessage = () => {
		console.log('Sending message...');
	};
</script>

<svelte:head>
	<title>Discussion | {deploymentConfig.siteTitle}</title>
</svelte:head>

<main class="mt-20">
	<div class="chat-container">
		<div class="messages">
			{#each messages as message}
				<div class="message" class:me={message.sender === 'me'}>
					<!--<User class="inline-block"/>-->
					{#if message.sender !== 'me'}
						<!--<img src={message.avatar} alt="Avatar" class="avatar left" />-->
					{/if}
					<p class="font-bold">{message.sender === 'me' ? 'You' : message.sender}:</p>
					{message.text}
					{#if message.sender === 'me'}
						<!--<img src={message.avatar} alt="Avatar" class="avatar right" />-->
					{/if}
				</div>
			{/each}
		</div>

		<div class="input-area">
			<button
				disabled={messages[messages.length - 1].sender === 'me'}
				onmousedown={Recording}
				onmouseup={Recording}
				class="recordbtn"
			>
				<Mic size={24} />
			</button>
			<input
				class="inline-block"
				type="text"
				bind:value={inputText}
				placeholder={m.typeMessage()}
				onkeyup={(e) => e.key === 'Enter' && sendMessage()}
			/>
			<button disabled={messages[messages.length - 1].sender === 'me'} onclick={sendMessage}>
				{m.send()}
			</button>
			<div class="w-full"></div>
			{#if messages[messages.length - 1].sender === 'me'}
				<div>{m.waitResponse()}</div>
			{/if}
		</div>
	</div>
</main>

<style>
	.chat-container {
		max-width: 80%;
		margin: 0 auto;
	}
	.messages {
		height: 400px;
		overflow-y: auto;
		border: 1px solid #ccc;
		padding: 10px;
	}
	.message {
		margin: 10px 0;
		text-align: left;
	}
	.message.me {
		text-align: right;
	}
	.input-area {
		margin-top: 10px;
		display: flex;
		flex-wrap: wrap;
	}
	.input-area input {
		flex: 1;
		padding: 10px;
	}
	.input-area button {
		padding: 10px;
	}
	.input-area button:hover {
		background-color: #f0f0f0;
	}
	.input-area button:active {
		background-color: #e0e0e0 !important;
	}
	.input-area button:disabled {
		pointer-events: none;
	}
	.recordbtn {
		background-color: #f0f0f0;
		border: none;
		border-radius: 50%;
		padding: 10px;
		margin-right: 10px;
	}
	.recordbtn:active {
		background-color: red;
	}
</style>
