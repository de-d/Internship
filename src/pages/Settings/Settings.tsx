import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import style from "./Settings.module.scss";

export default function Settings() {
  const navigate = useNavigate();
  const appContext = useContext(AppContext);

  const { nickname, gridSize, cardSets, sampleOrUpload, setSampleOrUpload } = appContext!;

  const [isEditing, setIsEditing] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [error, setError] = useState<string[]>([]);

  const getImageLimit = (gridSize: number) => {
    switch (gridSize) {
      case 4:
        return 8;
      case 6:
        return 18;
      case 8:
        return 42;
      default:
        return 0;
    }
  };

  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem("userImages") || "[]");
    setUploadedImages(storedImages);
    handleThemeChange(appContext?.theme || "Light");
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleNameSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    appContext?.setNickname(e.target.value);
  };

  const handleLevelClick = (selectedLevel: string) => {
    const defaultConfig = { time: 60, errorLimit: 3, gridSize: 4 };
    const levelConfig: Record<string, typeof defaultConfig> = {
      Easy: { time: 240, errorLimit: 10, gridSize: 4 },
      Medium: { time: 180, errorLimit: 7, gridSize: 4 },
      Hard: { time: 120, errorLimit: 5, gridSize: 6 },
      "No Way": { time: 60, errorLimit: 3, gridSize: 8 },
      Custom: defaultConfig,
    };

    const config = levelConfig[selectedLevel] ?? defaultConfig;

    appContext?.setLevel(selectedLevel);
    appContext?.setTime(config.time);
    appContext?.setErrorLimit(config.errorLimit);
    appContext?.setGridSize(config.gridSize);
  };

  const handleGridSizeChange = (selectedSize: number) => {
    appContext?.setGridSize(selectedSize);
  };

  const handleTimeChange = (selectedTime: number) => {
    appContext?.setTime(selectedTime);
  };

  const handleErrorsChange = (selectedErrors: number) => {
    appContext?.setErrorLimit(selectedErrors);
  };

  const updateError = (newError: string) => {
    setError((prevErrors) => {
      if (!prevErrors.includes(newError)) {
        return [...prevErrors, newError];
      }
      return prevErrors;
    });
  };

  const handleSampleOrUploadClick = (s: string) => {
    if (sampleOrUpload === s) {
      setSampleOrUpload("none");
    } else {
      setSampleOrUpload(s);
    }
  };

  const handleSampleClick = (selectedCardSets: string) => {
    appContext?.setCardSets(selectedCardSets);
    const localStorageKey = `cards_${cardSets}`;

    localStorage.removeItem(localStorageKey); //удаляю что бы не засорять локальное хранилище, набор создается при переходе на игровое поле, с правильным названием набора
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError([]);
    const files = e.target.files;

    if (files) {
      const selectedFiles = Array.from(files);
      const availableSlots = getImageLimit(gridSize) - uploadedImages.length;

      const filesToUpload = selectedFiles.slice(0, availableSlots);

      if (filesToUpload.length < selectedFiles.length) {
        updateError(`Превышение лимита: загружено только ${filesToUpload.length} из ${selectedFiles.length} изображений`);
      }

      const resizedImages = await Promise.all(filesToUpload.map((file) => compressAndConvertToBase64(file)));

      setUploadedImages((prevImages) => [...prevImages, ...resizedImages]);
    }
  };

  const compressAndConvertToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = () => {
        img.src = reader.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          return reject(new Error("Canvas context not available"));
        }

        const maxWidth = 300;
        const maxHeight = 300;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height *= maxWidth / width;
            width = maxWidth;
          } else {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(img, 0, 0, width, height);

        const base64Image = canvas.toDataURL("image/jpeg", 0.92);
        resolve(base64Image);
      };

      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageSet = () => {
    const imageLimit = getImageLimit(appContext?.gridSize || 3);
    const currentImageCount = uploadedImages.length;

    if (currentImageCount < imageLimit) {
      updateError(`Недостаточно изображений. Нужно еще ${imageLimit - currentImageCount}`);
    }

    const existingImages = JSON.parse(localStorage.getItem("userImages") || "[]");

    const newImages = uploadedImages.filter((img) => !existingImages.includes(img));

    if (newImages.length === 0) {
      updateError(`Новых изображений нет, все уже добавлены`);
    }

    const allImages = [...existingImages, ...newImages];
    localStorage.setItem("userImages", JSON.stringify(allImages));
  };

  const handleResetImages = () => {
    setUploadedImages([]);
    localStorage.removeItem("userImages");
    setError([]);
  };

  const handleDeleteImage = (image: string) => {
    const updatedImages = uploadedImages.filter((img) => img !== image);
    setUploadedImages(updatedImages);
    localStorage.setItem("userImages", JSON.stringify(updatedImages));
  };

  const handleThemeChange = (selectedTheme: string) => {
    appContext?.setTheme(selectedTheme);
  };

  return (
    <div className={style.settings}>
      <div className={style.settings__container}>
        <div className={style.settings__route}>
          <button className={style.settings__route__button} onClick={() => navigate("/")}>
            Игровое поле
          </button>
          <button className={style.settings__route__button} onClick={() => navigate("/results")}>
            Результаты
          </button>
        </div>
        <div className={style.settings__header}></div>
        <div className={style.settings__content}>
          <div className={style.settings__content__name}>
            <span className={style.settings__content__name__title}>Ваш ник:</span>
            {isEditing ? (
              <input
                type="text"
                className={style.settings__content__name__input}
                value={nickname}
                onChange={handleInputChange}
                onKeyDown={handleNameSubmit}
                autoFocus
                maxLength={10}
              />
            ) : (
              <>
                <span className={style.settings__content__name__span}>{nickname}</span>
                <button className={style.settings__content__name__button} onClick={handleEditClick}></button>
              </>
            )}
          </div>

          <div className={style.settings__content__level}>
            <span className={style.settings__content__level__title}>Сложность:</span>
            <div className={style.settings__content__level__buttons}>
              {["Easy", "Medium", "Hard", "No Way", "Custom"].map((l) => (
                <button
                  key={l}
                  className={`${style.settings__content__level__buttons__button} ${appContext?.level === l ? style.active : ""}`}
                  onClick={() => handleLevelClick(l)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className={style.settings__content__grid_size}>
            <span className={style.settings__content__grid_size__title}>Размер поля:</span>
            <div className={style.settings__content__grid_size__buttons}>
              {[4, 6, 8].map((s) => (
                <button
                  key={s}
                  className={`${style.settings__content__grid_size__buttons__button} ${appContext?.gridSize === s ? style.active : ""}`}
                  disabled={appContext?.level !== "Custom"}
                  onClick={() => handleGridSizeChange(s)}
                >
                  {s} x {s}
                </button>
              ))}
            </div>
          </div>

          <div className={style.settings__content__time}>
            <span className={style.settings__content__time__title}>Время (мин):</span>
            <div className={style.settings__content__time__buttons}>
              {[60, 120, 180, 240].map((t) => (
                <button
                  key={t}
                  className={`${style.settings__content__time__buttons__button} ${appContext?.time === t ? style.active : ""}`}
                  onClick={() => handleTimeChange(t)}
                  disabled={appContext?.level !== "Custom"}
                >
                  {t} сек
                </button>
              ))}
            </div>
          </div>

          <div className={style.settings__content__errors}>
            <span className={style.settings__content__errors__title}>Максимальное количество ошибок:</span>
            <div className={style.settings__content__errors__buttons}>
              {[3, 5, 7, 10].map((e) => (
                <button
                  key={e}
                  className={`${style.settings__content__errors__buttons__button} ${appContext?.errorLimit === e ? style.active : ""}`}
                  onClick={() => handleErrorsChange(e)}
                  disabled={appContext?.level !== "Custom"}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className={style.settings__content__sample_or_upload}>
            <span className={style.settings__content__sample_or_upload__title}>Выберите набор карт:</span>
            <div className={style.settings__content__sample_or_upload__buttons}>
              {["sample", "upload"].map((s) => (
                <button
                  key={s}
                  className={`${style.settings__content__sample_or_upload__buttons__button} ${s === sampleOrUpload ? style.active : ""}
                  ${appContext?.level !== "Custom" ? style.disabled : ""}
                  `}
                  onClick={() => handleSampleOrUploadClick(s)}
                >
                  {s === "sample" ? "Готовый" : "Кастомный"}
                </button>
              ))}
            </div>
          </div>

          {sampleOrUpload === "sample" && (
            <div className={style.settings__content__sample_img}>
              <span className={style.settings__content__sample_img__title}>Готовые наборы карт:</span>
              <div className={style.settings__content__sample_img__images}>
                {["notionists", "adventurer", "croodles", "icons", "personas", "lorelei"].map((s) => (
                  <button key={s} className={style.settings__content__sample_img__images__button} onClick={() => handleSampleClick(s)}>
                    <img key={s} src={`img/${s}.svg`} alt={s} className={style.settings__content__sample_img__images__img} />
                    <span className={`${style.settings__content__sample_img__images__span} ${appContext?.cardSets === s ? style.active_cards : ""}`}>
                      {s}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {sampleOrUpload === "upload" && (
            <div className={style.settings__content__image_upload}>
              <span
                className={style.settings__content__image_upload__title}
                title="Если количество карт не подходит для выбранного размера поля, то будет выбран набор из готовых карт"
              >
                Загрузка собственного набора карт:
              </span>
              <div className={style.settings__content__image_upload__input_wrapper}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  id="file-input"
                  className={style.settings__content__image_upload__input}
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-input" className={style.settings__content__image_upload__label}>
                  Выберите файлы
                </label>
              </div>

              <div className={style.settings__content__image_upload__preview}>
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className={style.settings__content__image_upload__preview__item}>
                    <img src={img} alt={`uploaded ${idx + 1}`} className={style.settings__content__image_upload__preview__item__img} />
                    <button
                      onClick={() => handleDeleteImage(img)}
                      className={style.settings__content__image_upload__preview__item__delete_button}
                    ></button>
                  </div>
                ))}
              </div>

              <div className={style.settings__content__image_upload__buttons}>
                <button onClick={handleAddImageSet} className={style.settings__content__image_upload__button}>
                  Добавить набор
                </button>

                <button onClick={handleResetImages} className={style.settings__content__image_upload__button}>
                  Удалить набор
                </button>
              </div>

              {error.length > 0 && (
                <ul className={style.settings__content__image_upload__errors}>
                  {error.map((err, idx) => (
                    <li key={idx} className={style.settings__error}>
                      {err}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className={style.settings__content__theme}>
            <span className={style.settings__content__theme__title}>Тема:</span>
            <div className={style.settings__content__theme__buttons}>
              {["Light", "Dark"].map((t) => (
                <button
                  key={t}
                  className={`${style.settings__content__theme__buttons__button} ${appContext?.theme === t ? style.active : ""}`}
                  onClick={() => handleThemeChange(t)}
                >
                  {t === "Light" ? "Светлая" : "Темная"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
