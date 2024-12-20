import { summarizeGroupOpinions } from '$lib/server/llm';
import { getGroupData, getGroupRef } from '$lib/utils/firestore';
import type { Discussion, StudentSpeak } from '$lib/utils/types';
import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';

// Summary the group discussions
// GET /api/session/[id]/group/[group_number]/discussions/summary/+server

export const GET: RequestHandler = async ({ params, locals }) => {
	try {
		if (!locals.user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id, group_number } = params;
		if (!id || !group_number) {
			return json({ error: 'Missing parameters' }, { status: 400 });
		}

		const group_ref = getGroupRef(id, group_number);
		const { discussions } = await getGroupData(group_ref);
		const student_opinions = discussion2StudentSpeak(discussions);

		const response = await summarizeGroupOpinions(student_opinions);
		if (!response.success) {
			return json({ error: response.error }, { status: 500 });
		}

		group_ref.update({
			group_summary: response.summary
		});

		return json({ success: true }, { status: 200 });
	} catch (error) {
		console.error('Error summary discussion:', error);
		return json({ error: 'Error summary discussion' }, { status: 500 });
	}
};

// Update the group discussions summary
// PUT /api/session/[id]/group/[group_number]/discussions/summary/+server
// Request data format
const requestDataFormat = z.object({
	updated_summary: z.string()
});

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	try {
		if (!locals.user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id, group_number } = params;
		if (!id || !group_number) {
			return json({ error: 'Missing parameters' }, { status: 400 });
		}

		const { updated_summary } = await getRequestData(request);
		const group_ref = getGroupRef(id, group_number);
		group_ref.update({
			group_summary: updated_summary
		});

		return json({ success: true }, { status: 200 });
	} catch (error) {
		console.error('Error updating discussion summary:', error);
		return json({ error: 'Error updating discussion summary' }, { status: 500 });
	}
};

function discussion2StudentSpeak(discussions: Discussion[]): StudentSpeak[] {
	return discussions.map((discussion) => ({
		role: discussion.speaker ? discussion.speaker : 'student',
		content: discussion.content
	}));
}

async function getRequestData(request: Request): Promise<z.infer<typeof requestDataFormat>> {
	const data = await request.json();
	const result = requestDataFormat.parse(data);
	if (!result.updated_summary) {
		throw error(400, 'Missing parameters');
	}
	if (typeof result.updated_summary !== 'string') {
		throw error(400, 'Invalid parameters');
	}
	return result;
}
