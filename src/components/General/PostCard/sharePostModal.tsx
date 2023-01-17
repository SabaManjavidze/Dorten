import React, { Dispatch } from "react";
import Modal from "react-modal";
import { BiLink } from "react-icons/bi";
import { MdClose } from "react-icons/md";

type SharePostModalPropType = {
  showShareModal: boolean;
  setShowShareModal: Dispatch<boolean>;
  postLink: string;
};
export default function SharePostModal({
  showShareModal,
  setShowShareModal,
  postLink,
}: SharePostModalPropType) {
  const handleLinkCopy = () => {
    navigator.clipboard.writeText(postLink);
  };
  return (
    <Modal
      isOpen={showShareModal}
      contentLabel="Share Post Link"
      className={`${
        showShareModal ? "opacity-100" : "opacity-0"
      }relative h-full backdrop-blur-sm duration-1000`}
      style={{
        overlay: {
          backgroundColor: "rgba(31, 42, 68,0.7)",
        },
        content: {
          backgroundColor: "transparent",
          border: "none",
        },
      }}
    >
      <div className="relative flex h-full w-full">
        <button
          className="absolute top-10 right-10 "
          onClick={() => {
            setShowShareModal(false);
          }}
        >
          <MdClose color="red" size={25} />
        </button>
        <div
          className="absolute top-1/2 right-1/2 flex w-full -translate-y-1/2 translate-x-1/2 
          flex-col items-center justify-center "
        >
          <div className="my-5 flex h-12 w-4/5 items-center">
            <input
              placeholder="type a comment..."
              name="text"
              value={postLink}
              disabled
              className="mr-3 h-full w-full rounded-sm !bg-skin-main px-5 text-lg text-white"
            />
            <button
              className="post-btn-pink flex h-full items-center px-3 shadow-xl shadow-pink-500/40
                hover:shadow-2xl"
              onClick={handleLinkCopy}
              type="button"
            >
              <BiLink color="pink" size={25} />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
