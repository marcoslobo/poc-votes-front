import Layout from "../components/layout";
import Sidebar from "../components/sidebar";
import React, { useState, useEffect } from "react";
import { CONTRACT_VOTER } from "../util/constants";
import abiVoter from "../abi/voter.json";
import { ethers } from "ethers";
import Accordion from "../components/accordion";
import { Button } from "reactstrap";

export default function Admin() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [renderGroups, setrenderGroups] = useState(null);

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        setIsWalletConnected(true);

        console.log("Account Connected: ", account);
      } else {
        setError("Please install a MetaMask wallet to use our bank.");
        console.log("No Metamask detected");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const voteOnProposal = async (event) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const voterContract = new ethers.Contract(CONTRACT_VOTER, abiVoter, signer);

    const voteId = event.currentTarget.getAttribute("data-value");
    await voterContract.vote(voteId);

    // console.log(value1);
  };

  const getGroupsFull = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const voterContract = new ethers.Contract(CONTRACT_VOTER, abiVoter, signer);

    let htmlTratado = [];
    const groupsForLoop = await voterContract.getProposalsGroups();

    for (const group of groupsForLoop) {
      const proposalsIds = await voterContract.getProposalsIdsByGroupId(
        group.id.toNumber()
      );

      let proposalsToAdd = [];

      for (const [idx, proposalId] of proposalsIds.entries()) {
        let proposal = await await voterContract.getProposalById(proposalId);

        proposalsToAdd.push(
          <div>
            <hr />
            <p>Proposal {idx + 1}</p>
            <h4>{proposal.title}</h4>
            <p>{proposal.description}</p>
            <Button
              onClick={voteOnProposal}
              color="primary"
              data-value={proposalId}
            >
              Vote on this
            </Button>
          </div>
        );
      }

      htmlTratado.push(
        <Accordion
          title={group.title}
          subTitle={group.description}
          content={proposalsToAdd}
        ></Accordion>
      );
    }

    setrenderGroups(htmlTratado);
  };

  useEffect(async () => {
    checkIfWalletIsConnected();
    getGroupsFull();
  }, [isWalletConnected]);

  return (
    <section>
      <h2>Vote</h2>
      <p>
        Here you can vote on proposals. Each group has one or more proposals and
        you can vote just on one proposal for each group.
      </p>
      <p>
        For vote, you need to have the Wolf Token. If you want some token, get
        it on the Token Menu
      </p>

      <hr />
      {renderGroups}
      <div
        style={{
          display: "block",
          width: 700,
          padding: 30,
        }}
      ></div>
    </section>
  );
}

Admin.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Sidebar />
      {page}
    </Layout>
  );
};
