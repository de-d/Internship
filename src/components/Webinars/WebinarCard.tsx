import { ProposalItem } from "./types";
import style from "./Webinars.module.scss";
import ImageWithMask from "../ImageWithMask/ImageWithMask";

export default function WebinarCard({ item }: { item: ProposalItem }) {
  return (
    <div className={style.webinars_section__card}>
      <div className={style.webinars_section__card_header}>
        <ImageWithMask imgSrc={item.author.img} maskShape="scalloped-frame" />
        <div className={style.webinars_section__card_author}>
          <p className={style.webinars_section__card_name}>{item.author.name}</p>
          <p className={style.webinars_section__card_position}>{item.author.position}</p>
        </div>
      </div>
      <div className={style.webinars_section__card_info}>
        <p className={style.webinars_section__card_text}>{item.text}</p>
      </div>
      <div className={style.webinars_section__card_footer}>
        <div className={style.webinars_section__card_footer_tags}>
          {item.tags.map((tag, index) => (
            <p key={index} className={style.webinars_section__card_footer_tag}>
              {tag}
            </p>
          ))}
        </div>
        <div className={style.webinars_section__card_footer_date_and_time}>
          <div className={style.webinars_section__card_footer_date}>
            <p className={style.webinars_section__card_footer_date_text}>
              {item.date_from}, {item.date_to} de 2022
            </p>
          </div>
          <div className={style.webinars_section__card_footer_time}>
            <p className={style.webinars_section__card_footer_time_text}>{item.time}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
