import Hero from '@/components/site/Hero';
import Services from '@/components/site/Services';
import Team from '@/components/site/Team';
import BeforeAfter from '@/components/site/BeforeAfter';
import Reviews from '@/components/site/Reviews';
import GiftCard from '@/components/site/GiftCard';
import Loyalty from '@/components/site/Loyalty';

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Team />
      <BeforeAfter />
      <Reviews />
      <GiftCard />
      <Loyalty />
    </>
  );
}