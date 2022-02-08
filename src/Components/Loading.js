export default function Loading({ text, isOpen }) {
  return (
    <>
      {isOpen && (
        <div className="flex items-center justify-center w-screen h-screen fixed top-0 bg-white z-[99]">
          <div className="flex flex-col items-center justify-center space-x-1 text-sm text-gray-700">
            <div className="flex items-center justify-center mb-2 ">
              <svg
                fill="none"
                className="w-6 h-6 animate-spin"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
              <div>{text || 'Loading ...'}</div>
            </div>
            <div>Minting Usually Takes 40-60Seconds, So Hold Tight!</div>
          </div>
        </div>
      )}
    </>
  );
}
