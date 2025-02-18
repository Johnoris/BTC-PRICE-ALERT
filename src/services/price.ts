import axios from "axios";
import { formatAmount } from "../helpers";

const COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price";
const PING_URL =
  "";
let previousPrice: number = 0;
const THRESHOLD = 5000;

export const getBitcoinPrice = async (): Promise<number> => {
  const response = await axios.get(COINGECKO_API, {
    params: { ids: "bitcoin", vs_currencies: "usd" },
  });
  return response.data.bitcoin.usd;
};

export const checkPrice = async () => {
  const price = await getBitcoinPrice();
  if (price > previousPrice) {
    const minThreshold = Math.ceil((previousPrice + 1) / THRESHOLD) * THRESHOLD;
    const maxThreshold = Math.floor(price / THRESHOLD) * THRESHOLD;
    if (minThreshold <= maxThreshold) {
      const thresholds = [];
      for (let threshold = minThreshold; threshold <= maxThreshold; threshold += THRESHOLD) {
        thresholds.push(threshold);
      }
      
      await Promise.all(
        thresholds.map(threshold => {
          return triggerAlert("above", threshold, price);
        })
      );
    }
    previousPrice = price;
    return {
      lowerThreshold: formatAmount(minThreshold),
      bitcoinPrice: formatAmount(price),
      higherThreshold: formatAmount(maxThreshold),
    };
  } else if (price < previousPrice) {
    const maxThreshold =
      Math.floor((previousPrice - 1) / THRESHOLD) * THRESHOLD;
    const minThreshold = Math.ceil(price / THRESHOLD) * THRESHOLD;
    if (maxThreshold >= minThreshold) {
      for (
        let threshold = maxThreshold;
        threshold >= minThreshold;
        threshold -= THRESHOLD
      ) {
        await triggerAlert("below", threshold, price);
      }
    }
    previousPrice = price;
    return {
      lowerThreshold: formatAmount(minThreshold),
      bitcoinPrice: formatAmount(price),
      higherThreshold: formatAmount(maxThreshold),
    };
  } else {
    previousPrice = price;
    return { price: formatAmount(price) };
  }
};

export const triggerAlert = async (
  direction: "above" | "below",
  threshold: number,
  currentPrice: number
) => {
  try {
    await axios.post(
      PING_URL,
      {
        event_name: "BTC price crosses threshold",
        message: `Alert: BTC crossed ${direction} $${threshold}. Current price is $${currentPrice}`,
        status: "success",
        username: "john orisanwo",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(
      `Failed to trigger alert for ${direction} threshold ${threshold}:`,
      error
    );
  }
};
