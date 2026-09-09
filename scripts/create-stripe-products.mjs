import Stripe from "stripe";
import fs from "fs";
import path from "path";

const envPath = path.resolve(".env.local");

if (!fs.existsSync(envPath)) {
  throw new Error(".env.local was not found.");
}

const envContents = fs.readFileSync(envPath, "utf8");

const secretKeyLine = envContents
  .split(/\r?\n/)
  .find((line) => line.startsWith("STRIPE_SECRET_KEY="));

if (!secretKeyLine) {
  throw new Error("STRIPE_SECRET_KEY is missing from .env.local");
}

const secretKey = secretKeyLine.split("=")[1].trim();

const stripe = new Stripe(secretKey);

const yearlyProduct = await stripe.products.create({
  name: "Summarist Premium Plus Yearly",
});

const yearlyPrice = await stripe.prices.create({
  product: yearlyProduct.id,
  unit_amount: 9999,
  currency: "usd",
  recurring: {
    interval: "year",
  },
});

const monthlyProduct = await stripe.products.create({
  name: "Summarist Premium Monthly",
});

const monthlyPrice = await stripe.prices.create({
  product: monthlyProduct.id,
  unit_amount: 999,
  currency: "usd",
  recurring: {
    interval: "month",
  },
});

console.log("Created Stripe products successfully.");
console.log("");
console.log("YEARLY_PRICE_ID=" + yearlyPrice.id);
console.log("MONTHLY_PRICE_ID=" + monthlyPrice.id);
