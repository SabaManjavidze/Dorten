import { MouseEventHandler } from "react";
import { IconType } from "react-icons/lib";

export type IconButtonPropType = {
  Icon: IconType;
  text?: string | number;
  size: "10px" | "20px" | "30px";
  hoverColor?: "red" | "pink" | "green" | "blue";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  fill?: string;
  disabled?: boolean;
};
export default function IconButton({
  Icon,
  text = "",
  size = "20px",
  onClick = () => null,
  hoverColor = "pink",
  fill = "gray",
  disabled = false,
}: IconButtonPropType) {
  const ICON_SIZE = size;
  if (!hoverColor) return null;
  return (
    <button
      onClick={onClick}
      className={`flex cursor-pointer items-center text-sm
    ${
      disabled ? "text-gray-400" : `text-${fill}-200`
    } duration-300 ease-in-out ${
        !disabled && `hover:-rotate-12 hover:text-${hoverColor}-500`
      }`}
      disabled={disabled}
    >
      <Icon size={ICON_SIZE} className="mr-2" />
      <span>{text}</span>
    </button>
  );
}
