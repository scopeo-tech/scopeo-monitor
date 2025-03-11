import Features from "@/components/landingpage/features";
import Hero from "@/components/landingpage/hero";
import HowWeWork from "@/components/landingpage/howWeWork";
import Navbar from "@/components/layout/navbar/navbar";


export default function Home() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <Features/>
      <HowWeWork/>
    </div>
  );
}