import * as userQueries from '../queries/users';

// Re-export user queries for convenience
export const getUserById = userQueries.getUserById;
export const getUserByEmail = userQueries.getUserByEmail;
export const getAllUsers = userQueries.getAllUsers;
export const insertUser = userQueries.insertUser;