import { useState } from "react";
import { FooterData, Contacts } from "./types";
import useFetch from "../../hooks/useFetch";
import style from "./Footer.module.scss";

export default function Footer() {
  const { data: footerData } = useFetch<FooterData>("http://localhost:3001/menu");
  const { data: contactsData } = useFetch<Contacts>("http://localhost:3001/contacts");
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);

  const validateEmail = (value: string) => {
    const emailPattern = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return emailPattern.test(value);
  };

  const handleBlur = () => {
    if (email.trim() === "") {
      setIsEmailValid(false);
    } else {
      setIsEmailValid(validateEmail(email));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(validateEmail(value));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTimeout(() => {
      setEmail("");
    }, 2000);
  };

  return (
    <footer className={style.footer}>
      <div className={style.footer__container}>
        <div className={style.footer__header}>
          <div className={style.footer__logo}>
            <img className={style.footer__logo_img} src="img/footer/logo.svg" alt="Изображение" />
            <img className={style.footer__logo_holon} src="img/footer/holon.jpg" alt="Изображение" />
          </div>
        </div>
        <div className={style.footer__social}>
          <img className={style.footer__social_img} src="img/footer/inst-icon.svg" alt="Instagram" />
          <img className={style.footer__social_img} src="img/footer/fbook-icon.svg" alt="Facebook" />
          <img className={style.footer__social_img} src="img/footer/yt-icon.svg" alt="YouTube" />
          <img className={style.footer__social_img} src="img/footer/lin-icon.svg" alt="LinkedIn" />
        </div>
        <div className={style.footer__menu}>
          {footerData?.footer.map((section) => (
            <div key={section.label} className={style.footer__menu_container}>
              <input className={style.footer__menu_checkbox} type="checkbox" id={section.label} />
              <label className={style.footer__menu_title} htmlFor={section.label}>
                <span className={style.footer__menu_title_span}>{section.label}</span>
                <img className={style.footer__menu_open} src="img/footer/open-icon.svg" alt="Open" />
                <img className={style.footer__menu_close} src="img/footer/close-icon.svg" alt="Close" />
              </label>
              <ul className={style.footer__menu_list}>
                {section.items.map((item) => (
                  <li key={item.label}>
                    <a href={item.url} className={style.footer__menu_item}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={style.footer__contact}>
          <div className={style.footer__contact_container}>
            <p className={style.footer__contact_title}>WhatsApp</p>
            <p className={style.footer__contact_text}>+{contactsData?.whatsapp}</p>
          </div>
          <div className={style.footer__contact_container}>
            <p className={style.footer__contact_title}>Telefone</p>
            <p className={style.footer__contact_text}>+{contactsData?.phone}</p>
          </div>
          <div className={style.footer__contact_container}>
            <p className={style.footer__contact_title}>Email</p>
            <p className={style.footer__contact_text}>{contactsData?.email}</p>
          </div>
        </div>
        <form className={style.footer__form} onSubmit={handleSubmit} noValidate>
          <input
            className={`${style.footer__form_input} ${!isEmailValid && email ? style.invalid : ""} ${isEmailValid && email ? style.valid : ""}`}
            type="email"
            required
            placeholder={contactsData?.subscription["email-placeholder"]}
            value={email}
            onChange={handleEmailChange}
            onBlur={handleBlur}
          />
          <button className={style.footer__form_button} type="submit" disabled={!isEmailValid}>
            {contactsData?.subscription["submit-text"]}
          </button>
        </form>
        <div className={style.footer__privacy}>
          {contactsData?.links.map((item) => (
            <a key={item.label} className={style.footer__privacy_link} href={item.url}>
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
