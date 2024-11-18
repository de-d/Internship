import style from "./Ticker.module.scss";

interface TickerProps {
  text: string | undefined;
  color: string | undefined;
  isWhite?: boolean;
}

export default function Ticker({ text, color, isWhite = false }: TickerProps) {
  return (
    <div className={style.ticker} style={{ backgroundColor: color, color: isWhite ? "white" : "black" }}>
      <div className={style.ticker__content}>
        {[...Array(7)].map((_, index) => (
          <h2 key={index} className={style.ticker__text}>
            <img className={style.ticker__img} style={{ filter: isWhite ? "invert(100%)" : "none" }} src="img/running-line-Icon.svg" alt="tiker" />
            {text}
          </h2>
        ))}
      </div>
    </div>
  );
}
