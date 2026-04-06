"use client";

import { use } from "react";
import { useHeist } from "@/hooks/useHeist";
import CountdownTimer from "@/components/CountdownTimer";
import SkeletonCard from "@/components/Skeleton/SkeletonCard";

interface Props {
  params: Promise<{ id: string }>;
}

export default function HeistDetailPage({ params }: Props) {
  const { id } = use(params);
  const { heist, loading, error } = useHeist(id);

  if (loading) {
    return (
      <div className="page-content">
        <SkeletonCard />
      </div>
    );
  }

  if (error || !heist) {
    return (
      <div className="page-content">
        <p>{error ?? "Heist not found."}</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h2>{heist.title}</h2>
      <CountdownTimer expiresAt={heist.expiresAt} />
      {heist.description && <p>{heist.description}</p>}
    </div>
  );
}
