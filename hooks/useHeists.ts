import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Heist } from "@/lib/types";

interface UseHeistsResult {
  heists: Heist[];
  loading: boolean;
  error: string | null;
}

export function useHeists(): UseHeistsResult {
  const [heists, setHeists] = useState<Heist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHeists() {
      try {
        const snapshot = await getDocs(collection(db, "heists"));
        const data: Heist[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title as string,
          description: doc.data().description as string,
          createdBy: doc.data().createdBy as string,
          createdAt: doc.data().createdAt.toDate() as Date,
          expiresAt: doc.data().expiresAt.toDate() as Date,
        }));
        setHeists(data);
      } catch {
        setError("Failed to load heists");
      } finally {
        setLoading(false);
      }
    }
    fetchHeists();
  }, []);

  return { heists, loading, error };
}
