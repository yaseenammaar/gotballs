import { useState, useEffect, useRef } from "react";
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
      console.log("Is Phantom installed?  ", provider.isPhantom);
      toast.success("Wallet Connected!");
      setConnected(true);
      return provider;
    }
  } else {
    window.open("https://www.phantom.app/", "_blank");
  }
};

export function buyNFT(date) {
  var dateStr = date.split(" ");
  var dateFinal = dateStr[1] + " " + dateStr[2] + " " + dateStr[3];

  uploadImage(dateFinal);
}

var info = [];
var soldNfts = [];
var infoIsLoaded = false;
var isSoldListLoaded = false;

function loadMintedNfts() {
  axios({
    method: "post",
    url: "https://api.goondate.com:3001/nft/mintedList",
  })
    .then((mintedLista) => {
      info = mintedLista.data;

      // console.log("SS" + JSON.stringify(info));
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

const uploadImage = async (date) => {
  const address = await getNftAddress(date);
  console.log("ALREADY MINTED:" + address);
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
      console.log(JSON.stringify(response.data.data));
      if (response.data.data == "uploaded") {
        console.log("Success");
        var mintedAddress = await getNftAddress(date);
        if (mintedAddress == 0) {
          openLoading("Minting NFT...", false);

          toast.error("Something Wrong, Try Again!");
          return console.log("Error cant found the nft");
        }
        console.log(mintedAddress);
        sendNft(mintedAddress, date);
      }
    }
  } else {
    console.log("Image Minted");
    sendNft(address, date);
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

const sendNft = async (mintPublickKey, date) => {
  openLoading("Preparing Wallet...", true);
  if (!isSoldListLoaded) await loadMintedNfts();
  var isMinted = false;
  var inWallet = false;

  info.forEach((nft) => {
    if (nft.Date == date) isMinted = true;
  });
  const ndtAddress = await getNftAddress(date);
  if (ndtAddress != 0) inWallet = true;

  console.log("=============" + isMinted + "========" + inWallet);

  if (isMinted && !inWallet) {
    openLoading("Loading...", false);
    toast.error("Error NFT Sold ALready");
    return;
  }

  const network = "https://solana-mainnet.phantom.tech";
  const connection = new Connection(network);

  if (!provider) await connectWallet();

  console.log("provider:" + provider.publicKey.toString());

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

  console.log(fromTokenAccount.address.toString());
  console.log(associatedDestinationTokenAddr.toString());

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
      lamports: 1000000000,
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

  ReactGA.initialize("300900016");
  loadMintedNfts();
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
      var date = "Jan 04 2022";
      // console.log("info.json", info);

      {
        info
          .filter((val) => {
            if (date == "") {
              return val;
            } else if (val.Date.toLowerCase().includes(date.toLowerCase())) {
              return val;
            }
          })
          .map((val, key) => {
            console.log("Found!");
          });
      }

      console.log(startDate);
      var dateList = getAllDaysInMonth(startDate.year, startDate.month - 1);
      console.log(dateList);
      setDates(dateList);
    }
  }, [startDate]);

  function getAllDaysInMonth(year, month) {
    const date = new Date(year, month, 1);

    const dates = [];
    const add = [
      "Fri Jan 01 2021",
      "Sat Jan 02 2021",
      "Sun Jan 03 2021",
      "Mon Jan 04 2021",
      "Tue Jan 05 2021",
      "Wed Jan 06 2021",
      "Thu Jan 07 2021",
      "Fri Jan 08 2021",
      "Sat Jan 09 2021",
      "Sun Jan 10 2021",
      "Mon Jan 11 2021",
      "Tue Jan 12 2021",
      "Wed Jan 13 2021",
      "Thu Jan 14 2021",
      "Fri Jan 15 2021",
      "Sat Jan 16 2021",
      "Sun Jan 17 2021",
      "Mon Jan 18 2021",
      "Tue Jan 19 2021",
      "Wed Jan 20 2021",
      "Thu Jan 21 2021",
      "Fri Jan 22 2021",
      "Sat Jan 23 2021",
      "Sun Jan 24 2021",
      "Mon Jan 25 2021",
      "Tue Jan 26 2021",
      "Wed Jan 27 2021",
      "Thu Jan 28 2021",
      "Fri Jan 29 2021",
      "Sat Jan 30 2021",
      "Sun Jan 31 2021",
      "Mon Feb 01 2021",
      "Tue Feb 02 2021",
      "Wed Feb 03 2021",
      "Thu Feb 04 2021",
      "Fri Feb 05 2021",
      "Sat Feb 06 2021",
      "Sun Feb 07 2021",
      "Mon Feb 08 2021",
      "Tue Feb 09 2021",
      "Wed Feb 10 2021",
      "Thu Feb 11 2021",
      "Fri Feb 12 2021",
      "Sat Feb 13 2021",
      "Sun Feb 14 2021",
      "Mon Feb 15 2021",
      "Tue Feb 16 2021",
      "Wed Feb 17 2021",
      "Thu Feb 18 2021",
      "Fri Feb 19 2021",
      "Sat Feb 20 2021",
      "Sun Feb 21 2021",
      "Mon Feb 22 2021",
      "Tue Feb 23 2021",
      "Wed Feb 24 2021",
      "Thu Feb 25 2021",
      "Fri Feb 26 2021",
      "Sat Feb 27 2021",
      "Sun Feb 28 2021",
      "Mon Mar 01 2021",
      "Tue Mar 02 2021",
      "Wed Mar 03 2021",
      "Thu Mar 04 2021",
      "Fri Mar 05 2021",
      "Sat Mar 06 2021",
      "Sun Mar 07 2021",
      "Mon Mar 08 2021",
      "Tue Mar 09 2021",
      "Wed Mar 10 2021",
      "Thu Mar 11 2021",
      "Fri Mar 12 2021",
      "Sat Mar 13 2021",
      "Sun Mar 14 2021",
      "Mon Mar 15 2021",
      "Tue Mar 16 2021",
      "Wed Mar 17 2021",
      "Thu Mar 18 2021",
      "Fri Mar 19 2021",
      "Sat Mar 20 2021",
      "Sun Mar 21 2021",
      "Mon Mar 22 2021",
      "Tue Mar 23 2021",
      "Wed Mar 24 2021",
      "Thu Mar 25 2021",
      "Fri Mar 26 2021",
      "Sat Mar 27 2021",
      "Sun Mar 28 2021",
      "Mon Mar 29 2021",
      "Tue Mar 30 2021",
      "Wed Mar 31 2021",
      "Thu Apr 01 2021",
      "Fri Apr 02 2021",
      "Sat Apr 03 2021",
      "Sun Apr 04 2021",
      "Mon Apr 05 2021",
      "Tue Apr 06 2021",
      "Wed Apr 07 2021",
      "Thu Apr 08 2021",
      "Fri Apr 09 2021",
      "Sat Apr 10 2021",
      "Sun Apr 11 2021",
      "Mon Apr 12 2021",
      "Tue Apr 13 2021",
      "Wed Apr 14 2021",
      "Thu Apr 15 2021",
      "Fri Apr 16 2021",
      "Sat Apr 17 2021",
      "Sun Apr 18 2021",
      "Mon Apr 19 2021",
      "Tue Apr 20 2021",
      "Wed Apr 21 2021",
      "Thu Apr 22 2021",
      "Fri Apr 23 2021",
      "Sat Apr 24 2021",
      "Sun Apr 25 2021",
      "Mon Apr 26 2021",
      "Tue Apr 27 2021",
      "Wed Apr 28 2021",
      "Thu Apr 29 2021",
      "Fri Apr 30 2021",
      "Sat May 01 2021",
      "Sun May 02 2021",
      "Mon May 03 2021",
      "Tue May 04 2021",
      "Wed May 05 2021",
      "Thu May 06 2021",
      "Fri May 07 2021",
      "Sat May 08 2021",
      "Sun May 09 2021",
      "Mon May 10 2021",
      "Tue May 11 2021",
      "Wed May 12 2021",
      "Thu May 13 2021",
      "Fri May 14 2021",
      "Sat May 15 2021",
      "Sun May 16 2021",
      "Mon May 17 2021",
      "Tue May 18 2021",
      "Wed May 19 2021",
      "Thu May 20 2021",
      "Fri May 21 2021",
      "Sat May 22 2021",
      "Sun May 23 2021",
      "Mon May 24 2021",
      "Tue May 25 2021",
      "Wed May 26 2021",
      "Thu May 27 2021",
      "Fri May 28 2021",
      "Sat May 29 2021",
      "Sun May 30 2021",
      "Mon May 31 2021",
      "Tue Jun 01 2021",
      "Wed Jun 02 2021",
      "Thu Jun 03 2021",
      "Fri Jun 04 2021",
      "Sat Jun 05 2021",
      "Sun Jun 06 2021",
      "Mon Jun 07 2021",
      "Tue Jun 08 2021",
      "Wed Jun 09 2021",
      "Thu Jun 10 2021",
      "Fri Jun 11 2021",
      "Sat Jun 12 2021",
      "Sun Jun 13 2021",
      "Mon Jun 14 2021",
      "Tue Jun 15 2021",
      "Wed Jun 16 2021",
      "Thu Jun 17 2021",
      "Fri Jun 18 2021",
      "Sat Jun 19 2021",
      "Sun Jun 20 2021",
      "Mon Jun 21 2021",
      "Tue Jun 22 2021",
      "Wed Jun 23 2021",
      "Thu Jun 24 2021",
      "Fri Jun 25 2021",
      "Sat Jun 26 2021",
      "Sun Jun 27 2021",
      "Mon Jun 28 2021",
      "Tue Jun 29 2021",
      "Wed Jun 30 2021",
      "Thu Jul 01 2021",
      "Fri Jul 02 2021",
      "Sat Jul 03 2021",
      "Sun Jul 04 2021",
      "Mon Jul 05 2021",
      "Tue Jul 06 2021",
      "Wed Jul 07 2021",
      "Thu Jul 08 2021",
      "Fri Jul 09 2021",
      "Sat Jul 10 2021",
      "Sun Jul 11 2021",
      "Mon Jul 12 2021",
      "Tue Jul 13 2021",
      "Wed Jul 14 2021",
      "Thu Jul 15 2021",
      "Fri Jul 16 2021",
      "Sat Jul 17 2021",
      "Sun Jul 18 2021",
      "Mon Jul 19 2021",
      "Tue Jul 20 2021",
      "Wed Jul 21 2021",
      "Thu Jul 22 2021",
      "Fri Jul 23 2021",
      "Sat Jul 24 2021",
      "Sun Jul 25 2021",
      "Mon Jul 26 2021",
      "Tue Jul 27 2021",
      "Wed Jul 28 2021",
      "Thu Jul 29 2021",
      "Fri Jul 30 2021",
      "Sat Jul 31 2021",
      "Sun Aug 01 2021",
      "Mon Aug 02 2021",
      "Tue Aug 03 2021",
      "Wed Aug 04 2021",
      "Thu Aug 05 2021",
      "Fri Aug 06 2021",
      "Sat Aug 07 2021",
      "Sun Aug 08 2021",
      "Mon Aug 09 2021",
      "Tue Aug 10 2021",
      "Wed Aug 11 2021",
      "Thu Aug 12 2021",
      "Fri Aug 13 2021",
      "Sat Aug 14 2021",
      "Sun Aug 15 2021",
      "Mon Aug 16 2021",
      "Tue Aug 17 2021",
      "Wed Aug 18 2021",
      "Thu Aug 19 2021",
      "Fri Aug 20 2021",
      "Sat Aug 21 2021",
      "Sun Aug 22 2021",
      "Mon Aug 23 2021",
      "Tue Aug 24 2021",
      "Wed Aug 25 2021",
      "Thu Aug 26 2021",
      "Fri Aug 27 2021",
      "Sat Aug 28 2021",
      "Sun Aug 29 2021",
      "Mon Aug 30 2021",
      "Tue Aug 31 2021",
      "Wed Sep 01 2021",
      "Thu Sep 02 2021",
      "Fri Sep 03 2021",
      "Sat Sep 04 2021",
      "Sun Sep 05 2021",
      "Mon Sep 06 2021",
      "Tue Sep 07 2021",
      "Wed Sep 08 2021",
      "Thu Sep 09 2021",
      "Fri Sep 10 2021",
      "Sat Sep 11 2021",
      "Sun Sep 12 2021",
      "Mon Sep 13 2021",
      "Tue Sep 14 2021",
      "Wed Sep 15 2021",
      "Thu Sep 16 2021",
      "Fri Sep 17 2021",
      "Sat Sep 18 2021",
      "Sun Sep 19 2021",
      "Mon Sep 20 2021",
      "Tue Sep 21 2021",
      "Wed Sep 22 2021",
      "Thu Sep 23 2021",
      "Fri Sep 24 2021",
      "Sat Sep 25 2021",
      "Sun Sep 26 2021",
      "Mon Sep 27 2021",
      "Tue Sep 28 2021",
      "Wed Sep 29 2021",
      "Thu Sep 30 2021",
      "Fri Oct 01 2021",
      "Sat Oct 02 2021",
      "Sun Oct 03 2021",
      "Mon Oct 04 2021",
      "Tue Oct 05 2021",
      "Wed Oct 06 2021",
      "Thu Oct 07 2021",
      "Fri Oct 08 2021",
      "Sat Oct 09 2021",
      "Sun Oct 10 2021",
      "Mon Oct 11 2021",
      "Tue Oct 12 2021",
      "Wed Oct 13 2021",
      "Thu Oct 14 2021",
      "Fri Oct 15 2021",
      "Sat Oct 16 2021",
      "Sun Oct 17 2021",
      "Mon Oct 18 2021",
      "Tue Oct 19 2021",
      "Wed Oct 20 2021",
      "Thu Oct 21 2021",
      "Fri Oct 22 2021",
      "Sat Oct 23 2021",
      "Sun Oct 24 2021",
      "Mon Oct 25 2021",
      "Tue Oct 26 2021",
      "Wed Oct 27 2021",
      "Thu Oct 28 2021",
      "Fri Oct 29 2021",
      "Sat Oct 30 2021",
      "Sun Oct 31 2021",
      "Mon Nov 01 2021",
      "Tue Nov 02 2021",
      "Wed Nov 03 2021",
      "Thu Nov 04 2021",
      "Fri Nov 05 2021",
      "Sat Nov 06 2021",
      "Sun Nov 07 2021",
      "Mon Nov 08 2021",
      "Tue Nov 09 2021",
      "Wed Nov 10 2021",
      "Thu Nov 11 2021",
      "Fri Nov 12 2021",
      "Sat Nov 13 2021",
      "Sun Nov 14 2021",
      "Mon Nov 15 2021",
      "Tue Nov 16 2021",
      "Wed Nov 17 2021",
      "Thu Nov 18 2021",
      "Fri Nov 19 2021",
      "Sat Nov 20 2021",
      "Sun Nov 21 2021",
      "Mon Nov 22 2021",
      "Tue Nov 23 2021",
      "Wed Nov 24 2021",
      "Thu Nov 25 2021",
      "Fri Nov 26 2021",
      "Sat Nov 27 2021",
      "Sun Nov 28 2021",
      "Mon Nov 29 2021",
      "Tue Nov 30 2021",
      "Wed Dec 01 2021",
      "Thu Dec 02 2021",
      "Fri Dec 03 2021",
      "Sat Dec 04 2021",
      "Sun Dec 05 2021",
      "Mon Dec 06 2021",
      "Tue Dec 07 2021",
      "Wed Dec 08 2021",
      "Thu Dec 09 2021",
      "Fri Dec 10 2021",
      "Sat Dec 11 2021",
      "Sun Dec 12 2021",
      "Mon Dec 13 2021",
      "Tue Dec 14 2021",
      "Wed Dec 15 2021",
      "Thu Dec 16 2021",
      "Fri Dec 17 2021",
      "Sat Dec 18 2021",
      "Sun Dec 19 2021",
      "Mon Dec 20 2021",
      "Tue Dec 21 2021",
      "Wed Dec 22 2021",
      "Thu Dec 23 2021",
      "Fri Dec 24 2021",
      "Sat Dec 25 2021",
      "Sun Dec 26 2021",
      "Mon Dec 27 2021",
      "Tue Dec 28 2021",
      "Wed Dec 29 2021",
      "Thu Dec 30 2021",
      "Fri Dec 31 2021",
    ];

    while (date.getMonth() === month) {
      dates.push(String(new Date(date)).split(" 00:00:00")[0]);
      date.setDate(date.getDate() + 1);
    }
    var json = {};
    var mm = { dates: [] };
    for (var m = 0; m < 365; m++) {
      json.date = add[m];
      if (add[m].includes("Sun")) {
        json.price = 0.5;
      } else {
        json.price = 0.4;
      }
      // mm.push(json);
      mm["dates"].push(JSON.stringify(json));
      // console.log("JSON", json);
      // console.log('mm["dates"]', mm["dates"]);
    }
    console.log("add all dates : ", JSON.parse(mm["dates"][3]).date);

    return dates;
  }

  // IDK What these functions do
  connectWallet = async () => {
    provider = await getProvider();
    console.log(provider.publicKey);
  };

  function disconnectWallet() {
    setIsConnected(false);
    window.solana.disconnect();
    toast.success("Wallet Disconnected!");
  }

  function dateIsSold(e) {
    if (infoIsLoaded) {
      e = e.slice(4);
      var found = 0;
      // console.log("year = ", e);
      if (!e.includes("2021")) {
        return (
          <span className="p-3 text-sm text-red-500">
            Coming Soon
            <br />
          </span>
        );
      }

      info
        .filter((val) => {
          // console.log(val.Date);
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
            ◎0.4 <br />
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
    const tempYears = [];

    for (let date = 2022; date >= 1700; date--) {
      tempYears.push({ label: `${date}`, value: `${date}` });
    }

    var dateList = getAllDaysInMonth(startDate.year, startDate.month - 1);
    setDates(dateList);
    console.log(dates);
    setYears(tempYears);

    console
      .log
      // `App.jsx line 494 startdate month ${startDate.month}, year ${startDate.year}`
      ();
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
            them or when you held your baby in your hands for the first time? We
            feel the same way and it's our desire that you never get loose of
            the memory that keeps value to you, that is close to your heart.
            Let's capture those dates together!
            <br />
            <br />
            There are some dates in our life that are so important that we want
            to cherish them forever and own it just for ourselves. We don't want
            to share it with others but keep it just for us. We feel the same
            way and it's our desire that you never loose the memory which you
            value, which is close to your heart !
            <a
              className="p-2 mt-8 font-semibold text-primary hover:text-secondary"
              href="#"
            >
              Know More
            </a>
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
                  console.log("e = ", e, "Conidton", e.includes("2021"));
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
              <div>{dateIsSold(e)}</div>
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

        <div className="flex flex-wrap items-center justify-center text-gray-500">
          <Button className="mt-6 bg-gray-500">Learn More</Button>
        </div>
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
          <Question title="On which blockchain this project is in?">
            Solana Blockchain
          </Question>

          <Question title="Will this platform provide auction?">Yes</Question>
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
