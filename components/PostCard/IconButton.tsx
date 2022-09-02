import { MouseEventHandler } from "react";
import { IconType } from "react-icons/lib";

export type IconButtonPropType = {
  Icon: IconType;
  text?: string | number;
  size: "10px" | "20px" | "30px";
  color?: "red" | "pink" | "green" | "blue";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  fill?: string;
};
export default function IconButton({
  Icon,
  text = "",
  size,
  onClick,
  color = "pink",
  fill,
}: IconButtonPropType) {
  const ICON_SIZE = size;
  return (
    <div className="flex items-center px-3">
      <button
        onClick={onClick}
        className={`flex items-center text-sm text-gray-200
        duration-300 ease-in-out hover:text-${color}-500`}
      >
        <Icon color={fill} size={ICON_SIZE} className="mr-2" />
        <span>{text}</span>
      </button>
    </div>
  );
}
