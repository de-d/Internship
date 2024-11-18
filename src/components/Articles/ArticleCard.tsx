import { ArticleItem } from "./types";
import style from "./Articles.module.scss";
import ImageWithMask from "../ImageWithMask/ImageWithMask";

export default function ArticleCard({ item }: { item: ArticleItem }) {
  return (
    <article className={style.articles_section__article}>
      <div className={style.articles_section__img}>
        <ImageWithMask imgSrc={item.img.url} maskShape={item.img.shape} />
        <div className={style.articles_section__img_sticker}></div>
      </div>
      <div className={style.articles_section__info}>
        <div className={style.articles_section__tags}>
          {item.tags.map((tag, index) => (
            <p key={index} className={style.articles_section__tag}>
              {tag}
            </p>
          ))}
        </div>
        <div className={style.articles_section__title}>{item.title}</div>
        <div className={style.articles_section__text}>{item.text}</div>
        <div className={style.articles_section__date_time}>
          <div className={style.articles_section__date}>
            <p className={style.articles_section__date_text}>2 de junio de 2022</p>
          </div>
          <div className={style.articles_section__time}>
            <p className={style.articles_section__time_text}>{item.duration} min</p>
          </div>
        </div>
      </div>
    </article>
  );
}
