import { findUserByEmail } from './userRepository';

export async function validateUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  // Aquí puedes añadir más lógica si hace falta
  return user;
}