import { db } from '../conn';
import * as userQueries from '../queries/users';

// Re-export user queries for convenience
export const getUserById = userQueries.getUserById;
export const getUserByEmail = userQueries.getUserByEmail;
export const getAllUsers = userQueries.getAllUsers;
export const insertUser = userQueries.insertUser;

export const getAllUsersWithRoles = async () => {
	return await db.query.usersTable.findMany({
		with: {
			userWebsiteRole: true
		}
	});
};
