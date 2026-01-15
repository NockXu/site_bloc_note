// Fonction pour hasher un mot de passe (côté client pour comparaison)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Fonction pour comparer le mot de passe avec le hash stocké
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  const inputHash = await hashPassword(password);
  return inputHash === hashedPassword;
}
