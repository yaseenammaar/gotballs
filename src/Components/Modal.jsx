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
import SpecialDate from "../specialDates.json";

function getPrice(t) {
  var priceNFT = 0;
  for (var i = 0; i < 365; i++) {
    if (t == SpecialDate["dates"][i].date) {
      priceNFT = SpecialDate["dates"][i].price;
    }
    // console.log("test: ", SpecialDate["dates"][i].date);
  }
  return priceNFT;
}

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
      <span className="rounded-lg mt-3 mb-2 py-4 px-2 text-gray-500">
        Attributes
      </span>

      <div className="flex flex-wrap">
        <span className="border-solid rounded-lg border-2 m-2 py-2 px-2 text-sky-500">
          <span className="text-sm text-gray-500">Year</span> {year}
        </span>
        <span className="border-solid rounded-lg border-2 m-2 py-2 px-2 text-sky-500">
          <span className="text-sm text-gray-500">Month</span> {month}
        </span>
        <span className="border-solid rounded-lg border-2 m-2 py-2 px-2 text-sky-500">
          <span className="text-sm text-gray-500">Date</span> {date}
        </span>
        <span className="border-solid rounded-lg border-2 m-2 py-2 px-2 text-sky-500">
          <span className="text-sm text-gray-500">Day</span> {day}
        </span>
      </div>
    </div>
  );
}

export default function Modal({
  isOpen,
  setIsOpen,
  title,
   isNFTSold = false,
}) {
  return (
    <>
      {isOpen && (
        <div
          id="modal-bg"
          onClick={(e) => {
            e.target.id === "modal-bg" && setIsOpen(false);
          }}
          className="bg-black flex min-h-full bg-opacity-80 w-full top-0 z-50 fixed items-center justify-center backdrop-blur-md "
        >
          <div className="bg-white rounded-xl flex flex-col mx-auto max-h-[75vh] p-2 w-3/5 relative overflow-y-auto sm:w-1/2 md:w-2/5 lg:flex-row lg:max-h-auto lg:w-8/12 lg:overflow-y-hidden">
            <div className="rounded-xl flex w-full max-w-5xl items-center justify-center">
              <div className="rounded-xl shadow-lg shadow-gray-300 overflow-hidden">
                <NFT date={title} />
              </div>
            </div>

            <div className="mt-6 w-full p-4 md:w-auto md:p-8 lg:mt-0">
              <p className="text-2xl">{title}</p>
              <div>
                <span className="text-2xl text-sky-500">
                  ◎{getPrice(title)} <br />
                  {/* {e} */}
                </span>
              </div>

              {getAttributes(title)}
              <br />
              <Button
                style={
                  isNFTSold
                    ? { backgroundColor: "gray" }
                    : { backgroundColor: "#0284FE" }
                }
                disabled={isNFTSold}
                onClick={() => {
                  buyNFT(title, getPrice(title));
                }}
              >
                Buy This Date
              </Button>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-md bg-gray-800 shadow-sm text-xs text-white p-1 transition-all top-2 right-2 duration-300 absolute hover:shadow-lg "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}{" "}
    </>
  );
}
