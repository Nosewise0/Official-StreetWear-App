import Image from "next/image";
import Hero from "./home/page";
import About from "./about/page";
import Products from "./products/page";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Products />
    </>
  );
}
