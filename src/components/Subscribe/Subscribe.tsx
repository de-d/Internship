import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { Subscription } from "./types";
import Ticker from "../Ticker/Ticker";
import style from "./Subscribe.module.scss";

export default function Subscribe() {
  const { data: subscribeData } = useFetch<Subscription>("http://localhost:3001/sections");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheckboxChecked(e.target.checked);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <>
      <section className={style.subscribe_section}>
        <div className={style.subscribe_section__container}>
          <div className={style.subscribe_section__content}>
            <h2 className={style.subscribe_section__title}>{subscribeData?.subscription.title}</h2>
            <p className={style.subscribe_section__description}>{subscribeData?.subscription.text}</p>
          </div>
          {!isSubmitted ? (
            <div id="form" className={style.subscribe_section__form}>
              <form className={style.subscribe_section__form_container} onSubmit={handleSubmit} noValidate>
                <div className={style.subscribe_section__form_input_container}>
                  <input
                    className={`${style.subscribe_section__input} ${!isEmailValid && email ? style.invalid : ""} ${
                      isEmailValid && email ? style.valid : ""
                    }`}
                    type="email"
                    required
                    placeholder={subscribeData?.subscription["email-placeholder"]}
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleBlur}
                  />
                  {!isEmailValid && email && <p className={style.subscribe_section__form_error}>Formato de email inválido, verifique a ortografia</p>}
                </div>
                <button type="submit" id="submitBtn" className={style.subscribe_section__button} disabled={!isEmailValid || !isCheckboxChecked}>
                  {subscribeData?.subscription["submit-text"]}
                </button>
              </form>
              <div className={style.subscribe_section__form_checkbox_container}>
                <input className={style.subscribe_section__form_checkbox} type="checkbox" onChange={handleCheckboxChange} disabled={!isEmailValid} />
                <label className={style.subscribe_section__form_label}>{subscribeData?.subscription["agreement-text"]}</label>
              </div>
            </div>
          ) : (
            <div id="success" className={style.subscribe_section__success}>
              <p className={style.subscribe_section__success_text}>Fantástico! Espera La primera carta</p>
            </div>
          )}
        </div>
        <div className={style.subscribe_section__img}></div>
      </section>
      <div className={style.ticker}>
        <Ticker text={subscribeData?.subscription.ticker.text} color={subscribeData?.subscription.ticker.color} isWhite={true} />
      </div>
    </>
  );
}
