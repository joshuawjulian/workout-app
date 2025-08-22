// src/data/seed/movement-patterns.ts

export interface MovementPatternSeed {
	name: string;
	description: string;
}

export const movementPatternSeeds: MovementPatternSeed[] = [
	{
		name: 'Squat',
		description:
			'A lower-body movement characterized by flexing at the hips and knees to lower the center of mass, keeping the chest upright. This is a fundamental pattern for building leg strength, power, and mobility, forming the base for Olympic lifts and safe landing mechanics.'
	},
	{
		name: 'Hinge',
		description:
			'A closed-chain movement of hinging at the hips, moving the glutes backward while maintaining a neutral spine. This is the primary pattern for powerfully activating the posterior chain (glutes, hamstrings, lower back) and is essential for lifting heavy objects from the ground.'
	},
	{
		name: 'Lunge',
		description:
			'A unilateral (single-leg) lower-body movement that involves stepping in a direction and lowering the hips. This pattern is critical for developing single-leg strength, balance, and stability, which translates directly to running, climbing, and change-of-direction.'
	},
	{
		name: 'Push (Horizontal)',
		description:
			'Pushing a load (or your bodyweight) away from your chest in a plane parallel to the ground. This movement develops the pectoral muscles, shoulders, and triceps, forming the basis of pressing strength.'
	},
	{
		name: 'Push (Vertical)',
		description:
			'Pushing a load (or your bodyweight) vertically overhead. This pattern is fundamental for building shoulder strength and stability, and it is a key component of Olympic weightlifting (the jerk) and gymnastics (the handstand).'
	},
	{
		name: 'Pull (Horizontal)',
		description:
			'Pulling a load (or your bodyweight) towards your torso in a plane parallel to the ground. This movement is key for developing strength and thickness in the mid-back (rhomboids, traps), promoting good posture and balancing horizontal pressing.'
	},
	{
		name: 'Pull (Vertical)',
		description:
			'Pulling a load (or your bodyweight) down from an overhead position. This is the primary pattern for developing back width via the latissimus dorsi ("lats") and is a cornerstone of gymnastics.'
	},
	{
		name: 'Rotation',
		description:
			'Twisting or rotating the torso, often to generate power or resist a rotational force (anti-rotation). This pattern develops a strong, integrated core and is crucial for transferring force in athletic movements.'
	},
	{
		name: 'Core (Anterior Flexion)',
		description:
			'An open-chain movement involving the contraction of the abdominals and hip flexors to bring the legs and torso closer together. Distinct from the hinge, this pattern is foundational for the high-skill gymnastics common in CrossFit.'
	},
	{
		name: 'Gait / Locomotion',
		description:
			'The pattern of transporting your entire body from one point to another. This category encompasses all forms of "travel" and is essential for building work capacity, cardiovascular endurance, and integrating all other strength patterns into dynamic action.'
	}
];
