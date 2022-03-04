import React from "react";

const WarDates = () => {
  return (
    <section className="my-24 bg-white px-6 sm:px-16 md:px-28 ">
      <div className="mb-20">
        <h2 className="mt-8 text-center text-4xl font-bold">War Dates</h2>
        <p className="mt-4 text-gray-600 text-center text-sm">War Dates</p>
      </div>

      <div className="flex justify-center  flex-wrap">
        {[...Array(10)].map((e, i) => (
          <Card
            key={i}
            date="02 Jan 2022"
            img="https://placekeanu.com/128"
            desc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid,
               doloribus?"
            link="https://www.google.com"
          />
        ))}
      </div>
    </section>
  );
};

const Card = ({ date, img, desc, link }) => {
  return (
    <div style={{ maxWidth: "550px" }} className="p-2 lg:w-1/2 md:1/3 ">
      <div className="rounded-xl flex transition-all duration-300 bg-gray-100 shadow hover:shadow-xl p-2">
        <img src={img} className="rounded-lg h-32 w-32 " alt="" />
        <div className="flex flex-col ml-4 justify-between">
          <div className="mb-8">
            <h1 className="text-xl font-semibold">{date}</h1>
            <p className="text-sm text-gray-600">{desc} </p>
          </div>
          <a
            href={link || "#"}
            className="px-4 ml-auto w-max hover:bg-secondary active:bg-primary py-2 text-sm text-white transition-all duration-300  rounded-md bg-primary hover:shadow-lg shadow-sm"
          >
            Buy Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default WarDates;
