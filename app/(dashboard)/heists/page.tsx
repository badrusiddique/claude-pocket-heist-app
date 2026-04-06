"use client";

import { useHeists } from "@/hooks/useHeists";
import HeistCard from "@/components/HeistCard";
import SkeletonCard from "@/components/Skeleton/SkeletonCard";

export default function HeistsPage() {
  const { heists, loading, error } = useHeists();

  if (loading) {
    return (
      <div className="page-content">
        <h2>Your Active Heists</h2>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <p>{error}</p>
      </div>
    );
  }

  const now = new Date();
  const active = heists.filter((h) => h.expiresAt > now);
  const expired = heists.filter((h) => h.expiresAt <= now);

  return (
    <div className="page-content">
      <section>
        <h2>Your Active Heists</h2>
        {active.length === 0 ? (
          <p>
            No active heists. <a href="/heists/create">Create one →</a>
          </p>
        ) : (
          active.map((h) => <HeistCard key={h.id} heist={h} />)
        )}
      </section>

      <section>
        <h2>Heists You&apos;ve Assigned</h2>
        <p>Assignment tracking coming soon.</p>
      </section>

      <section>
        <h2>All Expired Heists</h2>
        {expired.length === 0 ? (
          <p>No expired heists yet.</p>
        ) : (
          expired.map((h) => <HeistCard key={h.id} heist={h} />)
        )}
      </section>
    </div>
  );
}
