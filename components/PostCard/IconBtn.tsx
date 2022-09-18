import { MouseEventHandler } from "react";
import { IconType } from "react-icons/lib";

export type IconBtnPropType = {
  Icon: IconType;
  text?: string | number;
  size: "10px" | "20px" | "30px";
  hoverColor?: "red" | "pink" | "green" | "blue";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  fill?: string;
  disabled?: boolean;
};
export default function IconBtn({
  Icon,
  text = "",
  size = "20px",
  onClick = () => null,
  hoverColor = "pink",
  fill = "gray",
  disabled = false,
}: IconBtnPropType) {
  const ICON_SIZE = size;
  if (!hoverColor) return null;
  return (
    <button
      onClick={onClick}
      className={`flex cursor-pointer items-center text-sm
    ${disabled ? "text-disable" : fill} duration-300 ease-in-out ${
        !disabled && `hover:-rotate-12 hover:text-${hoverColor}-500`
      }`}
      disabled={disabled}
    >
      <Icon size={ICON_SIZE} className="mr-2" />
      <span>{text}</span>
    </button>
  );
}
