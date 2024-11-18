import { Header } from "./components/Header/Header";
import GamingSection from "./components/Gaming/Gaming";
import Articles from "./components/Articles/Articles";
import Webinars from "./components/Webinars/Webinars";
import Subscribe from "./components/Subscribe/Subscribe";
import Footer from "./components/Footer/Footer";
import style from "./App.module.scss";

export function App() {
  return (
    <div className={style.app}>
      <Header />
      <GamingSection />
      <Articles />
      <Webinars />
      <Subscribe />
      <Footer />
    </div>
  );
}
