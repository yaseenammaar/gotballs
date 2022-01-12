import nftImg from "../assets/nft.png";
import godImg from "../assets/god.png";
import heroImg from "../assets/hero.jpg";
import moonnft from "../assets/moonnft.png";
import plane from "../assets/plane.png";
import picasso from "../assets/picasso.png";
import { useState } from "react";

function App() {
  const [isConnected, setIsConnected] = useState(false);

  async function connectWallet(){
    try {
      const resp = await window.solana.connect();
      resp.publicKey.toString()
      setIsConnected(true);
      console.log("Wallet Connected:"+resp.publicKey.toString())
      } catch (err) {
        console.log("Error:"+err)
      }
  }

  function disconnectWallet(){
    setIsConnected(false);
    window.solana.disconnect();
  }

  return (
    <main>
      {/* NavBar */}
      <nav className="flex justify-between items-center w-full md:px-32 sm:px-8 px-6~ py-4">
        <a href="#" className="font-medium ">
          <img src={godImg} width="150px" alt="" />
        </a>

        <div>
          <a
            href="#"
            className="md:px-4 px-1 sm:px-2 py-1 text-sm text-gray-500 hover:text-primary "
          >
            About
          </a>
          <a
            href="#"
            className="md:px-4 px-1 sm:px-2 py-1 text-sm text-gray-500 hover:text-primary "
          >
            Contact
          </a>
          <a
            href="#"
            className="md:px-4 px-1 sm:px-2 py-1 text-sm text-gray-500 hover:text-primary "
            onClick={isConnected ? disconnectWallet : connectWallet}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 my-16 md:px-28 text-center sm:px-12">
        <div
          className="px-8 text-white sm:px-16 py-28 rounded-xl shadow-xl shadow-gray-300"
          style={{
            backgroundImage: `linear-gradient(rgba(92, 187, 239,0.75), rgba(92, 187, 239,0.75)), url("${heroImg}") `,
          }}
        >
          <h1 className="mb-3 text-4xl ">Pre-Sale Started!</h1>
          <p className="mb-6 text-xm">
            Grab the hold of dates close to your heart.
          </p>
          <Button className="hover:shadow-lg">Buy Now</Button>
        </div>
      </section>

      {/* About */}
      <section className="px-8 my-24 md:px-28 sm:px-16">
        <h2 className="mt-8 mb-20 text-lg font-medium text-center">
          GoOnDate NFT
        </h2>

        <div className="flex flex-wrap justify-center w-full lg:justify-between">
          <div className="flex items-center justify-center w-full sm:w-8/12 lg:w-2/5 rounded-xl ">
            <div className="overflow-hidden shadow-lg shadow-gray-300 rounded-xl">
              <img src={nftImg} alt="" />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center text-gray-600 w-full py-16 text-center md:px-12 md:w-11/12 sm:w-10/12 lg:w-3/5">
            How beautiful is the memory of a loved one! But what remains with
            us? A picture? A date? Do you remember the date when you last saw
            them or when you held your baby in your hands for the first time? We
            feel the same way and it's our desire that you never get loose of
            the memory that keeps value to you, that is close to your heart.
            Let's capture those dates together!
            <br />
            <br />
            There are some dates in our life that are so important that we want
            to cherish them forever and own it just for ourselves. We don't want
            to share it with others but keep it just for us. This is the reason
            why we came up with this NFT project.
            <a
              className="p-2 mt-8 font-semibold text-primary hover:text-secondary"
              href="#"
            >
              Know More
            </a>
          </div>
        </div>
      
      </section>

      

      {/* Skins */}
      <section className="px-8 my-16 md:px-28 sm:px-16">
        <div className="flex justify-center w-full">
          <input
            placeholder="Enter your Date (DD-MM-YYYY)"
            type="text"
            name="nftDate"
            id="nftDate"
            className="rounded px-3 py-2 my-8 border border-gray-300 sm:w-2/3 md:w-1/2 w-10/12 text-gray-600"
          />
        </div>

        <h2 className="mt-8 mb-8 text-2xl font-medium text-center">Dates</h2>

        <div className="flex flex-wrap items-center justify-center">
          {new Array(21).fill(1).map((e) => (
            <div
              key={e}
              className="cursor-pointer mx-1 my-2 overflow-hidden shadow hover:shadow-lg transition duration-150 shadow-gray-300 rounded-xl"
            >
              <img style={{ width: "150px" }} src={nftImg} alt="" />
            </div>
          ))}
        </div>

        <h2 className="mt-8 mb-8  mt-16 text-2xl font-medium text-center">
          Special Dates
        </h2>

        <div className="flex flex-wrap items-center justify-center">
          {new Array(7).fill(1).map((e) => (
            <div
              key={e}
              className="cursor-pointer mx-1 my-2 overflow-hidden shadow hover:shadow-lg transition duration-150 shadow-gray-300 rounded-xl"
            >
              <img style={{ width: "150px" }} src={nftImg} alt="" />
            </div>
          ))}
        </div>

       
      </section>

      {/* Skins - 2 */}
      <section className="px-8 my-16 md:px-28 sm:px-16">
        <h2 className="mt-8 mb-8 text-lg font-medium text-center">
          Skinned NFTs
        </h2>

        <div className="flex flex-wrap items-center justify-center">
          
            <div
              key={1}
              className=" cursor-pointer mx-1 my-2 overflow-hidden shadow hover:shadow-lg transition duration-150 shadow-gray-300 rounded-xl"
            >
              <img style={{ width: "300px" }} src={moonnft} alt="" />
            </div>
            <div
              key={2}
              className=" cursor-pointer mx-1 my-2 overflow-hidden shadow hover:shadow-lg transition duration-150 shadow-gray-300 rounded-xl"
            >
              <img style={{ width: "300px" }} src={plane} alt="" />
            </div>
            <div
              key={2}
              className=" cursor-pointer mx-1 my-2 overflow-hidden shadow hover:shadow-lg transition duration-150 shadow-gray-300 rounded-xl"
            >
              <img style={{ width: "300px" }} src={picasso} alt="" />
            </div>
          
        </div>

        <div className="flex flex-wrap items-center justify-center">
          <Button className="">Create Skin</Button>
        </div>
      </section>

      {/* contact */}
      <section className="px-8 my-16 md:px-28 sm:px-16">
        <h2 className="mt-8 mb-4 text-lg font-medium text-center">
          Contact Us
        </h2>
      </section>

      <section className="px-8 my-16 md:px-28 sm:px-16">
        <h2 className="mt-8 mb-4 text-lg font-medium text-center">
          Frequently Asked Questions
        </h2>
      </section>

      {/* Footer */}
      <footer className="flex flex-wrap border-t py-8 md:px-28 items-start justify-center w-full px-8 my-8 sm:px-16 sm:flex-nowrap ">
        <div className="flex flex-col items-center w-full text-sm sm:items-start lg:w-3/6 sm:w-2/4">
          <h3 className="mb-3 text-base font-semibold">Go On Date</h3>
        </div>

        <div className="flex flex-col items-center w-1/2 text-sm sm:items-start lg:w-1/6 sm:w-1/4">
          <h3 className="mb-3 text-base font-semibold">Contact With Us</h3>
          <ul>
            <li className="my-1 text-gray-700">
              <a
                href="#"
                className="p-1 hover:text-primary transition duration-150"
              >
                Instagram
              </a>
            </li>
            <li className="my-1 text-gray-700">
              <a
                href="#"
                className="p-1 hover:text-primary transition duration-150"
              >
                Twitter
              </a>
            </li>
            <li className="my-1 text-gray-700">
              <a
                href="#"
                className="p-1 hover:text-primary transition duration-150"
              >
                LinkedIn
              </a>
            </li>
            <li className="my-1 text-gray-700">
              <a
                href="#"
                className="p-1 hover:text-primary transition duration-150"
              >
                Discord
              </a>
            </li>
            <li className="my-1 text-gray-700">
              <a
                href="#"
                className="p-1 hover:text-primary transition duration-150"
              >
                Pintrest
              </a>
            </li>
            <li className="my-1 text-gray-700">
              <a
                href="#"
                className="p-1 hover:text-primary transition duration-150"
              >
                Telegram
              </a>
            </li>
            <li className="my-1 text-gray-700">
              <a
                href="#"
                className="p-1 hover:text-primary transition duration-150"
              >
                Reddit
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center w-1/2 text-sm sm:items-start lg:w-2/6 sm:w-1/4">
          <h3 className="mb-3 text-base font-semibold">Get To Know Us</h3>
          <ul>
            <li className="my-1 text-gray-700">
              <a
                href="#"
                className="p-1 hover:text-primary transition duration-150"
              >
                About Us
              </a>
            </li>
          </ul>
        </div>
      </footer>

      {/* Copyright */}
      <div className="w-full px-16 py-4 text-sm text-gray-700">
        © 2022 GoOnDate
      </div>
    </main>
  );
}

const Button = ({ children, className, ...rest }) => (
  <button
    {...rest}
    className={`px-4 py-2 mt-6 text-sm text-white transition-all duration-300 shadow rounded-md bg-primary hover:shadow-lg shadow-sm`}
  >
    {children}
  </button>
);

export default App;
