export interface UserMetadata {
  cpf: string;
  cellphone: string;
}

export function getUserMetadata(userId: string): UserMetadata {
  if (!userId) {
    return {
      cpf: "999.999.999-99",
      cellphone: "(99) 99999-9999",
    };
  }

  const stored = localStorage.getItem(`rfid-user-meta-${userId}`);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        cpf: parsed.cpf || "999.999.999-99",
        cellphone: parsed.cellphone || "(99) 99999-9999",
      };
    } catch {
      // ignore
    }
  }

  return {
    cpf: "999.999.999-99",
    cellphone: "(99) 99999-9999",
  };
}

export function saveUserMetadata(
  userId: string,
  metadata: Partial<UserMetadata>,
): void {
  if (!userId) return;

  const current = getUserMetadata(userId);
  const updated = {
    ...current,
    ...metadata,
  };

  localStorage.setItem(`rfid-user-meta-${userId}`, JSON.stringify(updated));
}
