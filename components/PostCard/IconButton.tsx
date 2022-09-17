import { MouseEventHandler } from "react";
import { IconType } from "react-icons/lib";

export type IconButtonPropType = {
  Icon: IconType;
  text?: string | number;
  size: "10px" | "20px" | "30px";
  hoverColor?: "red" | "pink" | "green" | "blue";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  fill?: string;
};
export default function IconButton({
  Icon,
  text = "",
  size = "20px",
  onClick = () => null,
  hoverColor = "pink",
  fill = "gray",
}: IconButtonPropType) {
  const ICON_SIZE = size;
  if (!hoverColor) return null;
  return (
    <button
      onClick={onClick}
      className={`flex items-center text-sm
    text-${fill}-200 duration-300 ease-in-out hover:-rotate-12 hover:text-${hoverColor}-500`}
    >
      <Icon size={ICON_SIZE} className="mr-2" />
      <span>{text}</span>
    </button>
  );
}

// <button
//   onClick={onClick}
//   className={`flex items-center text-sm
//     text-gray-200 duration-300 ease-in-out hover:-rotate-12 hover:text-${hoverColor}-500`}
// >
//   <Icon fill={fill ?? "white"} size={ICON_SIZE} className="mr-2" />
//   <span>{text}</span>
// </button>
