import { getAllMovementPatterns } from '$lib/server/db/queries/movementPatterns';
import { getAllMovements } from '$lib/server/db/queries/movements';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const movements = await getAllMovements();
	const movementPatterns = await getAllMovementPatterns();
	return { movements, movementPatterns };
};