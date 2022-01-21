import { useEffect, useRef } from "react";

export default function NFT({ date, day }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.width = 500;
    ref.current.height = 500;

    var canvas = ref.current;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";

    ctx.font = "30px 'Josefin Sans'";
    ctx.fontStyle = "white";
    ctx.textAlign = "center";

    // date
    ctx.fillText(date, canvas.width / 2, canvas.height / 2 + 10);
    ctx.font = "22px 'Josefin Sans'";

    ctx.fillText(day, canvas.width - 100, canvas.height - 48);
  }, []);

  return <canvas style={{ width: "100%", height: "100%" }} ref={ref}></canvas>;
}
