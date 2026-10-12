import { createFileRoute } from "@tanstack/react-router";
import { NavBar } from "@/components/shutty/NavBar";
import { Hero } from "@/components/shutty/Hero";
import { Marquee } from "@/components/shutty/Marquee";
import { HowItWorks } from "@/components/shutty/HowItWorks";
import { DataWall } from "@/components/shutty/DataWall";
import { Tribes } from "@/components/shutty/Tribes";
import { ShareProgress } from "@/components/shutty/ShareProgress";
import { Testimonials } from "@/components/shutty/Testimonials";
import { Waitlist } from "@/components/shutty/Waitlist";
import { Footer } from "@/components/shutty/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SHUTTY — Turn focus into a multiplayer sport" },
      {
        name: "description",
        content:
          "SHUTTY turns deep focus into a social game. Start a session, build your streak, and stay locked in with your tribe. Stop doomscrolling, build something.",
      },
      { property: "og:title", content: "SHUTTY — Turn focus into a multiplayer sport" },
      {
        property: "og:description",
        content:
          "Join the focus race. Track live sessions, build streaks, and keep your tribe locked in.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <main>
        <Hero />
        <Marquee />
        <HowItWorks />
        <DataWall />
        <Tribes />
        <ShareProgress />
        <Testimonials />
        <Waitlist />
        <Footer />
      </main>
    </div>
  );
}
