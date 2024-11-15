import { useEffect, useState } from "react";
import { Proposals } from "./types";
import style from "./Webinars.module.scss";
import WebinarCard from "./WebinarCard";
import Ticker from "../Ticker/Ticker";

export default function Webinars() {
  const [proposals, setProposals] = useState<Proposals | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/sections/")
      .then((response) => response.json())
      .then(setProposals)
      .catch((error) => console.error("Ошибка при загрузке данных:", error));
  }, []);

  return (
    <>
      <section className={style.webinars_section}>
        <div className={style.webinars_section__container}>
          <h5 className={style.webinars_section__title}>{proposals?.proposals.title}</h5>
          <div className={style.webinars_section__cards}>
            {proposals?.proposals.items.map((item) => (
              <WebinarCard key={item.text} item={item} />
            ))}
          </div>
          <div className={style.webinars_section__button}>
            <button className={style.webinars_section__button_btn}>{proposals?.proposals["browse-all-text"]}</button>
          </div>
        </div>
      </section>
      <div className={style.ticker}>
        <Ticker text={proposals?.proposals.ticker.text} color={proposals?.proposals.ticker.color} />
      </div>
    </>
  );
}
