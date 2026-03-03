"use client";

import { useState } from "react";
import { Clock8 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useUser } from "@/context/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.siteNav}>
      <nav>
        <header>
          <h1>
            <Link href="/heists">
              P<Clock8 className={styles.logo} size={14} strokeWidth={2.75} />
              cket Heist
            </Link>
          </h1>
          <div>Tiny missions. Big office mischief.</div>
        </header>
        <ul>
          <li>
            <Link href="/heists/create" className="btn">
              Create Heist
            </Link>
          </li>
          {user && (
            <li>
              <button className="btn" onClick={handleLogout} disabled={loading}>
                {loading ? "Logging out..." : "Logout"}
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
