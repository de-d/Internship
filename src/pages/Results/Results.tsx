import { useNavigate } from "react-router-dom";
import ResultsTable from "./Table";
import style from "./Results.module.scss";

export default function Results() {
  const navigate = useNavigate();

  return (
    <div className={style.results}>
      <div className={style.results__container}>
        <div className={style.results__route}>
          <button className={style.results__route__button} onClick={() => navigate("/")}>
            Игровое поле
          </button>
          <button className={style.results__route__button} onClick={() => navigate("/settings")}>
            Настройки
          </button>
        </div>
        <div className={style.results__content}>
          <div className={style.results__header}>
            <h1>Результаты игр</h1>
          </div>
          <ResultsTable />
        </div>
      </div>
    </div>
  );
}
