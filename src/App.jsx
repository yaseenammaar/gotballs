
import { useState } from "react";
//import { web3 } from '@project-serum/anchor';
//import DatePicker from "react-date-picker";

import Modal from "./Components/Modal";
import Button from './Components/Button'


import nftImg from "../assets/nft.png";
import godImg from "../assets/god.png";
import hero from "../assets/hero.mp4";
import moonnft from "../assets/moonnft.png";
import plane from "../assets/plane.png";
import picasso from "../assets/picasso.png";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  async function connectWallet() {
    try {
      const resp = await window.solana.connect();
      resp.publicKey.toString();
      setIsConnected(true);
      console.log("Wallet Connected:" + resp.publicKey.toString());
    } catch (err) {
      console.log("Error:" + err);
    }
  }

  function disconnectWallet() {
    setIsConnected(false);
    window.solana.disconnect();
  }

  async function mint() {
    const solConnection = new web3.Connection(getCluster("devnet"));
    const walletKeyPair = loadWalletKey("./devnet.json");
    await mintNFT(
      solConnection,
      walletKeyPair,
      "https://gateway.pinata.cloud/ipfs/QmQmvqpZzxPqUHMzuL32S1Pi2eTkF3LYsncWgWK1k52JAQ?preview=1"
    );
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
            className="px-2 py-2 text-sm text-gray-500 md:px-4 sm:px-2 hover:text-primary "
          >
            About
          </a>
          <a
            href="#"
            className="px-2 py-2 text-sm text-gray-500 md:px-4 sm:px-2 hover:text-primary "
            onClick={mint}
          >
            Contact
          </a>
          <a
            href="#"
            className="px-2 py-2 text-sm text-gray-500 md:px-4 sm:px-2 hover:text-primary "
            onClick={isConnected ? disconnectWallet : connectWallet}
          >
            {isConnected ? "Disconnect" : "Connect"}
          </a>
        </div>
      </nav>

      <Modal
        imgSrc={moonnft}
        alt="Hello World"
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      />

      {/* Hero */}
      <section className="px-6 my-16 text-center md:px-28 sm:px-12">
        <div className="overflow-hidden shadow-xl rounded-xl shadow-gray-300">
          <video autoPlay muted={true} loop id="myVideo">
            <source src={hero} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* About */}
      <section className="px-8 my-24 md:px-28 sm:px-16">
        <h2 className="mt-8 mb-20 text-lg font-medium text-center text-gray-500">
          GoOnDate NFT
        </h2>

        <div className="flex flex-wrap justify-center w-full lg:justify-between">
          <div className="flex items-center justify-center w-full sm:w-8/12 lg:w-2/5 rounded-xl ">
            <div className="overflow-hidden shadow-lg shadow-gray-300 rounded-xl">
              <img src={nftImg} alt="" />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center w-full py-16 text-center text-gray-600 md:px-12 md:w-11/12 sm:w-10/12 lg:w-3/5">
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
            className="w-10/12 px-3 py-2 my-8 text-gray-600 border border-gray-300 rounded sm:w-2/3 md:w-1/2"
          />


        </div>

        <h2 className="mt-8 mb-8 text-2xl font-medium text-center text-gray-500">
          Dates
        </h2>

        <div className="flex flex-wrap items-center justify-center">
          {new Array(21).fill(1).map((e) => (
            <div
              key={e}
              className="mx-1 my-2 overflow-hidden transition duration-150 shadow cursor-pointer hover:shadow-lg shadow-gray-300 rounded-xl"
            >
              <img style={{ width: "150px" }} src={nftImg} alt="" />
            </div>
          ))}
        </div>

        <h2 className="mt-8 mt-16 mb-8 text-2xl font-medium text-center text-gray-500">
          Special Dates
        </h2>

        <div className="flex flex-wrap items-center justify-center">
          {new Array(7).fill(1).map((e) => (
            <div
              key={e}
              className="mx-1 my-2 overflow-hidden transition duration-150 shadow cursor-pointer hover:shadow-lg shadow-gray-300 rounded-xl"
            >
              <img style={{ width: "150px" }} src={nftImg} alt="" />
            </div>
          ))}
        </div>
      </section>

      {/* Skins - 2 */}
      <section className="px-8 my-16 md:px-28 sm:px-16">
        <h2 className="mt-8 mb-8 text-lg font-medium text-center text-gray-500">
          Skinned NFTs
        </h2>

        <div className="flex flex-wrap items-center justify-center">
          <div
            key={1}
            className="mx-1 my-2 overflow-hidden transition duration-150 shadow cursor-pointer hover:shadow-lg shadow-gray-400 rounded-xl"
          >
            <img style={{ width: "300px" }} src={moonnft} alt="" />
          </div>
          <div
            key={2}
            className="mx-1 my-2 overflow-hidden transition duration-150 shadow cursor-pointer hover:shadow-lg shadow-gray-400 rounded-xl"
          >
            <img style={{ width: "300px" }} src={plane} alt="" />
          </div>
          <div
            key={2}
            className="mx-1 my-2 overflow-hidden transition duration-150 shadow cursor-pointer hover:shadow-lg shadow-gray-400 rounded-xl"
          >
            <img style={{ width: "300px" }} src={picasso} alt="" />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center text-gray-500">
          <Button className="mt-6">Create Skin</Button>
        </div>
      </section>

      {/* contact */}
      <section className="px-8 my-16 md:px-28 sm:px-16">
        <h2 className="mt-8 mb-4 text-lg font-medium text-center text-gray-500">
          Contact Us
        </h2>
      </section>

      <section className="px-8 my-16 md:px-28 sm:px-16">
        <h2 className="mt-8 mb-4 text-lg font-medium text-center text-gray-500">
          Frequently Asked Questions
        </h2>
      </section>

      {/* Footer */}
      <footer className="flex flex-wrap items-start justify-center w-full px-8 py-8 my-8 border-t md:px-28 sm:px-16 sm:flex-nowrap ">
        <div className="flex flex-col items-center w-full text-sm sm:items-start lg:w-3/6 sm:w-2/4">
          <h3 className="mb-3 text-base font-semibold">Go On Date</h3>
        </div>

        <div className="flex flex-col items-center w-1/2 text-sm sm:items-start lg:w-1/6 sm:w-1/4">
          <h3 className="mb-3 text-base font-semibold">Contact With Us</h3>
          <ul>
            <li className="my-1 text-gray-700">
              <a
                href="#"
                className="p-1 transition duration-150 hover:text-primary"
              >
                Instagram
              </a>
            </li>
            <li className="my-1 text-gray-700">
              <a
                href="#"
                className="p-1 transition duration-150 hover:text-primary"
              >
                Twitter
              </a>
            </li>
            <li className="my-1 text-gray-700">
              <a
                href="#"
                className="p-1 transition duration-150 hover:text-primary"
              >
                LinkedIn
              </a>
            </li>
            <li className="my-1 text-gray-700">
              <a
                href="#"
                className="p-1 transition duration-150 hover:text-primary"
              >
                Discord
              </a>
            </li>
            <li className="my-1 text-gray-700">
              <a
                href="#"
                className="p-1 transition duration-150 hover:text-primary"
              >
                Pintrest
              </a>
            </li>
            <li className="my-1 text-gray-700">
              <a
                href="#"
                className="p-1 transition duration-150 hover:text-primary"
              >
                Telegram
              </a>
            </li>
            <li className="my-1 text-gray-700">
              <a
                href="#"
                className="p-1 transition duration-150 hover:text-primary"
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
                className="p-1 transition duration-150 hover:text-primary"
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



export default App;
