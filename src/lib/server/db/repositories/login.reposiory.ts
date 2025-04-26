export async function findUserByEmail(email: string) {
    return db.select().from(users).where(eq(users.email, email)).then(r => r[0]);
  }