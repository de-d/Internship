import { Header } from "./components/Header/Header";
import GamingSection from "./components/Gaming/Gaming";
import Articles from "./components/Articles/Articles";
import Webinars from "./components/Webinars/Webinars";
import Subscribe from "./components/Subscribe/Subscribe";

export function App() {
  return (
    <>
      <Header />
      <GamingSection />
      <Articles />
      <Webinars />
      <Subscribe />
    </>
  );
}
