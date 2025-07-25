<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import { Card, Tooltip } from 'flowbite-svelte';
	import { Target, HelpCircle } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	// Register Chart.js components
	Chart.register(...registerables);

	// Define types for the data structure
	type ClassSubtaskData = {
		className: string;
		averageCompletionRate: number;
		sessionCount: number;
	};

	// Props
	export let data: ClassSubtaskData[] = [];

	// Chart instance
	let chartInstance: Chart | null = null;
	let chartCanvas: HTMLCanvasElement;

	// Function to update chart
	function updateChart() {
		if (!chartCanvas || !data.length) return;

		// Destroy existing chart if it exists
		if (chartInstance) {
			chartInstance.destroy();
		}

		// Create new chart
		chartInstance = new Chart(chartCanvas, {
			type: 'bar',
			data: {
				labels: data.map((d) => d.className),
				datasets: [
					{
						label: m.chartAverageSubtaskCompletionRate(),
						data: data.map((d) => d.averageCompletionRate),
						backgroundColor: 'rgba(168, 85, 247, 0.7)',
						borderColor: 'rgba(168, 85, 247, 1)',
						borderWidth: 1
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					title: {
						display: false
					},
					tooltip: {
						callbacks: {
							label: function (context) {
								return [`${m.chartAverageCompletionRate()}: ${context.parsed.y.toFixed(1)}%`];
							}
						}
					}
				},
				scales: {
					x: {
						title: {
							display: true,
							text: m.chartClass(),
							font: {
								weight: 'bold'
							}
						}
					},
					y: {
						beginAtZero: true,
						max: 100,
						title: {
							display: true,
							text: m.chartAverageCompletionRate(),
							font: {
								weight: 'bold'
							}
						}
					}
				}
			}
		});
	}

	// Update chart when data changes
	$: if (data) {
		updateChart();
	}

	onMount(() => {
		updateChart();
	});
</script>

<Card padding="lg" class="w-full !max-w-none">
	<div class="mb-4">
		<div class="mb-3 flex items-center gap-3">
			<div class="rounded-full bg-primary-100 p-2">
				<Target size={20} class="text-primary-600" />
			</div>
			<h3 class="text-lg font-semibold text-gray-900">{m.chartClassSubtaskCompletion()}</h3>
			<div class="relative inline-block">
				<HelpCircle size={16} class="cursor-help text-gray-400" />
				<Tooltip placement="right" class="w-[300px] text-sm">{m.subtaskCompletionFormula()}</Tooltip
				>
			</div>
		</div>
		<p class="text-sm text-gray-600">{m.chartClassSubtaskCompletionDesc()}</p>
	</div>

	<div class="h-[400px] w-full">
		<canvas bind:this={chartCanvas}></canvas>
	</div>
</Card>
