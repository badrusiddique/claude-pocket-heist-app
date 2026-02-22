// this page should be used only as a splash page to decide where a user should be navigated to
// when logged in --> to /heists
// when not logged in --> to /login

import { Clock8 } from "lucide-react"

export default function Home() {
  return (
    <div className="center-content">
      <div className="page-content">
        <h1>
          P<Clock8 className="logo" strokeWidth={2.75} />cket Heist
        </h1>
        <div>Tiny missions. Big office mischief.</div>

        <div className="mt-8 space-y-4">
          <p>
            Welcome to Pocket Heist, where everyday office life becomes an adventure!
            Create playful missions for your colleagues, track your daring escapades,
            and see who can pull off the most creative office shenanigans.
          </p>

          <p>
            From "steal" someone's lunch (and replace it with something better) to
            leaving mysterious sticky notes around the office, Pocket Heist turns
            mundane workdays into opportunities for harmless fun and team bonding.
          </p>

          <p>
            Ready to become a master of office mischief? Sign up now and start
            planning your first heist!
          </p>
        </div>
      </div>
    </div>
  )
}
