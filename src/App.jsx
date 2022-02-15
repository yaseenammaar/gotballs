import { useState, useEffect, useLayoutEffect } from "react";
// import { web3 } from "@project-serum/anchor";
//import DatePicker from "react-date-picker";
import Select from "react-select";
import ReactGA from "react-ga";
import toast, { Toaster } from "react-hot-toast";
import SpecialDate from "./specialDates.json";

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
import Question from "./Components/Question";
import NFT from "./Components/NFT";
import DateFilter from "./Components/Filter";
import Loading from "./Components/Loading";

import moment from "moment";

// assets
import nftImg from "./assets/nft.png";
import godImg from "./assets/god.png";
import hero from "./assets/hero.mp4";
import skin from "./assets/skin.mp4";
import moonnft from "./assets/moonnft.png";
import roadmap from "./assets/roadmap.png";
import plane from "./assets/plane.png";
import picasso from "./assets/picasso.png";
import wwst from "./assets/wwst.png";
import wwen from "./assets/wwen.png";
import Skin from "./skin";
import axios from "axios";

// solana Imports
import {
  Connection,
  PublicKey,
  SystemProgram,
  Keypair,
  Transaction,
} from "@solana/web3.js";
import {
  Token,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import bs58 from "bs58";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var connectWallet;
var provider;

const getProvider = async () => {
  if ("solana" in window) {
    // opens wallet to connect to
    await window.solana.connect();

    const provider = window.solana;
    if (provider.isPhantom) {
      toast.success("Wallet Connected!");
      setConnected(true);
      return provider;
    }
  } else {
    window.open("https://www.phantom.app/", "_blank");
  }
};

export function buyNFT(date, price) {
  var dateStr = date.split(" ");
  var dateFinal = dateStr[1] + " " + dateStr[2] + " " + dateStr[3];

  uploadImage(dateFinal, price);
}

var info = [];
var soldNfts = [];
var infoIsLoaded = false;
var isSoldListLoaded = false;

function loadMintedNfts(setState, passed = false) {
  axios({
    method: "post",
    url: "https://api.goondate.com:3001/nft/mintedList",
  })
    .then((mintedLista) => {
      info = mintedLista.data;

      // console.log("SS" + JSON.stringify(info));

      passed && setState(true);
      infoIsLoaded = true;
    })
    .catch((error) => console.log("ERROR WHILE getting address:" + error));
}

function loadSoldNfts() {
  axios({
    method: "post",
    url: "https://api.goondate.com:3001/nft/soldList",
  })
    .then((mintedLista) => {
      soldNfts = mintedLista.data;
      isSoldListLoaded = true;
    })
    .catch((error) => console.log("ERROR WHILE getting address:" + error));
}

const uploadImage = async (date, price) => {
  const address = await getNftAddress(date);
  if (address == 0) {
    openLoading("Minting NFT...", true);
    var response = await axios({
      method: "post",
      url: "https://api.goondate.com:3001/nft/buy",
      data: {
        Date: date,
      },
    }).catch((error) => {
      console.log("ERROR WHILE CREATING FILE:" + error);
      // toast.error("Something Wrong, Try Again!");
      openLoading("Minting NFT...", false);
    });
    if (response.data.response == "error") {
      toast.error("Something Wrong, Try Again!");
      openLoading("Minting NFT...", false);

      return console.error("CUSTOM ERROR:" + response.data.data);
    }

    if (response.data.response == "success") {
      openLoading("Minting NFT...", true);
      if (response.data.data == "uploaded") {
        var mintedAddress = await getNftAddress(date);
        if (mintedAddress == 0) {
          openLoading("Minting NFT...", false);

          toast.error("Something Wrong, Try Again!");
          return console.log("Error cant found the nft");
        }
        sendNft(mintedAddress, date, price);
      }
    }
  } else {
    console.log("Image Minted");
    sendNft(address, date, price);
  }
};

const getNftAddress = async (date) => {
  openLoading("Getting Minted NFT Info...", true);
  var response = await axios({
    method: "post",
    url: "https://api.goondate.com:3001/nft/getNftAddress",
    data: {
      DateAlpha: date,
      walletKey: "HPGZnjf2g1uprvTdMVusCSc3HGpc3jLguppi9QKxJ5tU",
    },
  }).catch((error) => console.log("ERROR WHILE getting address:" + error));
  console.log(response.data);
  if (response.data.response == "error") return 0;
  else if (response.data.response == "success") {
    return response.data.data;
  }
};

const sendNft = async (mintPublickKey, date, price) => {
  openLoading("Preparing Wallet...", true);
  if (!isSoldListLoaded) await loadMintedNfts();
  var isMinted = false;
  var inWallet = false;

  info.forEach((nft) => {
    if (nft.Date == date) isMinted = true;
  });
  const ndtAddress = await getNftAddress(date);
  if (ndtAddress != 0) inWallet = true;

  if (isMinted && !inWallet) {
    openLoading("Loading...", false);
    toast.error("Error NFT Sold ALready");
    return;
  }

  const network = "https://solana-mainnet.phantom.tech";
  const connection = new Connection(network);

  if (!provider) await connectWallet();

  provider = await getProvider();

  const alice = Keypair.fromSecretKey(
    bs58.decode(
      "2YQDdnfxiHPKu9GypLX1yXaQTQojvDSPgFkDxrUrzbtchDsZh4B27aM8dfgrfm5DcTn8MJHenKLYRMuAbFeYsuRr"
    )
  );

  const mintPubkey = new PublicKey(mintPublickKey);

  const mintToken = new Token(connection, mintPubkey, TOKEN_PROGRAM_ID, alice);

  const fromTokenAccount = await mintToken.getOrCreateAssociatedAccountInfo(
    alice.publicKey
  );

  const destPublicKey = provider.publicKey;

  // Get the derived address of the destination wallet which will hold the custom token
  const associatedDestinationTokenAddr = await Token.getAssociatedTokenAddress(
    mintToken.associatedProgramId,
    mintToken.programId,
    mintPubkey,
    destPublicKey
  );

  const receiverAccount = await connection.getAccountInfo(
    associatedDestinationTokenAddr
  );

  const transaction = new Transaction();

  if (receiverAccount === null) {
    transaction.add(
      Token.createAssociatedTokenAccountInstruction(
        mintToken.associatedProgramId,
        mintToken.programId,
        mintPubkey,
        associatedDestinationTokenAddr,
        destPublicKey,
        alice.publicKey
      )
    );
  }

  transaction.add(
    Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      fromTokenAccount.address,
      associatedDestinationTokenAddr,
      alice.publicKey,
      [],
      1
    )
  );

  const transferTransaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: destPublicKey,
      toPubkey: alice.publicKey,
      lamports: price * 1000000000,
    })
  );

  var signatur = null;
  transferTransaction.recentBlockhash = (
    await connection.getRecentBlockhash()
  ).blockhash;
  transferTransaction.feePayer = destPublicKey;
  try {
    const { signature } = await window.solana.signAndSendTransaction(
      transferTransaction
    );
    signatur = signature;
    //   await connection.confirmTransaction(signature);
  } catch (error) {
    toast.error("Something Wrong. Please try again!");
    openLoading("Minting Image...", false);

    console.log("ERROR:" + error);
  }
  if (signatur == null) {
    toast.error("Something Wrong. Please try again!");
    openLoading("Minting Image...", false);

    return console.log("error payment did not received:" + signatur);
  }

  console.log(
    `txhash: ${await connection.sendTransaction(transaction, [
      alice /* fee payer + owner */,
    ])}`
  );
  axios({
    method: "post",
    url: "https://api.goondate.com:3001/nft/nftSold",
    data: {
      Date: date,
    },
  }).catch((error) => console.log("Error" + error));
  openLoading("Minting Image...", false);
  toast.success("Congrats You Bought " + date);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var openLoading = () => {};
var setConnected = () => {};

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoading, setLoading] = useState(false);
  const [text, setText] = useState("Loading...");

  const [nftTitle, setNftTitle] = useState("");
  // remove below
  const [isInfoLoaded, setIsInfoLoaded] = useState(false);

  ReactGA.initialize("300900016");
  loadMintedNfts(setIsInfoLoaded, true);
  loadSoldNfts();

  setConnected = (bool) => {
    if (bool) setIsConnected(true);
    else setConnected(false);
  };

  openLoading = (text, isOpen) => {
    setLoading(isOpen || false);
    setText(text || "Loading...");
  };

  const [dates, setDates] = useState([]);
  const [startDate, setStartDate] = useState({
    month: new Date().getMonth(),
    year: 2020,
  });

  useEffect(() => {
    if (infoIsLoaded) {
      var dateList = getAllDaysInMonth(startDate.year, startDate.month - 1);
      setDates(dateList);
      setIsInfoLoaded(true);
    }
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
  connectWallet = async () => {
    provider = await getProvider();
  };

  function disconnectWallet() {
    setIsConnected(false);
    window.solana.disconnect();
    toast.success("Wallet Disconnected!");
  }

  function dateIsSold(e) {
    var price = 0;
    for (var i = 0; i < 365; i++) {
      if (e == SpecialDate["dates"][i].date) {
        price = SpecialDate["dates"][i].price;
      }
      // console.log("test: ", SpecialDate["dates"][i].date);
    }

    if (infoIsLoaded) {
      e = e.slice(4);
      var found = 0;
      if (!e.includes("2021")) {
        return (
          <span className="p-3 text-sm text-red-500">
            Coming Soon
            <br />
          </span>
        );
      }

      soldNfts
        .filter((val) => {
          if (e == "") {
            return val;
          } else if (val.Date.toLowerCase().includes(e.toLowerCase())) {
            return val;
          }
        })
        .map((val, key) => {
          found = 1;
        });
      if (found === 0) {
        return (
          <span className="p-3 text-sky-600">
            ◎{price} <br />
          </span>
        );
      } else {
        return (
          <span className="p-3 text-red-600">
            Sold <br />
          </span>
        );
      }
    }
  }

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
    loadMintedNfts(setIsInfoLoaded, true);

    const tempYears = [];

    for (let date = 2022; date >= 1700; date--) {
      tempYears.push({ label: `${date}`, value: `${date}` });
    }

    var dateList = getAllDaysInMonth(startDate.year, startDate.month - 1);
    setDates(dateList);
    setYears(tempYears);
  }, []);

  return (
    <main>
      <Loading isOpen={isLoading} text={text} />
      <Toaster position="top-right" reverseOrder={false} />
      {/* NavBar */}
      <nav className="flex items-center justify-between w-full px-6 py-4 sm:px-8 md:px-32">
        <a href="#" className="font-medium ">
          <img src={godImg} width="150px" alt="" />
        </a>

        <div>
          <a
            href="#about"
            className="px-2 py-2 m-1 text-sm text-gray-500 transition-all duration-500 rounded-md sm:m-4 sm:px-2 md:px-2 hover:shadow-lg"
          >
            About
          </a>
          <a
            href="#contact"
            className="px-2 py-2 m-1 text-sm text-gray-500 transition-all duration-500 rounded-md sm:m-4 sm:px-2 md:px-4 hover:shadow-lg"
          >
            Contact
          </a>
          <a
            href="#roadmap"
            className="px-2 py-2 m-1 text-sm text-gray-500 transition-all duration-500 rounded-md sm:m-4 sm:px-2 md:px-2 hover:shadow-lg"
          >
            Roadmap
          </a>
          <a
            href="#"
            className="px-2 py-2 m-1 text-sm text-blue-500 transition-all duration-500 rounded-md shadow-sm top-2 right-2 sm:m-4 sm:px-2 md:px-4 hover:shadow-lg hover:text-primary"
            onClick={isConnected ? disconnectWallet : getProvider}
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
        title={nftTitle}
        price="0.3"
      />

      {/* Hero */}
      <section className="px-6 my-6 text-center sm:px-12 md:px-28">
        <div className="overflow-hidden shadow-xl rounded-xl shadow-gray-300">
          <video
            autoPlay
            muted={true}
            loop
            id="myVideo"
            className="min-w-full min-h-full"
          >
            <source src={hero} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* About */}
      <div id="about"></div>
      <section className="px-8 my-24 sm:px-16 md:px-28">
        <h2 className="mt-8 mb-20 text-2xl font-medium text-center text-gray-500">
          GoOnDate NFT
        </h2>

        <div className="flex flex-wrap justify-center w-full lg:justify-between">
          <div className="flex items-center justify-center w-full rounded-xl sm:w-8/12 lg:w-2/5 ">
            <div className="overflow-hidden shadow-lg rounded-xl shadow-gray-300">
              {/* <img src={nftImg} alt="" /> */}
              <NFT date="Mon Jan 01 2022" />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center w-full py-16 text-center text-gray-600 sm:w-10/12 md:px-12 md:w-11/12 lg:w-3/5">
            How beautiful is the memory of a loved one! But what remains with
            us? A picture? A date? Do you remember the date when you last saw
            them or when you held your baby in your hands for the first time?
            Let's capture those dates together!
            <br />
            <br />
            There are some dates in our life that are so important that we want
            to cherish them forever and own it just for ourselves. We want
            to share it with others but also own it forever. We feel the same
            way and it's our desire that you never loose the memory which you
            value, which is close to your heart !
            {/* <a
              className="p-2 mt-8 font-semibold text-primary hover:text-secondary"
              href="#"
            >
              Know More
            </a> */}
          </div>
        </div>
      </section>

      <div id="contact"></div>

      <section className="px-8 my-16 sm:px-16 md:px-28">
        <h2 className="mt-8 mb-4 text-2xl font-medium text-center text-gray-500">
          Connect With Us
        </h2>

        <div className="flex flex-wrap justify-center">
          <a
            href="https://t.me/GoOnDateNFT"
            className="p-2 mx-4 transition-all duration-500 rounded-xl hover:shadow-xl"
          >
            <TelegramIcon className="text-primary" />
          </a>
          <a
            href="https://twitter.com/GoOnDate?t=i8AWJHEQMb5UaEqdgKLqjQ&s=09"
            className="p-2 mx-4 transition-all duration-500 rounded-xl hover:shadow-xl"
          >
            <TwitterIcon className="text-primary" />
          </a>
          <a
            href="https://www.instagram.com/goondate.nft/"
            className="p-2 mx-4 transition-all duration-500 rounded-xl hover:shadow-xl"
          >
            <InstagramIcon className="text-primary" />
          </a>
          <a
            href="https://www.linkedin.com/in/go-on-date-nft-b8b539229"
            className="p-2 mx-4 transition-all duration-500 rounded-xl hover:shadow-xl"
          >
            <LinkedInIcon className="text-primary" />
          </a>
          <a
            href="https://discord.gg/m7kgsW9mgn"
            className="p-2 mx-4 transition-all duration-500 rounded-xl hover:shadow-xl"
          >
            <DiscordIcon className="text-primary" />
          </a>
          <a
            href="https://www.reddit.com/r/goondate/"
            className="p-2 mx-4 transition-all duration-500 rounded-xl hover:shadow-xl"
          >
            <RedditIcon className="text-primary" />
          </a>
          <a
            href="https://pin.it/5m9ju0v"
            className="p-2 mx-4 transition-all duration-500 rounded-xl hover:shadow-xl"
          >
            <PinterestIcon className="text-primary" />
          </a>
        </div>
      </section>

      <section className="px-8 my-16 sm:px-16 md:px-28">
        {/* Date Filter */}

        <h2 className="my-8 text-2xl font-medium text-center text-gray-500">
          Buy Dates
        </h2>

        <div className="flex justify-center w-full mb-16">
          <DateFilter
            placeholder="Select A Month"
            defaultValue={months[0]}
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
              value: `2020`,
              label: `2020`,
            }}
            onChange={(e) => {
              setStartDate({ ...startDate, year: +e.value });
              getAllDaysInMonth(startDate.year, startDate.month);
            }}
            className="mx-2 w-36"
            options={years}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center">
          {dates.map((e) => (
            <div key={e}>
              <div
                className="mx-1 my-2 overflow-hidden transition duration-150 shadow cursor-pointer rounded-xl shadow-gray-300 hover:shadow-lg"
                onClick={() => {
                  if (e.includes("2021")) {
                    setNftTitle(e);
                    setIsModalOpen(true);
                  } else {
                    toast("NFT Coming Soon!", { icon: "🤘" });
                  }
                }}
                style={{ width: "160px" }}
              >
                <NFT date={e} />
              </div>
              {isInfoLoaded && <div>{dateIsSold(e)}</div>}
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
                className="mx-1 my-2 overflow-hidden transition duration-150 shadow cursor-pointer rounded-xl shadow-gray-300 hover:shadow-lg"
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
      <section className="px-8 my-16 sm:px-16 md:px-28">
        <h2 className="mt-8 mb-8 text-2xl font-medium text-center text-gray-500">
          Skinned NFTs - Coming Soon!
        </h2>

        {/* <Skin /> */}

        <section className="px-3 my-2 text-center sm:px-12 md:px-28">
          <div className="overflow-hidden shadow-xl rounded-xl shadow-gray-300">
            <video
              autoPlay
              muted={true}
              loop
              id="myVideo"
              className="w-auto min-w-full"
            >
              <source src={skin} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-center">
          <div>
            <div
              key={1}
              className="mx-1 my-2 overflow-hidden transition duration-150 shadow cursor-pointer rounded-xl shadow-gray-400 hover:shadow-lg"
              onClick={() => {}}
            >
              <img style={{ width: "200px" }} src={moonnft} alt="" />
            </div>
          </div>
          <div>
            <div
              key={2}
              className="mx-1 my-2 overflow-hidden transition duration-150 shadow cursor-pointer rounded-xl shadow-gray-400 hover:shadow-lg"
              onClick={() => {}}
            >
              <img style={{ width: "200px" }} src={plane} alt="" />
            </div>
          </div>
          <div>
            <div
              key={2}
              className="mx-1 my-2 overflow-hidden transition duration-150 shadow cursor-pointer rounded-xl shadow-gray-400 hover:shadow-lg"
              onClick={() => {}}
            >
              <img style={{ width: "200px" }} src={picasso} alt="" />
            </div>
          </div>
          <div>
            <div
              key={2}
              className="mx-1 my-2 overflow-hidden transition duration-150 shadow cursor-pointer rounded-xl shadow-gray-400 hover:shadow-lg"
              onClick={() => {}}
            >
              <img style={{ width: "200px" }} src={wwst} alt="" />
            </div>
          </div>
          <div>
            <div
              key={2}
              className="mx-1 my-2 overflow-hidden transition duration-150 shadow cursor-pointer rounded-xl shadow-gray-400 hover:shadow-lg"
              onClick={() => {}}
            >
              <img style={{ width: "200px" }} src={wwen} alt="" />
            </div>
          </div>
        </div>

        {/* <div className="flex flex-wrap items-center justify-center text-gray-500">
          <Button className="mt-6 bg-gray-500">Learn More</Button>
        </div> */}
        <div id="roadmap"></div>
      </section>

      <section className="px-8 my-16 sm:px-16 md:px-28">
        <h2 className="mt-8 mb-8 text-2xl font-medium text-center text-gray-500">
          Roadmap
        </h2>

        {/* <Skin /> */}

        <section className="px-3 my-2 text-center sm:px-12 md:px-28">
          <div className="overflow-hidden shadow-xl rounded-xl shadow-gray-300">
            <img src={roadmap} />
          </div>
        </section>
      </section>

      {/* contact */}

      <section className="px-8 my-16 sm:px-16 md:px-28">
        <h2 className="mt-8 mb-4 text-2xl font-medium text-center text-gray-500">
          Frequently Asked Questions
        </h2>

        <div className="flex flex-wrap justify-center">
          <Question title="What is GoOnDate?">
            GoOnDate is a Solana based NFT project, composite of everyday's NFT
            since 1700 till today, years before 1700 will be added soon!
          </Question>
          <Question title="What is the purpose of this platform?">
            To buy and sell GoOnDate NFT and get updates of upcoming events
          </Question>
          <Question title="Why should I buy these NFTs?">
            Every date is unique, no copies can be produced, every NFT is
            extremely rare. Capture your special date or dates you find
            important for mankind and trade for higher prices!
          </Question>
          <Question title="What are the perks of these NFTs?">
            Access to premium chats, communities, GOD exclusive physical clubs,
            and much more
          </Question>
          <Question title="Where can I sell these NFTs?">
            You can sell on GoOnDate.com or on any other Solana NFTs marketplace
          </Question>
          <Question title="On which blockchain this project is on?">
            This NFT project is on Solana Blockchain
          </Question>
          <Question title="Will this platform provide auction?">
            Yes, daily one NFT will be generated of that day and will be
            auctioned.
          </Question>
          <Question title="Can I buy future dates NFTs?">
            No, you can't buy future dates, everyday a date will be released
          </Question>
          <Question title="Where can I contact in case of any issue regarding GOD NFTs?">
            You can DM on any social media listed on this site
          </Question>
          <Question title="What are GoOnDate NFT Skins?">
            GoOnDate Skins will allow you to customize your GoOnDate NFTs!
          </Question>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-wrap items-start justify-center w-full px-8 py-8 my-8 border-t sm:flex-nowrap sm:px-16 md:px-28 ">
        <div className="flex flex-col items-center w-full mb-8 text-sm sm:mb-0 sm:w-2/4 sm:items-start lg:w-3/6">
          <img src={godImg} width="150px" alt="" />
        </div>

        <div className="flex flex-col items-center w-1/2 text-sm sm:w-1/4 sm:items-start lg:w-1/6">
          <h3 className="mb-3 text-base font-semibold">Contact With Us</h3>
          <ul>
            <li className="my-1 text-gray-700">
              <a
                href="https://www.instagram.com/goondate.nft/"
                className="p-1 transition duration-150 hover:text-primary"
              >
                Instagram
              </a>
            </li>
            <li className="my-1 text-gray-700">
              <a
                href="https://twitter.com/GoOnDate?t=i8AWJHEQMb5UaEqdgKLqjQ&s=09"
                className="p-1 transition duration-150 hover:text-primary"
              >
                Twitter
              </a>
            </li>
            <li className="my-1 text-gray-700">
              <a
                href="https://www.linkedin.com/in/go-on-date-nft-b8b539229"
                className="p-1 transition duration-150 hover:text-primary"
              >
                LinkedIn
              </a>
            </li>
            <li className="my-1 text-gray-700">
              <a
                href="https://discord.gg/m7kgsW9mgn"
                className="p-1 transition duration-150 hover:text-primary"
              >
                Discord
              </a>
            </li>
            <li className="my-1 text-gray-700">
              <a
                href="https://pin.it/5m9ju0v"
                className="p-1 transition duration-150 hover:text-primary"
              >
                Pintrest
              </a>
            </li>
            <li className="my-1 text-gray-700">
              <a
                href="https://t.me/GoOnDateNFT"
                className="p-1 transition duration-150 hover:text-primary"
              >
                Telegram
              </a>
            </li>
            <li className="my-1 text-gray-700">
              <a
                href="https://www.reddit.com/r/goondate/"
                className="p-1 transition duration-150 hover:text-primary"
              >
                Reddit
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center w-1/2 text-sm sm:w-1/4 sm:items-start lg:w-2/6">
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
