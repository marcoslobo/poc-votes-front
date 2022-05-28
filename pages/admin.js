import Layout from "../components/layout";
import Sidebar from "../components/sidebar";
import React, { useState, useEffect, useCallback } from "react";
import { CONTRACT_TOKEN, CONTRACT_VOTER } from "./../util/constants";
import abiVoter from "./../abi/voter.json";
import { ethers } from "ethers";
import Accordion from "./../components/accordion";
import { Button, Modal, ModalBody } from "reactstrap";

export default function Admin() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [renderGroups, setrenderGroups] = useState(null);
  const [modal, setModal] = useState(false);
  const [groupId, setGroupId] = useState(0);
  const [groupTitle, setGroupTitle] = useState("");
  const [inputValue, setInputValue] = useState({
    groupTitle: "",
    groupDescription: "",
    proposalTitle: "",
    proposalDescription: "",
  });
  const [error, setError] = useState(null);

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

  const toggle = () => setModal(!modal);

  const handleInputChange = (event) => {
    setInputValue((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  };

  const createNewGroup = async (event) => {
    try {
      event.preventDefault();
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const voterContract = new ethers.Contract(
          CONTRACT_VOTER,
          abiVoter,
          signer
        );

        const txn = await voterContract.createProposalGroup(
          inputValue.groupTitle,
          inputValue.groupDescription
        );

        console.log("Creating group");

        await txn.wait();

        console.log("Create group...done", txn.hash);

        await getGroupsFull();
      } else {
        console.log("Ethereum object not found, install Metamask.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createNewProposal = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const voterContract = new ethers.Contract(
          CONTRACT_VOTER,
          abiVoter,
          signer
        );

        console.log(inputValue.groupTitle);

        const txn = await voterContract.createProposal(
          groupId,
          inputValue.proposalTitle,
          inputValue.proposalDescription
        );
        console.log("Creating proposal...");
        await txn.wait();
        console.log("Create proposal...done", txn.hash);
        setModal(!modal);
        await getGroupsFull();
      } else {
        console.log("Ethereum object not found, install Metamask.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showModalAddProposal = async (_groupId, _groupTitle) => {
    setGroupId(_groupId);
    setGroupTitle(_groupTitle);
    setModal(!modal);
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

      let btnAddNewProposal = (
        <div>
          <Button
            onClick={() => showModalAddProposal(group.id, group.title)}
            color="primary"
          >
            Add New Proposal
          </Button>
          <br />
          <br />
          <br />
        </div>
      );
      proposalsToAdd.push(btnAddNewProposal);

      for (const [idx, proposalId] of proposalsIds.entries()) {
        let proposal = await voterContract.getProposalById(proposalId);
        let votesOnProposal = await voterContract.getProposalVotesById(
          proposalId
        );
        proposalsToAdd.push(
          <div>
            <hr />
            <p>Proposal {idx + 1}</p>
            <h4>{proposal.title}</h4>
            <p>{proposal.description}</p>
            <p>Votes on this proposal: {votesOnProposal.toNumber()}</p>
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
      <h2>Admin Control</h2>
      <p>
        Here, if you are the owner of the contract, you are able to create new
        groups, proposals and get how many votes there's on each proposal.
      </p>
      <p>
        Non admin users can't add nothing new. Just can see the
        groups/proposals/votes
      </p>

      <p>contract address: {CONTRACT_TOKEN}</p>
      <hr />
      <h3>Create Group</h3>
      <form className="form-style">
        <input
          type="text"
          className="input-style"
          onChange={handleInputChange}
          name="groupTitle"
          placeholder="Title"
          value={inputValue.groupTitle}
        />
        <br />
        <br />
        <textarea
          type="text"
          className="input-style"
          onChange={handleInputChange}
          name="groupDescription"
          placeholder="Description"
          value={inputValue.groupDescription}
        />
        <br />
        <Button className="btn-purple" onClick={createNewGroup} color="success">
          Create new Group
        </Button>
      </form>
      <hr />
      <h3>Groups</h3>
      {renderGroups}
      <div
        style={{
          display: "block",
          width: 700,
          padding: 30,
        }}
      >
        <Modal isOpen={modal} toggle={toggle}>
          <ModalBody>
            <h3>
              Add new proposal for group <i>{groupTitle} </i>
            </h3>
            <form className="form-style">
              <input
                type="text"
                className="input-style"
                onChange={handleInputChange}
                name="proposalTitle"
                placeholder="Title"
                value={inputValue.proposalTitle}
              />
              <br />
              <br />
              <textarea
                type="text"
                className="input-style"
                onChange={handleInputChange}
                name="proposalDescription"
                placeholder="Description"
                value={inputValue.proposalDescription}
              />
              <br />
              <Button
                className="btn-purple"
                onClick={createNewProposal}
                color="primary"
              >
                Create new proposal
              </Button>
            </form>
          </ModalBody>
        </Modal>
      </div>
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
