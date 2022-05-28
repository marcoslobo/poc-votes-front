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
        This example adds a property <code>getLayout</code> to your page,
        allowing you to return a React component for the layout. This allows you
        to define the layout on a per-page basis. Since we're returning a
        function, we can have complex nested layouts if desired.
      </p>
      <h3>Vote on some proposals</h3>
      <p>
        When navigating between pages, we want to persist page state (input
        values, scroll position, etc) for a Single-Page Application (SPA)
        experience.
      </p>
      <p>
        This layout pattern will allow for state persistence because the React
        component tree is persisted between page transitions. To preserve state,
        we need to prevent the React component tree from being discarded between
        page transitions.
      </p>
      <h3>Try It Out</h3>
      <p>
        To visualize this, try tying in the search input in the{" "}
        <code>Sidebar</code> and then changing routes. You'll notice the input
        state is persisted.
      </p>
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
