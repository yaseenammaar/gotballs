import { useState, useEffect } from "react";
// import { web3 } from "@project-serum/anchor";
//import DatePicker from "react-date-picker";
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

// assets
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
import TopBar from "./Components/TopBar";

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
var isWalletConnected = false;

const getProvider = async () => {
  if ("solana" in window) {
    // opens wallet to connect to
    await window.solana.connect();

    const provider = window.solana;
    if (provider.isPhantom) {
      return provider;
    }
  } else {
    window.open("https://www.phantom.app/", "_blank");
  }
};

if (window.solana) {
  window.solana.on("connect", () => {
    toast.success("Wallet Connected!");
    isWalletConnected = true;
    setConnected(true);
  });
}

export function buyNFT(date, price) {
  if (!isWalletConnected) {
    toast.error("Wallet Not  Connected!");

    return getProvider();
  }

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
      Signature: signatur,
      BuyerWalletAddress: provider.publicKey,
      BuyingPrice: price,
      Skinned: false,
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
  const [isSelectedNftSold, setIsSelectedNftSold] = useState(false);

  const [isLoading, setLoading] = useState(false);
  const [text, setText] = useState("Loading...");

  const [nftTitle, setNftTitle] = useState("");
  // remove below
  const [isInfoLoaded, setIsInfoLoaded] = useState(false);

  ReactGA.initialize("UA-221469498-1");
  ReactGA.pageview("/");

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
    year: 2021,
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

    // if (infoIsLoaded) {
    e = e.slice(4);
    var found = 0;
    if (!e.includes("2021")) {
      return (
        <span className="text-sm p-3 text-red-500">
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
    // }
  }

  function dateIsSoldForModal(e) {
    if (infoIsLoaded) {
      e = e.slice(4);
      var found = 0;
      if (!e.includes("2021")) {
        return true; // coming soon
      }

      soldNfts
        .filter((val) => {
          if (e == "") {
            return val;
          } else if (val.Date.toLowerCase().includes(e.toLowerCase())) {
            return val;
          }
        })
        .map(() => {
          found = 1;
        });

      if (found === 0) {
        return false; // available
      } else {
        return true; // sold
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
    <main class="bg-[#041C32]">


      {/*<TopBar title="Hurry" />*/}

      <Loading isOpen={isLoading} text={text} />
      <Toaster position="top-right" reverseOrder={false} />
      {/* NavBar */}
      <nav className="flex w-full py-4 px-6 items-center justify-between sm:px-8 md:px-32">
        <a href="#" className="font-medium ">
          
        </a>

        <div>
          <a
            href="#about"
            className="rounded-md m-1 text-sm py-2 px-2 transition-all text-gray-500 duration-500 sm:m-4 sm:px-2 md:px-2 hover:shadow-lg"
          >
            About
          </a>
          <a
            href="#contact"
            className="rounded-md m-1 text-sm py-2 px-2 transition-all text-gray-500 duration-500 sm:m-4 sm:px-2 md:px-4 hover:shadow-lg"
          >
            Contact
          </a>
          <a
            href="#roadmap"
            className="rounded-md m-1 text-sm py-2 px-2 transition-all text-gray-500 duration-500 sm:m-4 sm:px-2 md:px-2 hover:shadow-lg"
          >
            Roadmap
          </a>
          <a
            href="#"
            className="rounded-md m-1 shadow-sm text-sm py-2 px-2 transition-all top-2 right-2 text-blue-500 duration-500 sm:m-4 sm:px-2 md:px-4 hover:shadow-lg hover:text-primary"
            onClick={isConnected ? disconnectWallet : getProvider}
          >
            {isConnected ? "Disconnect" : "Connect"}
          </a>
        </div>
      </nav>
         <div id="about" class="flex flex-wrap place-content-center p-2">

        <p class="text-2xl text-[#ECB365]">
        Got Balls?
        </p>

        </div>
        <div id="about" class="flex flex-wrap place-content-center p-2">
        <p class="text-2xl text-[#ECB365]">
        Connect Wallet
        </p>
        </div>
        <div id="about" class="flex flex-wrap place-content-center p-2">

        <p class="text-2xl text-[#ECB365]">
        Hold atleast One NFT to play
        </p>

        </div>


      {/* About */}
      <div id="about" class="flex flex-wrap place-content-center p-10">

        <div class="animate-spin m-2 cursor-pointer drop-shadow-md border-2 w-12 h-12 bg-red-400 rounded-full"></div>

        <div class="animate-spin m-2 cursor-pointer drop-shadow-md border-2 w-12 h-12 bg-green-200 rounded-full"></div>
        <div class="animate-spin m-2 cursor-pointer drop-shadow-md border-2 w-12 h-12 bg-blue-400 rounded-full"></div>
        <div class="animate-spin m-2 cursor-pointer drop-shadow-md border-2 w-12 h-12 bg-red-400 rounded-full"></div>
        <div class="animate-spin m-2 cursor-pointer drop-shadow-md border-2 w-12 h-12 bg-blue-300 rounded-full"></div>
        <div class="animate-spin m-2 cursor-pointer drop-shadow-md border-2 w-12 h-12 bg-indigo-700 rounded-full"></div>
        

      </div>
       <div id="about" class="flex flex-wrap place-content-center p-2">
        <a
            href="#"
            className="rounded-md m-1 shadow-sm text-sm py-2 px-2 transition-all top-2 right-2 text-blue-500 duration-500 sm:m-4 sm:px-2 md:px-4 hover:shadow-lg hover:text-primary"
          >
            Buy NFT
          </a>
          <a
            href="#"
            className="rounded-md m-1 shadow-sm text-sm py-2 px-2 transition-all top-2 right-2 text-blue-500 duration-500 sm:m-4 sm:px-2 md:px-4 hover:shadow-lg hover:text-primary"
          >
            Play
          </a>
        </div>


      <div id="contact"></div>


      {/* contact */}


      {/* Footer */}
      <footer className="border-t flex flex-wrap my-8 w-full py-8 px-8 items-start justify-center sm:flex-nowrap sm:px-16 md:px-28 ">
        <div className="flex flex-col text-sm mb-8 w-full items-center sm:mb-0 sm:w-2/4 sm:items-start lg:w-3/6">
          {/*<img src={godImg} width="150px" alt="" />*/}
        </div>

        <div className="flex flex-col text-sm w-1/2 items-center sm:w-1/4 sm:items-start lg:w-1/6">
          <h3 className="font-semibold text-base mb-3">Contact With Us</h3>
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

        <div className="flex flex-col text-sm w-1/2 items-center sm:w-1/4 sm:items-start lg:w-2/6">
          <h3 className="font-semibold text-base mb-3">Get To Know Us</h3>
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
      <div className="text-sm w-full py-4 px-16 text-gray-700">
        © 2022 Ball Game NFT
      </div>
    </main>
  );
}

export default App;
