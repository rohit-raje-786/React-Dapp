import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";

import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import Token from "./artifacts/contracts/Token.sol/Token.json";

// import RPToken from "./artifacts/contracts/RPToken.sol/RPToken.json";

const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const tokenAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

function App() {
  const [greeting, setGreetingValue] = useState();
  const [userAccount, setUserAccount] = useState();
  const [amount, setAmount] = useState(0);
  const [tokenname, setTokenName] = useState("");
  const [tokensymbol, setTokenSymbol] = useState("");

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        console.log("data: ", data);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
      console.log(await contract.name());
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
    }
  }

  async function setGreeting() {
    if (!greeting) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider });
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      await transaction.wait();
      fetchGreeting();
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transaction = await contract.transfer(userAccount, amount);
      await transaction.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
  }

  // async function createERCToken() {
  //   if (typeof window.ethereum !== "undefined") {
  //     await requestAccount();
  //     const RPToken = await hre.ethers.getContractFactory("RPToken");
  //     const rptoken = await RPToken.deploy("ROHIT PATIL TOKEN", "RPT");

  //     await rptoken.deployed();

  //     console.log("Token deployed to:", rptoken.address);
  //   }
  // }
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <br />
        <button onClick={setGreeting}>Set Greeting</button>
        <br />
        <input
          onChange={(e) => setGreetingValue(e.target.value)}
          placeholder="Set greeting"
        />

        <br />
        {/* <button onClick={getBalance}>Get Balance</button>
        <br />
        <button onClick={sendCoins}>Send Coins</button>
        <br />
        <input
          onChange={(e) => setUserAccount(e.target.value)}
          placeholder="Account ID"
        />
        <br />
        <input
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        /> */}
        {/* <form>
          <div className="form-group">
            <label for="exampleInputEmail1">Name of Token</label>
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter Token Name"
              onChange={(e) => setTokenName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label for="exampleInputEmail1">Symbol of Token</label>
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter Symbol of Token"
              onChange={(e) => setTokenSymbol(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            onClick={createERCToken}
          >
            Create Token
          </button>
        </form> */}
      </header>
    </div>
  );
}

export default App;
