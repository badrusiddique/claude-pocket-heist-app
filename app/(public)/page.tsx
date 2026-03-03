// this page should be used only as a splash page to decide where a user should be navigated to
// when logged in --> to /heists
// when not logged in --> to /login

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock8 } from "lucide-react";
import { useUser } from "@/context/AuthContext";

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/heists");
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="center-content">
      <div className="page-content">
        <h1>
          P<Clock8 className="logo" strokeWidth={2.75} />
          cket Heist
        </h1>
        <div>Your villain era, no cap.</div>

        <div className="mt-8 space-y-4">
          <p>
            Welcome to Pocket Heist, where everyday office life becomes an
            adventure! Create playful missions for your colleagues, track your
            daring escapades, and see who can pull off the most creative office
            shenanigans.
          </p>

          <p>
            From "steal" someone's lunch (and replace it with something better)
            to leaving mysterious sticky notes around the office, Pocket Heist
            turns mundane workdays into opportunities for harmless fun and team
            bonding.
          </p>

          <p>
            Ready to become a master of office mischief? Sign up now and start
            planning your first heist!
          </p>
        </div>
      </div>
    </div>
  );
}
