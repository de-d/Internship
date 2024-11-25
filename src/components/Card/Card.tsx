import styles from "./Card.module.scss";

interface CardProps {
  id: string;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: (id: string) => void;
}

const Card: React.FC<CardProps> = ({ id, image, isFlipped, isMatched, onClick }) => {
  const handleClick = () => {
    if (!isMatched) {
      onClick(id);
    }
  };

  return (
    <div className={`${styles.card} ${isFlipped ? "" : styles.flipped} ${isMatched ? styles.matched : ""}`} onClick={handleClick}>
      <div className={styles.card__inner}>
        <div className={styles.card__front}></div>
        <div className={styles.card__back}>
          <img src={image} alt="card" />
        </div>
      </div>
    </div>
  );
};

export default Card;
