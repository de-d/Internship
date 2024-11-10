import style from "./Ticker.module.scss";

interface TickerProps {
  text: string | undefined;
  color: string | undefined;
}

export default function Ticker({ text, color }: TickerProps) {
  return (
    <div className={style.ticker} style={{ backgroundColor: color }}>
      <div className={style.ticker__content}>
        {[...Array(7)].map((_, index) => (
          <h2 key={index} className={style.ticker__text}>
            <img className={style.ticker__img} src="img/running-line-Icon.svg" alt="Изображение" />
            {text}
          </h2>
        ))}
      </div>
    </div>
  );
}
