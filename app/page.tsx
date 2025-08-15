import SimpleNavigation from "@/components/ui/SimpleNavigation";
import SimpleFooter from "@/components/ui/SimpleFooter";
import SimpleHero from "@/components/ui/SimpleHero";
import Chatbot from "@/components/ui/Chatbot";

export const metadata = {
  title: "John Schibelli - Senior Front-End Developer",
  description: "Senior Front-End Developer specializing in React, Next.js, TypeScript, and AI-driven development. Building the future, one line of code at a time.",
};

export default function HomePage() {
  return (
    <>
      <SimpleNavigation />
      <main>
        <SimpleHero />
      </main>
      <SimpleFooter />
      <Chatbot />
    </>
  );
}

