import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from './Loader';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Supply() {
  const navigate = useNavigate();
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, []);

  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [MED, setMED] = useState();
  const [MedStage, setMedStage] = useState();
  const [ID, setID] = useState();

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
  const handlerChangeID = (event) => {
    setID(event.target.value);
  };
  const handlerSubmitRMSsupply = async (event) => {
    event.preventDefault();
    try {
      var reciept = await SupplyChain.methods
        .RMSsupply(ID)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
  const handlerSubmitManufacturing = async (event) => {
    event.preventDefault();
    try {
      var reciept = await SupplyChain.methods
        .Manufacturing(ID)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
  const handlerSubmitDistribute = async (event) => {
    event.preventDefault();
    try {
      var reciept = await SupplyChain.methods
        .Distribute(ID)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
  const handlerSubmitRetail = async (event) => {
    event.preventDefault();
    try {
      var reciept = await SupplyChain.methods
        .Retail(ID)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
  const handlerSubmitSold = async (event) => {
    event.preventDefault();
    try {
      var reciept = await SupplyChain.methods
        .sold(ID)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
return (
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span><b>Current Account Address:</b> {currentaccount}</span>
          <button onClick={redirect_to_home} className="btn btn-outline-danger btn-sm">
            <i className="bi bi-house-fill me-2"></i>HOME
          </button>
        </div>
  
        <div className="mb-4">
          <h6 className="text-primary"><i className="bi bi-diagram-3-fill me-2"></i><b>Supply Chain Flow:</b></h6>
          <p>Medicine Order → Raw Material Supplier → Manufacturer → Distributor → Retailer → Consumer</p>
        </div>
  
        <div className="table-responsive mb-5">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th scope="col">Medicine ID</th>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">Current Processing Stage</th>
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
  
        <div className="mb-4">
          <h5 className="text-success"><i className="bi bi-box-arrow-in-right me-2"></i><b>Step 1: Supply Raw Materials</b></h5>
          <p>(Only a registered Raw Material Supplier can perform this step):</p>
          <form onSubmit={handlerSubmitRMSsupply} className="mb-3">
            <div className="input-group">
              <input 
                type="text" 
                className="form-control" 
                onChange={handlerChangeID} 
                placeholder="Enter Medicine ID" 
                required 
              />
              <button type="submit" className="btn btn-outline-success">
                <i className="bi bi-check-lg me-2"></i>Supply
              </button>
            </div>
          </form>
        </div>
        <hr />
  
        <div className="mb-4">
          <h5 className="text-success"><i className="bi bi-tools me-2"></i><b>Step 2: Manufacture</b></h5>
          <p>(Only a registered Manufacturer can perform this step):</p>
          <form onSubmit={handlerSubmitManufacturing} className="mb-3">
            <div className="input-group">
              <input 
                type="text" 
                className="form-control" 
                onChange={handlerChangeID} 
                placeholder="Enter Medicine ID" 
                required 
              />
              <button type="submit" className="btn btn-outline-success">
                <i className="bi bi-check-lg me-2"></i>Manufacture
              </button>
            </div>
          </form>
        </div>
        <hr />
  
        <div className="mb-4">
          <h5 className="text-success"><i className="bi bi-truck me-2"></i><b>Step 3: Distribute</b></h5>
          <p>(Only a registered Distributor can perform this step):</p>
          <form onSubmit={handlerSubmitDistribute} className="mb-3">
            <div className="input-group">
              <input 
                type="text" 
                className="form-control" 
                onChange={handlerChangeID} 
                placeholder="Enter Medicine ID" 
                required 
              />
              <button type="submit" className="btn btn-outline-success">
                <i className="bi bi-check-lg me-2"></i>Distribute
              </button>
            </div>
          </form>
        </div>
        <hr />
  
        <div className="mb-4">
          <h5 className="text-success"><i className="bi bi-shop-window me-2"></i><b>Step 4: Retail</b></h5>
          <p>(Only a registered Retailer can perform this step):</p>
          <form onSubmit={handlerSubmitRetail} className="mb-3">
            <div className="input-group">
              <input 
                type="text" 
                className="form-control" 
                onChange={handlerChangeID} 
                placeholder="Enter Medicine ID" 
                required 
              />
              <button type="submit" className="btn btn-outline-success">
                <i className="bi bi-check-lg me-2"></i>Retail
              </button>
            </div>
          </form>
        </div>
        <hr />
  
        <div className="mb-4">
          <h5 className="text-success"><i className="bi bi-bag-check me-2"></i><b>Step 5: Mark as Sold</b></h5>
          <p>(Only a registered Retailer can perform this step):</p>
          <form onSubmit={handlerSubmitSold} className="mb-3">
            <div className="input-group">
              <input 
                type="text" 
                className="form-control" 
                onChange={handlerChangeID} 
                placeholder="Enter Medicine ID" 
                required 
              />
              <button type="submit" className="btn btn-outline-success">
                <i className="bi bi-check-lg me-2"></i>Sold
              </button>
            </div>
          </form>
        </div>
        <hr />
      </div>
    );
  }
  
  export default Supply;  