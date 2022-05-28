import Layout from "../components/layout";
import Sidebar from "../components/sidebar";
import { toast, ToastContainer } from "react-nextjs-toast";
import React, { useEffect } from "react";

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

  return (
    <section>
      <ToastContainer></ToastContainer>
      <h2>Example of voting system on blockchain</h2>
      <p>
        This is an vote smart contract example for study case and complete the
        etherem101 course.
      </p>
      <p>
        It's deployed and running on Rinkebery, one of the Ethereum test network
      </p>
      <p>
        <b>Sources in</b>
      </p>
      <p>Smart Contract: https://github.com/marcoslobo/poc-votes-sm</p>
      <p>Front: https://github.com/marcoslobo/poc-votes-front</p>
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
