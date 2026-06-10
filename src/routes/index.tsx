import { createFileRoute } from "@tanstack/react-router";
import { NavBar } from "@/components/shutty/NavBar";
import { Hero } from "@/components/shutty/Hero";
import { DataWall } from "@/components/shutty/DataWall";
import { Tribes } from "@/components/shutty/Tribes";
import { Testimonials } from "@/components/shutty/Testimonials";
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
        <DataWall />
        <Tribes />
        <Testimonials />
        <Footer />
      </main>
    </div>
  );
}
