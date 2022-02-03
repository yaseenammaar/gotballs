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
import { buyNFT } from "../App";

function getAttributes(title) {
  var t = title.split(" ");

  switch (t[1]) {
    case "Jan":
      t[1] = "January";
      break;
    case "Feb":
      t[1] = "February";
      break;
    case "Mar":
      t[1] = "March";
      break;
    case "Apr":
      t[1] = "April";
      break;
    case "May":
      t[1] = "May";
      break;
    case "Jun":
      t[1] = "June";
      break;
    case "Jul":
      t[1] = "July";
      break;
    case "Aug":
      t[1] = "August";
      break;
    case "Sep":
      t[1] = "September";
      break;
    case "Oct":
      t[1] = "October";
      break;
    case "Nov":
      t[1] = "November";
      break;
    case "Dec":
      t[1] = "December";
      break;
    default:
      t[1] = "";
      break;
  }
  switch (t[0]) {
    case "Mon":
      t[0] = "Monday";
      break;
    case "Tue":
      t[0] = "Tuesday";
      break;
    case "Wed":
      t[0] = "Wednesday";
      break;
    case "Thu":
      t[0] = "Thursday";
      break;
    case "Fri":
      t[0] = "Friday";
      break;
    case "Sat":
      t[0] = "Satuday";
      break;
    case "Sun":
      t[0] = "Sunday";
      break;
    default:
      t[0] = "";
      break;
  }

  var month = t[1];
  var day = t[0];
  var date = t[2];
  var year = t[3];

  return (
    <div className="flex flex-col">
      <br />
      <span className="px-2 py-4 mt-3 mb-2 text-gray-500 rounded-lg">
        Attributes
      </span>

      <div className="flex flex-wrap">
        <span className="px-2 py-2 m-2 border-2 border-solid rounded-lg text-sky-500">
          <span className="text-sm text-gray-500">Year</span> {year}
        </span>
        <span className="px-2 py-2 m-2 border-2 border-solid rounded-lg text-sky-500">
          <span className="text-sm text-gray-500">Month</span> {month}
        </span>
        <span className="px-2 py-2 m-2 border-2 border-solid rounded-lg text-sky-500">
          <span className="text-sm text-gray-500">Date</span> {date}
        </span>
        <span className="px-2 py-2 m-2 border-2 border-solid rounded-lg text-sky-500">
          <span className="text-sm text-gray-500">Day</span> {day}
        </span>
      </div>
    </div>
  );
}

export default function Modal({
  imgSrc,
  alt,
  isOpen,
  setIsOpen,
  title,
  isNFTAvailable = false,
}) {
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
            <div className="flex items-center justify-center w-full max-w-5xl rounded-xl">
              <div className="overflow-hidden shadow-lg rounded-xl shadow-gray-300">
                <NFT date={title} />
              </div>
            </div>

            <div class="md:w-auto w-full mt-6 lg:mt-0 md:p-8 p-4">
              <p class="text-2xl">{title}</p>
              <div>
                <span className="text-2xl text-sky-500">
                  ◎0.4 <br />
                  {/* {e} */}
                </span>
              </div>

              {getAttributes(title)}
              <br />
              <Button
                disabled={isNFTAvailable}
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
                className="w-4 h-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
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
