import Hero from "@/components/Hero";
import ChatInterface from "@/components/ChatInterface";
import ComingSoon from "@/components/ComingSoon";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <ChatInterface />
      <ComingSoon />
      <Footer />
    </main>
  );
}
