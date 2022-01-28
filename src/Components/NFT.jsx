import { useEffect, useRef } from "react";

export default function NFT({ date }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.width = 500;
    ref.current.height = 500;

    var d = date.split(" ");

    switch (d[1]) {
      case "Jan":
        d[1] = "January";
        break;
      case "Feb":
        d[1] = "February";
        break;
      case "Mar":
        d[1] = "March";
        break;
      case "Apr":
        d[1] = "April";
        break;
      case "May":
        d[1] = "May";
        break;
      case "Jun":
        d[1] = "June";
        break;
      case "Jul":
        d[1] = "July";
        break;
      case "Aug":
        d[1] = "August";
        break;
      case "Sep":
        d[1] = "September";
        break;
      case "Oct":
        d[1] = "October";
        break;
      case "Nov":
        d[1] = "November";
        break;
      case "Dec":
        d[1] = "December";
        break;
      default:
        d[1] = "";
        break;
    }
    switch (d[0]) {
      case "Mon":
        d[0] = "Monday";
        break;
      case "Tue":
        d[0] = "Tuesday";
        break;
      case "Wed":
        d[0] = "Wednesday";
        break;
      case "Thu":
        d[0] = "Thursday";
        break;
      case "Fri":
        d[0] = "Friday";
        break;
      case "Sat":
        d[0] = "Satuday";
        break;
      case "Sun":
        d[0] = "Sunday";
        break;
      default:
        d[0] = "";
        break;
    }

    var canvas = ref.current;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";

    ctx.font = "30px 'Josefin Sans'";
    ctx.fontStyle = "white";
    ctx.textAlign = "center";

    // date
    ctx.fillText(
      d[2] + " " + d[1] + " " + d[3],
      canvas.width / 2,
      canvas.height / 2 + 10
    );
    ctx.font = "22px 'Josefin Sans'";

    ctx.fillText(d[0], canvas.width - 100, canvas.height - 48);
  }, []);

  return <canvas style={{ width: "100%", height: "100%" }} ref={ref}></canvas>;
}
