import { getAllMovementPatterns } from '$lib/server/db/queries/movementPatterns';
import { getAllMovements } from '$lib/server/db/queries/movements';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
		movements: await getAllMovements(),
		movementPatterns: await getAllMovementPatterns()
	};
};
