import DashboardDemo from "@/components/landingpage/demo";
import FeaturesSection from "@/components/landingpage/features";
import Hero from "@/components/landingpage/hero";
import HowWeWork from "@/components/landingpage/howWeWork";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar/navbar";


export default function Home() {
  return (
    <>
      <Navbar/>
      <Hero/>
      <FeaturesSection/>
      <HowWeWork/>
      <DashboardDemo/>
      <Footer/>
    </>
  );
}