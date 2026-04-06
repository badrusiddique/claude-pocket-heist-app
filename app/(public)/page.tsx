// this page should be used only as a splash page to decide where a user should be navigated to
// when logged in --> to /heists
// when not logged in --> to /login

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock8, Zap } from "lucide-react";
import { useUser } from "@/context/AuthContext";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace("/heists");
    } else {
      router.replace("/login");
    }
  }, [user, loading, router]);

  return (
    <div className={styles.container}>
      {/* Animated background elements */}
      <div className={styles.gridBackground}></div>
      <div className={styles.glowOrb1}></div>
      <div className={styles.glowOrb2}></div>

      <div className={styles.content}>
        {/* Hero logo section */}
        <div className={styles.heroHeader}>
          <div className={styles.logoWrapper}>
            <span className={styles.logoBracket}>[</span>
            <h1 className={styles.logo}>
              P<Clock8 className={styles.clockIcon} strokeWidth={2.5} />
              cket Heist
            </h1>
            <span className={styles.logoBracket}>]</span>
          </div>
          <p className={styles.tagline}>Your villain era, no cap.</p>
          <div className={styles.scanLine}></div>
        </div>

        {/* Value proposition */}
        <div className={styles.propositionSection}>
          <div className={styles.propositionCard}>
            <div className={styles.cardHeader}>
              <Zap className={styles.cardIcon} size={20} />
              <h2>Mission Control</h2>
            </div>
            <p>
              Create playful missions for your colleagues. From "borrowing"
              someone&apos;s lunch to leaving mysterious sticky notes—turn
              everyday office life into an adventure.
            </p>
          </div>

          <div className={styles.propositionCard}>
            <div className={styles.cardHeader}>
              <Zap className={styles.cardIcon} size={20} />
              <h2>Track Your Capers</h2>
            </div>
            <p>
              Monitor your daring escapades and see who can pull off the most
              creative office shenanigans. Harmless fun that builds real team
              bonding.
            </p>
          </div>

          <div className={styles.propositionCard}>
            <div className={styles.cardHeader}>
              <Zap className={styles.cardIcon} size={20} />
              <h2>Master the Game</h2>
            </div>
            <p>
              Become a master of office mischief. Plan heists, execute
              brilliantly, and prove you&apos;re the ultimate operator.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className={styles.ctaSection}>
          <p className={styles.ctaText}>Ready to go live?</p>
          <div className={styles.buttonGroup}>
            <Link href="/signup" className={styles.buttonPrimary}>
              <span>Enter the System</span>
            </Link>
            <Link href="/login" className={styles.buttonSecondary}>
              <span>Already Initiated</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
