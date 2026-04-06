import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Heist } from "@/lib/types";

interface UseHeistResult {
  heist: Heist | null;
  loading: boolean;
  error: string | null;
}

export function useHeist(id: string): UseHeistResult {
  const [heist, setHeist] = useState<Heist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHeist() {
      try {
        const snap = await getDoc(doc(db, "heists", id));
        if (snap.exists()) {
          setHeist({
            id: snap.id,
            title: snap.data().title as string,
            description: snap.data().description as string,
            createdBy: snap.data().createdBy as string,
            createdAt: snap.data().createdAt.toDate() as Date,
            expiresAt: snap.data().expiresAt.toDate() as Date,
          });
        } else {
          setError("Heist not found");
        }
      } catch {
        setError("Failed to load heist");
      } finally {
        setLoading(false);
      }
    }
    fetchHeist();
  }, [id]);

  return { heist, loading, error };
}
