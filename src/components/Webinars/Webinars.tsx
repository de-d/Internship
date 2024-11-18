import useFetch from "../../hooks/useFetch";
import { Proposals } from "./types";
import style from "./Webinars.module.scss";
import WebinarCard from "./WebinarCard";
import Ticker from "../Ticker/Ticker";

export default function Webinars() {
  const { data: webinarsData } = useFetch<Proposals>("http://localhost:3001/sections");

  return (
    <>
      <section className={style.webinars_section}>
        <div className={style.webinars_section__container}>
          <h5 className={style.webinars_section__title}>{webinarsData?.proposals.title}</h5>
          <div className={style.webinars_section__cards}>
            {webinarsData?.proposals.items.map((item) => (
              <WebinarCard key={item.text} item={item} />
            ))}
          </div>
          <div className={style.webinars_section__button}>
            <button className={style.webinars_section__button_btn}>{webinarsData?.proposals["browse-all-text"]}</button>
          </div>
        </div>
      </section>
      <div className={style.ticker}>
        <Ticker text={webinarsData?.proposals.ticker.text} color={webinarsData?.proposals.ticker.color} />
      </div>
    </>
  );
}
