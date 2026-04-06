"use client";

import type { Heist } from "@/lib/types";
import CountdownTimer from "@/components/CountdownTimer/CountdownTimer";
import styles from "./HeistCard.module.css";

interface Props {
  heist: Heist;
}

export default function HeistCard({ heist }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{heist.title}</h3>
        <CountdownTimer expiresAt={heist.expiresAt} />
      </div>
      {heist.description && (
        <p className={styles.description}>{heist.description}</p>
      )}
    </div>
  );
}
