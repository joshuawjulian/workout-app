import { command, form, query } from '$app/server';
import { equipmentTable, equipmentUpsertSchema } from '$lib/schema/dict.schema';
import { db } from '$lib/server/db/conn';
import { error } from 'console';
import { eq } from 'drizzle-orm';
import z from 'zod';

export const allEquipment = query(async () => {
	console.log('Fetching all equipment at time ', new Date().toISOString());
	return await db.select().from(equipmentTable);
});

export const deleteEquipment = command(z.uuid(), async (id: string) => {
	const deletedItem = await db.delete(equipmentTable).where(eq(equipmentTable.id, id));
	await allEquipment().refresh();
	return deletedItem;
});

export const addRandomEquipment = command(async () => {
	const randomName = `Equipment ${Math.floor(Math.random() * 1000)}`;
	const insertedItem = await db.insert(equipmentTable).values({ name: randomName }).returning();
	await allEquipment().refresh();
	return insertedItem;
});

export const upsertEquipment = form(async (data) => {
	const result = equipmentUpsertSchema.safeParse({ id: data.get('id'), name: data.get('name') });
	if (!result.success) return error(500, result.error);

	const { id, name } = result.data;

	let insertedEquipment;

	console.log('Upsert Equipment called with:', { id, name });

	if (typeof id == 'string') {
		insertedEquipment = await db
			.update(equipmentTable)
			.set({ name })
			.where(eq(equipmentTable.id, id))
			.returning();
	} else {
		insertedEquipment = await db.insert(equipmentTable).values({ name }).returning();
	}

	console.log('Inserted/Updated Equipment:', insertedEquipment);

	return insertedEquipment;
});
