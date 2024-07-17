import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import Loader from './Loader';
import SupplyChainABI from "./artifacts/SupplyChain.json";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function AddMed() {
  const navigate = useNavigate();
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, []);

  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [MED, setMED] = useState();
  const [MedName, setMedName] = useState();
  const [MedDes, setMedDes] = useState();
  const [MedStage, setMedStage] = useState();

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadBlockchaindata = async () => {
    setloader(true);
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    setCurrentaccount(account);
    const networkId = await web3.eth.net.getId();
    const networkData = SupplyChainABI.networks[networkId];
    if (networkData) {
      const supplychain = new web3.eth.Contract(
        SupplyChainABI.abi,
        networkData.address
      );
      setSupplyChain(supplychain);
      var i;
      const medCtr = await supplychain.methods.medicineCtr().call();
      const med = {};
      const medStage = [];
      for (i = 0; i < medCtr; i++) {
        med[i] = await supplychain.methods.MedicineStock(i + 1).call();
        medStage[i] = await supplychain.methods.showStage(i + 1).call();
      }
      setMED(med);
      setMedStage(medStage);
      setloader(false);
    } else {
      window.alert("The smart contract is not deployed to current network");
    }
  };
  if (loader) {
    return (
      <div>
        <h1 className="wait"><Loader /></h1>
      </div>
    );
  }
  const redirect_to_home = () => {
    navigate("/");
  };
  const handlerChangeNameMED = (event) => {
    setMedName(event.target.value);
  };
  const handlerChangeDesMED = (event) => {
    setMedDes(event.target.value);
  };
  const handlerSubmitMED = async (event) => {
    event.preventDefault();
    try {
      var reciept = await SupplyChain.methods
        .addMedicine(MedName, MedDes)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <span><b>Current Account Address:</b> {currentaccount}</span>
        <button onClick={redirect_to_home} className="btn btn-outline-danger btn-sm">
          <i className="bi bi-house-fill me-2"></i>HOME
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title"><i className="bi bi-file-medical-fill me-2 text-success"></i>Add Medicine Order</h5>
          <form onSubmit={handlerSubmitMED} className="mb-3">
            <div className="mb-3">
              <input 
                type="text" 
                className="form-control" 
                onChange={handlerChangeNameMED} 
                placeholder="Medicine Name" 
                required 
              />
            </div>
            <div className="mb-3">
              <input 
                type="text" 
                className="form-control" 
                onChange={handlerChangeDesMED} 
                placeholder="Medicine Description" 
                required 
              />
            </div>
            <button type="submit" className="btn btn-outline-success w-100">
              <i className="bi bi-cart-fill me-2"></i>Order
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title"><i className="bi bi-list-check me-2 text-success"></i>Ordered Medicines</h5>
          <table className="table table-bordered table-sm">
            <thead className="table-light">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">Current Stage</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(MED).map(key => (
                <tr key={key}>
                  <td>{MED[key].id}</td>
                  <td>{MED[key].name}</td>
                  <td>{MED[key].description}</td>
                  <td>{MedStage[key]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AddMed;