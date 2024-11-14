import { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";
import Ticker from "../Ticker/Ticker";
import { Content } from "./types";
import style from "./Articles.module.scss";

export default function Articles() {
  const [content, setContent] = useState<Content | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/sections")
      .then((response) => response.json())
      .then(setContent)
      .catch((error) => console.error("Ошибка при загрузке данных:", error));
  }, []);

  return (
    <>
      <section className={style.articles_section}>
        <div className={style.articles_section__container}>
          <div className={style.articles_section__articles}>
            {content?.content.items.map((item) => (
              <ArticleCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>
      <Ticker text={content?.content.ticker.text} color={content?.content.ticker.color} />
    </>
  );
}
