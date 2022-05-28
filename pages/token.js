import Layout from "../components/layout";
import Sidebar from "../components/sidebar";
import { toast, ToastContainer } from "react-nextjs-toast";
import React, { useEffect } from "react";
import { Button } from "reactstrap";
import { CONTRACT_VOTER } from "./../util/constants";
import abiVoter from "./../abi/voter.json";
import { ethers } from "ethers";

export default function Index() {
  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          const account = accounts[0];
          // setIsWalletConnected(true);
          // setCustomerAddress(account);
          console.log("Account Connected: ", account);
        } else {
          toast.notify(`No Metamask detected`, {
            type: "error",
            title: "Metamask Error",
          });
          //setError("Please install a MetaMask wallet to use our bank.");
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkIfWalletIsConnected();
  }, []);

  const faucet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const voterContract = new ethers.Contract(CONTRACT_VOTER, abiVoter, signer);

    await voterContract.tokenFaucet();
  };

  return (
    <section>
      <ToastContainer></ToastContainer>
      <h2>Wolf Token</h2>
      <p>If you want some Wolf Tokens for vote, just mint it here</p>
      <Button onClick={faucet} color="success">
        Get some
      </Button>
    </section>
  );
}

Index.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Sidebar />
      {page}
    </Layout>
  );
};
