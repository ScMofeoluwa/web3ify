import { Web3ify } from "./main";
const client = new Web3ify("mainnet");

(async () => {
  const test = await client.getStablesBalance(
    "0xf5113bCD3AD47CAc91a8764cdE6769886c96d215",
  );
  console.log(test);
})();
