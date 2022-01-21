import { useState } from "react";

export default function Question({ title, children }) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="w-full sm:w-4/5 md:w-1/2">
      <div className="rounded-xl m-0.5 p-5 shadow-gray-300 duration-300 tranition-all hover:shadow-xl">
        <p className="font-medium text-lg text-gray-900 leading-6">{title}</p>
        <p className="mt-2">
          <p className="text-base text-gray-500 leading-6">{children}</p>
        </p>
      </div>
    </div>
  );

  //   return (
  //     <div className="w-full sm:w-4/5 md:w-1/2">
  //       <div className="rounded-xl m-0.5 p-5 shadow-gray-300 duration-300 tranition-all hover:shadow-xl">
  //         <p
  //           className="font-medium text-lg text-gray-900 leading-6"
  //           onClick={() => setIsActive(!isActive)}
  //         >
  //           {title}
  //         </p>
  //         {isActive && (
  //           <p className="mt-2">
  //             <p className="text-base text-gray-500 leading-6">{children}</p>
  //           </p>
  //         )}
  //       </div>
  //     </div>
  //   );
}
