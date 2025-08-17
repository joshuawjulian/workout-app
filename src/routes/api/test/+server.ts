//simple test route to ensure db connection is up and running
import { sql } from "$lib/server/db/conn";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {

  try {
    await sql`Select 1`;
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