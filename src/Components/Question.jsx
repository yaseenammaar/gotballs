import { useState } from "react";

export default function Question({ title, children }) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="w-full sm:w-4/5 md:w-2/3">
      <div
        className={`rounded-xl m-1 shadow-gray-300 duration-300 tranition-all hover:shadow-xl ${
          isActive && "shadow"
        }`}
      >
        <div
          className="flex items-center justify-between p-5 cursor-pointer "
          onClick={() => setIsActive(!isActive)}
        >
          <p className="text-lg font-medium leading-6 text-gray-900">{title}</p>

          <div className="flex items-center justify-center w-10 ">
            {isActive ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </div>
        </div>
        {isActive && (
          <p className="p-5 mt-2">
            <span className="text-base leading-6 text-gray-500">
              {children}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
