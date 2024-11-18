import useFetch from "../../hooks/useFetch";
import ArticleCard from "./ArticleCard";
import Ticker from "../Ticker/Ticker";
import { Content } from "./types";
import style from "./Articles.module.scss";

export default function Articles() {
  const { data: articleData } = useFetch<Content>("http://localhost:3001/sections");

  return (
    <>
      <section className={style.articles_section}>
        <div className={style.articles_section__container}>
          <div className={style.articles_section__articles}>
            {articleData?.content.items.map((item) => (
              <ArticleCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>
      <div className={style.ticker}>
        <Ticker text={articleData?.content.ticker.text} color={articleData?.content.ticker.color} />
      </div>
    </>
  );
}
