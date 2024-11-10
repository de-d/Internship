import { useEffect, useState } from "react";
import styles from "./Header.module.scss";

interface MenuItem {
  label: string;
  url: string;
}

interface MenuData {
  logo: string;
  header: MenuItem[];
}

export function Header() {
  const [data, setData] = useState<MenuData | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/menu")
      .then((response) => response.json())
      .then(setData)
      .catch((error) => console.error("Ошибка при загрузке данных:", error));
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.header__logo}>
        <img className={styles.header__logo_img} src={data?.logo} alt="Логотип" />
      </div>
      <nav className={styles.header__nav}>
        {data?.header.map((item) => (
          <a href={item.url} key={item.label} className={styles.header__nav_item}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className={styles.header__right_menu}>
        <div className={styles.header__search}>
          <button className={styles.header__search_icon}>
            <img className={styles.header__search_img} src="img/header/search-icon.svg" alt="Поиск" />
          </button>
        </div>
        <div className={styles.header__link}>
          <p className={styles.header__link_text}>EBAC</p>
          <img className={styles.header__link_img} src="img/header/link.svg" alt="Ссылка" />
        </div>
      </div>
    </header>
  );
}
