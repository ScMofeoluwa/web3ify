import dotenv from "dotenv";
import { ethers } from "ethers";
import { Contract, ContractCall, Provider } from "ethers-multicall";
import path from "path";
import { abiErc20, Data, tokens } from "./constants";

dotenv.config({
  path: path.normalize(path.join(path.dirname(__dirname) + "/.env")),
});

export class Web3ify {
  private readonly provider;
  private readonly multicallProvider;
  private readonly etherscanProvider;

  constructor(network: string) {
    this.provider = new ethers.providers.InfuraProvider(
      network,
      process.env.INFURA_KEY,
    );
    this.etherscanProvider = new ethers.providers.EtherscanProvider(
      network,
      process.env.ETHERSCAN_KEY,
    );
    this.multicallProvider = new Provider(this.provider);
  }

  async getEthBalance(address: string) {
    const balance = await this.provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  }

  async getStablesBalance(address: string) {
    const totalCall: ContractCall[] = [];
    const balances: Data = {};
    const keys = Object.keys(tokens);
    await this.multicallProvider.init();

    for (const token in tokens) {
      const contract = new Contract(tokens[token], abiErc20);
      const call = contract.balanceOf(address);
      totalCall.push(call);
    }

    const res = await this.multicallProvider.all(totalCall);
    for (let i = 0; i < res.length; i++) {
      balances[keys[i]] = ethers.utils.formatEther(res[i]);
    }
    return balances;
  }

  async getTxnHistory(address: string) {
    return await this.etherscanProvider.getHistory(address);
  }
}
