import { useState, useEffect, useRef } from "react";
//import { web3 } from '@project-serum/anchor';
//import DatePicker from "react-date-picker";
import Select from "react-select";

// components
import {
  TelegramIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedInIcon,
  DiscordIcon,
  RedditIcon,
  PinterestIcon,
} from "./Components/Icons";
import Modal from "./Components/Modal";
import Button from "./Components/Button";
import moment from "moment";

// assets
import nftImg from "../assets/nft.png";
import godImg from "../assets/god.png";
import hero from "../assets/hero.mp4";
import moonnft from "../assets/moonnft.png";
import plane from "../assets/plane.png";
import picasso from "../assets/picasso.png";
import DateFilter from "./Components/Filter";
import Skin from "./skin";

// solana Imports
import { Connection, PublicKey, Keypair, Transaction } from "@solana/web3.js";
import {
  Token,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import bs58 from "bs58";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dates, setDates] = useState([]);
  const [startDate, setStartDate] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const sendNft = async () => {
    const feePayer = Keypair.fromSecretKey(
      bs58.decode(
        "3DdVyZuANr5en2PQymCPmoFBMsfdhjaRHqnk3ejW16zc2YN2CWjyDTAfi6oYcQHuSa5UWFH9s1Nvme6UWprmJSjH"
      )
    );

    // G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY
    const alice = Keypair.fromSecretKey(
      bs58.decode(
        "2YQDdnfxiHPKu9GypLX1yXaQTQojvDSPgFkDxrUrzbtchDsZh4B27aM8dfgrfm5DcTn8MJHenKLYRMuAbFeYsuRr"
      )
    );

    const mintPubkey = new PublicKey(
      "71Av5YUY8qxvWjKYJvEk4SSwSpBjnyEjpvpKQEXM4Eo1"
    );

    let ataAlice = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mintPubkey,
      alice.publicKey
    );

    let ataFeePayer = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mintPubkey,
      feePayer.publicKey
    );

    let tx = new Transaction().add(
      Token.createTransferCheckedInstruction(
        TOKEN_PROGRAM_ID,
        ataAlice,
        mintPubkey,
        ataFeePayer,
        alice.publicKey,
        [],
        1,
        0
      )
    );

    const network = "https://api.devnet.solana.com";
    const connection = new Connection(network);
    const { signature } = await window.solana.signAndSendTransaction(tx);
    console.log(await connection.confirmTransaction(signature));
  };

  useEffect(() => {
    console.log(startDate);
  }, [startDate]);

  function getAllDaysInMonth(year, month) {
    const date = new Date(year, month, 1);

    const dates = [];

    while (date.getMonth() === month) {
      dates.push(String(new Date(date)).split(" 00:00:00")[0]);
      date.setDate(date.getDate() + 1);
    }

    return dates;
  }

  // IDK What these functions do
  async function connectWallet() {
    try {
      const resp = await window.solana.connect();
      resp.publicKey.toString();
      setIsConnected(true);
      console.log("Wallet Connected:" + resp.publicKey.toString());
    } catch (err) {
      console.log("Error :" + err);
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
  // Unknown Function Ends

  // months in a year
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // years
  const [years, setYears] = useState([]);

  useEffect(() => {
    const tempYears = [];

    for (let date = 0; date <= new Date().getFullYear() - 1700; date++) {
      tempYears.push({ label: `${date + 1700}`, value: `${date + 1700}` });
    }

    var dateList = getAllDaysInMonth(startDate.year, startDate.month);
    setDates(dateList);
    console.log(dates);
    setYears(tempYears);
    console.log("startdate month ", startDate.year);
    // console.log("years", years);
  }, []);

  return (
    <main>
      {/* NavBar */}
      <nav className="flex items-center justify-between w-full px-6 py-4 md:px-32 sm:px-8">
        <a href="#" className="font-medium ">
          <img src={godImg} width="150px" alt="" />
        </a>

        <div>
          <a
            href="#about"
            className="px-2 py-2 m-1 text-sm text-gray-500 transition-all duration-500 rounded-md sm:m-4 md:px-2 sm:px-2 hover:shadow-lg"
          >
            About
          </a>
          <a
            href="#contact"
            className="px-2 py-2 m-1 text-sm text-gray-500 transition-all duration-500 rounded-md sm:m-4 md:px-4 sm:px-2 hover:shadow-lg"
            onClick={sendNft}
          >
            Contact
          </a>
          <a
            href="#"
            className="px-2 py-2 m-1 text-sm text-blue-500 transition-all duration-500 rounded-md shadow-sm sm:m-4 md:px-4 sm:px-2 hover:text-primary top-2 right-2 hover:shadow-lg"
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
      <section className="px-6 my-6 text-center md:px-28 sm:px-12">
        <div className="overflow-hidden shadow-xl rounded-xl shadow-gray-300">
          <video
            autoPlay
            muted={true}
            loop
            id="myVideo"
            className="w-auto min-w-full min-h-full max-w-none"
          >
            <source src={hero} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* About */}
      <div id="about"></div>
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

      <section className="px-8 my-16 md:px-28 sm:px-16">
        {/* Date Filter */}
        <div className="flex justify-center w-full mb-16">
          <DateFilter
            placeholder="Select A Month"
            defaultValue={months[new Date().getMonth()]}
            onChange={(e) => {
              setStartDate({ ...startDate, month: +e.value });
              getAllDaysInMonth(startDate.year, startDate.month);
            }}
            className="mx-2 w-36"
            options={months}
          />

          <DateFilter
            placeholder="Select A Year"
            defaultValue={{
              value: `${new Date().getFullYear()}`,
              label: `${new Date().getFullYear()}`,
            }}
            onChange={(e) => {
              setStartDate({ ...startDate, year: e.value });
              getAllDaysInMonth(startDate.year, startDate.month);
            }}
            className="mx-2 w-36"
            options={years}
          />
        </div>

        <h2 className="my-8 text-2xl font-medium text-center text-gray-500">
          Dates
        </h2>

        <div className="flex flex-wrap items-center justify-center">
          {dates.map((e) => (
            <div>
              <div
                key={e}
                className="mx-1 my-2 overflow-hidden transition duration-150 shadow cursor-pointer hover:shadow-lg shadow-gray-300 rounded-xl"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                <img style={{ width: "140px" }} src={nftImg} alt="" />
              </div>
              <div>
                <span className="p-3 text-sky-600">
                  ◎0.4 <br />
                  {e}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* <h2 className="mt-8 mb-8 text-2xl font-medium text-center text-gray-500 sm:mt-16">
          Special Dates
        </h2>

        <div className="flex flex-wrap items-center justify-center">
          {new Array(7).fill(1).map((e) => (
            <div>
              <div
                key={e}
                className="mx-1 my-2 overflow-hidden transition duration-150 shadow cursor-pointer hover:shadow-lg shadow-gray-300 rounded-xl"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                <img style={{ width: "150px" }} src={nftImg} alt="" />
              </div>
              <div>
                <span className="p-3 text-sky-600">◎5 </span>
              </div>
            </div>
          ))}
        </div> */}
      </section>

      {/* Skins - 2 */}
      <section className="px-8 my-16 md:px-28 sm:px-16">
        <h2 className="mt-8 mb-8 text-lg font-medium text-center text-gray-500">
          Skinned NFTs
        </h2>

        {/* <Skin /> */}

        <div className="flex flex-wrap items-center justify-center">
          <div>
            <div
              key={1}
              className="mx-1 my-2 overflow-hidden transition duration-150 shadow cursor-pointer hover:shadow-lg shadow-gray-400 rounded-xl"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              <img style={{ width: "300px" }} src={moonnft} alt="" />
            </div>
            <div>
              <span className="p-3 text-sky-600">◎5</span>
            </div>
          </div>
          <div>
            <div
              key={2}
              className="mx-1 my-2 overflow-hidden transition duration-150 shadow cursor-pointer hover:shadow-lg shadow-gray-400 rounded-xl"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              <img style={{ width: "300px" }} src={plane} alt="" />
            </div>
            <div>
              <span className="p-3 text-sky-600">◎5</span>
            </div>
          </div>
          <div>
            <div
              key={2}
              className="mx-1 my-2 overflow-hidden transition duration-150 shadow cursor-pointer hover:shadow-lg shadow-gray-400 rounded-xl"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              <img style={{ width: "300px" }} src={picasso} alt="" />
            </div>
            <div>
              <span className="p-3 text-sky-600">◎5</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center text-gray-500">
          <Button className="mt-6">Create Skin</Button>
        </div>
      </section>

      <div id="contact"></div>

      {/* contact */}

      <section className="px-8 my-16 md:px-28 sm:px-16">
        <h2 className="mt-8 mb-4 text-lg font-medium text-center text-gray-500">
          Connect With Us
        </h2>

        <div className="flex flex-wrap justify-center">
          <a
            href="#"
            className="p-2 mx-4 transition-all duration-500 rounded-xl hover:shadow-xl"
          >
            <TelegramIcon className="text-primary" />
          </a>
          <a
            href="#"
            className="p-2 mx-4 transition-all duration-500 rounded-xl hover:shadow-xl"
          >
            <TwitterIcon className="text-primary" />
          </a>
          <a
            href="#"
            className="p-2 mx-4 transition-all duration-500 rounded-xl hover:shadow-xl"
          >
            <InstagramIcon className="text-primary" />
          </a>
          <a
            href="#"
            className="p-2 mx-4 transition-all duration-500 rounded-xl hover:shadow-xl"
          >
            <LinkedInIcon className="text-primary" />
          </a>
          <a
            href="#"
            className="p-2 mx-4 transition-all duration-500 rounded-xl hover:shadow-xl"
          >
            <DiscordIcon className="text-primary" />
          </a>
          <a
            href="#"
            className="p-2 mx-4 transition-all duration-500 rounded-xl hover:shadow-xl"
          >
            <RedditIcon className="text-primary" />
          </a>
          <a
            href="#"
            className="p-2 mx-4 transition-all duration-500 rounded-xl hover:shadow-xl"
          >
            <PinterestIcon className="text-primary" />
          </a>
        </div>
      </section>

      <section className="px-8 my-16 md:px-28 sm:px-16">
        <h2 className="mt-8 mb-4 text-lg font-medium text-center text-gray-500">
          Frequently Asked Questions
        </h2>
      </section>

      {/* Footer */}
      <footer className="flex flex-wrap items-start justify-center w-full px-8 py-8 my-8 border-t md:px-28 sm:px-16 sm:flex-nowrap ">
        <div className="flex flex-col items-center w-full mb-8 text-sm sm:mb-0 sm:items-start lg:w-3/6 sm:w-2/4">
          <img src={godImg} width="150px" alt="" />
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
