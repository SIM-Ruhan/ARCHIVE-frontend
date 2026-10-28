export const dynamic = "force-dynamic";

import HeroBanner from "./components/Banner";
import CategoryShowcase from "./components/CategoryShowcase";
import FeaturedListingsPage from "./featuredPage/page";
import SellCtaCard from "./components/SellCtaCard";

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <CategoryShowcase />
      <FeaturedListingsPage />
      <SellCtaCard />
    </div>
  );
}
