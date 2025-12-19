
import { AddProductForm } from "@/components/AddProductForm";
import { Cards } from "@/components/Cards";
import Hero from "@/components/Hero";
import { NavBar } from "@/components/NavBar";
import { NoProducts } from "@/components/NoProducts";
import { SignInDialog } from "@/components/SignInDialog";
import TogleProvider from "@/context/togleContext";

export default function Home() {
  return (
    <TogleProvider>
      <NavBar/>
      <Hero/>
      <AddProductForm/>
      <Cards/>
      <SignInDialog />
      <NoProducts/>
    </TogleProvider>
  );
}
