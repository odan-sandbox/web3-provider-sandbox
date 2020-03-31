import { SampleProvider } from "./sample-provider";
import Web3 from "web3";

process.on("unhandledRejection", reason => {
  console.error(reason);
  process.exit(1);
});

async function main(): Promise<void> {
  console.log("poyo");
  const provider = new SampleProvider({} as any);

  const web3 = new Web3(provider as any);

  const accounts = await web3.eth.getAccounts();
  console.log(accounts[0]);

  const message = "Poyo";
  const signature = await web3.eth.sign(message, accounts[0]);
  console.log(signature);
}

main();
