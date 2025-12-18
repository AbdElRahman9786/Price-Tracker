import { AddProductForm } from "@/components/AddProductForm";
import { Cards } from "@/components/Cards";
import Hero from "@/components/Hero";
import { NavBar } from "@/components/NavBar";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <NavBar/>
    <Hero/>
    <AddProductForm/>
    <Cards/>
    </>
  );
}
