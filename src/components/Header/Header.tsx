import styles from "./Header.module.scss";
import useFetch from "../../hooks/useFetch";

interface MenuItem {
  label: string;
  url: string;
}

interface MenuData {
  logo: string;
  header: MenuItem[];
}

export function Header() {
  const { data: headerData } = useFetch<MenuData>("http://localhost:3001/menu");

  return (
    <header className={styles.header}>
      <div className={styles.header__logo}>
        <img className={styles.header__logo_img} src={headerData?.logo} alt="Логотип" />
      </div>
      <nav className={styles.header__nav}>
        {headerData?.header.map((item) => (
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
