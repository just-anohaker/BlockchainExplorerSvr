import { PublicClient } from "@okfe/okex-node";

const INSTRUMENT_ID = "ETH-USDT";
const client = PublicClient();
client.spot().getSpotTicker(INSTRUMENT_ID)
    .then((result: any) => {
        console.log("spot usdt-btc:", result);
    })
    .catch((error: any) => {
        console.log("spot usdt-btc error:", error);
    });