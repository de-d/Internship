import style from "./ImageWithMask.module.scss";

interface ImageWithMaskProps {
  imgSrc: string | undefined;
  maskShape: string | undefined;
}

export default function ImageWithMask({ imgSrc, maskShape }: ImageWithMaskProps) {
  return <img className={`${style.image} ${style[maskShape || ""]}`} src={imgSrc} alt="image" />;
}
