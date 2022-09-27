declare global {
  namespace NodeJS {
    interface ProcessEnv {
      INFURA_KEY: string;
      ETHERSCAN_KEY: string;
    }
  }
}

export {}
