//simple test route to ensure db connection is up and running
import { db } from "$lib/server/db/conn";
import { sql } from "drizzle-orm";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {

  try {
    await db.execute(sql`SELECT 1`);
  } catch (error) {
    return json({
      success: false,
      message: error
    })
  }

	return json({
    success:true
  })
}