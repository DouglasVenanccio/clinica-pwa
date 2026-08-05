import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ScrollProgress from "@/components/layout/scroll-progress";
import Hero from "@/components/site/hero";
import Services from "@/components/site/services";
import Team from "@/components/site/team";
import BeforeAfter from "@/components/site/before-after";
import Reviews from "@/components/site/reviews";
import GiftCard from "@/components/site/gift-card";
import Loyalty from "@/components/site/loyalty";

export default function Home() {
  return (
    <div className="min-h-screen bg-creme flex flex-col">
      <ScrollProgress />
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <Team />
        <BeforeAfter />
        <Reviews />
        <GiftCard />
        <Loyalty />
      </main>
      <Footer />
    </div>
  );
}