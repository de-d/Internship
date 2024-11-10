import { useEffect, useState } from "react";
import style from "./Gaming.module.scss";
import { Sections } from "./types";
import Ticker from "../Ticker/Ticker";

export default function GamingSection() {
  const [data, setData] = useState<Sections | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/sections")
      .then((response) => response.json())
      .then(setData)
      .catch((error) => console.error("Ошибка при загрузке данных:", error));
  }, []);

  const dataItem = data?.main.items[0];
  const allTags = data?.main.items.flatMap((item) => item.tags) || [];

  return (
    <>
      <section className={style.gaming_section}>
        <div className={style.gaming_section__content}>
          <div className={style.gaming_section__img}>
            <img className={style.gaming_section__img_img} src={dataItem?.img.url} alt="Изображение" />
            <img className={style.gaming_section__img_sticker} src="img/gaming/gaming-sticker.svg" alt="Изображение" />
          </div>
          <div className={style.gaming_section__container}>
            <div className={style.gaming_section__info}>
              <div className={style.gaming_section__info_tags}>
                {allTags.map((tag) => (
                  <p className={style.gaming_section__info_tag} key={tag}>
                    {tag}
                  </p>
                ))}
              </div>
              <div className={style.gaming_section__info_title}>{dataItem?.title}</div>
              <div className={style.gaming_section__info_text}>{dataItem?.text}</div>
              <div className={style.gaming_section__info_dateandtime}>
                <div className={style.gaming_section__info_date}>
                  <p className={style.gaming_section__info_date_text}>2 de junio de 2022</p>
                </div>
                <div className={style.gaming_section__info_time}>
                  <p className={style.gaming_section__info_time_text}>{dataItem?.duration} min</p>
                </div>
              </div>
            </div>
            <div className={style.gaming_section__button}>
              <button className={style.gaming_section__button_btn}>{dataItem?.["browse-text"]}</button>
            </div>
          </div>
        </div>
      </section>
      <Ticker text={data?.main.ticker.text} color={data?.main.ticker.color} />
    </>
  );
}
