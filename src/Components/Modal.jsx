/**
 *
 * @param {string} imgSrc - Image URL
 * @param {string} alt - Image alternate text
 * @param {boolean} isOpen - state for opening modal
 * @param {void} setIsOpen - function for managing state for  the modal
 * @returns
 */

import Button from "./Button";

export default function Modal({ imgSrc, alt, isOpen, setIsOpen }) {
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
            <img
              alt={alt}
              class="w-full h-full object-cover lg:h-96 min-h-auto object-center rounded-xl"
              src={imgSrc}
            />

            <div class="md:w-auto w-full mt-6 lg:mt-0 md:p-8 p-4">
              <p>
                How beautiful is the memory of a loved one! But what remains
                with us? A picture? A date? Do you remember the date when you
                last saw them or when you held your baby in your hands for the
                first time? We feel the same way and it's our desire that you
                never get loose of the memory that keeps value to you, that is
                close to your heart. Let's capture those dates together!
              </p>

              <br />
              <Button>Buy Me</Button>
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
