/**
 *
 * @param {string} imgSrc - Image URL
 * @param {string} alt - Image alternate text
 * @param {boolean} isOpen - state for opening modal
 * @param {void} setIsOpen - function for managing state for  the modal
 * @returns
 */

import Button from "./Button";
import NFT from "./NFT";

function buyNFT(date) {
  var dateStr = date.split(" ");
  var dateFinal = dateStr[1] + " " + dateStr[2] + " " + dateStr[3];

  console.log("Buy NFT", dateFinal);
}

export default function Modal({ imgSrc, alt, isOpen, setIsOpen, title }) {
  return (
    <>
      {isOpen && (
        <div
          id="modal-bg"
          onClick={(e) => {
            e.target.id === "modal-bg" && setIsOpen(false);
          }}
          className="fixed top-0 z-50 flex items-center justify-center w-full min-h-full bg-black bg-opacity-80 backdrop-blur-md "
        >
          <div class="lg:w-8/12 md:w-2/5 sm:w-1/2 w-3/5 p-2 relative rounded-xl lg:max-h-auto max-h-[75vh] lg:overflow-y-hidden overflow-y-auto mx-auto flex flex-col lg:flex-row bg-white">
            <div className="rounded-xl flex w-full items-center justify-center sm:w-8/12 lg:w-2/5 ">
              <div className="rounded-xl shadow-lg shadow-gray-300 overflow-hidden">
                {/* <img src={nftImg} alt="" /> */}
                <NFT date={title} />
              </div>
            </div>

            <div class="md:w-auto w-full mt-6 lg:mt-0 md:p-8 p-4">
              <p class="text-2xl">{title}</p>
              <div>
                <span className="text-sky-600">
                  ◎0.4 <br />
                  {/* {e} */}
                </span>
              </div>
              <br />
              <Button
                onClick={() => {
                  buyNFT(title);
                }}
              >
                Buy This Date
              </Button>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="absolute p-1 text-xs text-white transition-all duration-300 bg-gray-800 rounded-md shadow-sm top-2 right-2 hover:shadow-lg "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}{" "}
    </>
  );
}
