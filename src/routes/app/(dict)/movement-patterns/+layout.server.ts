import { getAllMovementPatterns } from '$lib/server/db/queries/movementPatterns';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const patterns = await getAllMovementPatterns();
	return { patterns };
};