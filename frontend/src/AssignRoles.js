import React, { useState, useEffect } from "react";
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";
import Loader from './Loader';
import { useNavigate } from "react-router-dom";

function AssignRoles() {
  const navigate = useNavigate();
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, []);
  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [RMSname, setRMSname] = useState();
  const [MANname, setMANname] = useState();
  const [DISname, setDISname] = useState();
  const [RETname, setRETname] = useState();
  const [RMSplace, setRMSplace] = useState();
  const [MANplace, setMANplace] = useState();
  const [DISplace, setDISplace] = useState();
  const [RETplace, setRETplace] = useState();
  const [RMSaddress, setRMSaddress] = useState();
  const [MANaddress, setMANaddress] = useState();
  const [DISaddress, setDISaddress] = useState();
  const [RETaddress, setRETaddress] = useState();
  const [RMS, setRMS] = useState();
  const [MAN, setMAN] = useState();
  const [DIS, setDIS] = useState();
  const [RET, setRET] = useState();

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
      const rmsCtr = await supplychain.methods.rmsCtr().call();
      const rms = {};
      for (i = 0; i < rmsCtr; i++) {
        rms[i] = await supplychain.methods.RMS(i + 1).call();
      }
      setRMS(rms);
      const manCtr = await supplychain.methods.manCtr().call();
      const man = {};
      for (i = 0; i < manCtr; i++) {
        man[i] = await supplychain.methods.MAN(i + 1).call();
      }
      setMAN(man);
      const disCtr = await supplychain.methods.disCtr().call();
      const dis = {};
      for (i = 0; i < disCtr; i++) {
        dis[i] = await supplychain.methods.DIS(i + 1).call();
      }
      setDIS(dis);
      const retCtr = await supplychain.methods.retCtr().call();
      const ret = {};
      for (i = 0; i < retCtr; i++) {
        ret[i] = await supplychain.methods.RET(i + 1).call();
      }
      setRET(ret);
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
  const handlerChangeAddressRMS = (event) => {
    setRMSaddress(event.target.value);
  };
  const handlerChangePlaceRMS = (event) => {
    setRMSplace(event.target.value);
  };
  const handlerChangeNameRMS = (event) => {
    setRMSname(event.target.value);
  };
  const handlerChangeAddressMAN = (event) => {
    setMANaddress(event.target.value);
  };
  const handlerChangePlaceMAN = (event) => {
    setMANplace(event.target.value);
  };
  const handlerChangeNameMAN = (event) => {
    setMANname(event.target.value);
  };
  const handlerChangeAddressDIS = (event) => {
    setDISaddress(event.target.value);
  };
  const handlerChangePlaceDIS = (event) => {
    setDISplace(event.target.value);
  };
  const handlerChangeNameDIS = (event) => {
    setDISname(event.target.value);
  };
  const handlerChangeAddressRET = (event) => {
    setRETaddress(event.target.value);
  };
  const handlerChangePlaceRET = (event) => {
    setRETplace(event.target.value);
  };
  const handlerChangeNameRET = (event) => {
    setRETname(event.target.value);
  };
  const handlerSubmitRMS = async (event) => {
    event.preventDefault();
    try {
      var reciept = await SupplyChain.methods
        .addRMS(RMSaddress, RMSname, RMSplace)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
  const handlerSubmitMAN = async (event) => {
    event.preventDefault();
    try {
      var reciept = await SupplyChain.methods
        .addManufacturer(MANaddress, MANname, MANplace)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
  const handlerSubmitDIS = async (event) => {
    event.preventDefault();
    try {
      var reciept = await SupplyChain.methods
        .addDistributor(DISaddress, DISname, DISplace)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
  const handlerSubmitRET = async (event) => {
    event.preventDefault();
    try {
      var reciept = await SupplyChain.methods
        .addRetailer(RETaddress, RETname, RETplace)
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
      <div className="d-flex justify-content-between align-items-center mb-4"><i className="bi bi-capsule bi-success"></i>
        <span><b>Current Account Address:</b> {currentaccount}</span>
        <button onClick={redirect_to_home} className="btn btn-outline-danger btn-sm">HOME</button>
      </div>
  
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title"><i className="bi bi-person-fill me-2 text-success"></i>Raw Material Suppliers</h5>
          <form onSubmit={handlerSubmitRMS} className="mb-3">
            <input type="text" className="form-control mb-2" onChange={handlerChangeAddressRMS} placeholder="Ethereum Address" required />
            <input type="text" className="form-control mb-2" onChange={handlerChangeNameRMS} placeholder="Raw Material Supplier Name" required />
            <input type="text" className="form-control mb-2" onChange={handlerChangePlaceRMS} placeholder="Based In" required />
            <button type="submit" className="btn btn-outline-success w-100">Register</button>
          </form>
          <table className="table table-bordered table-sm">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Place</th>
                <th>Ethereum Address</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(RMS).map(key => (
                <tr key={key}>
                  <td>{RMS[key].id}</td>
                  <td>{RMS[key].name}</td>
                  <td>{RMS[key].place}</td>
                  <td>{RMS[key].addr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title"><i className="bi bi-tools me-2 text-success"></i>Manufacturers</h5>
          <form onSubmit={handlerSubmitMAN} className="mb-3">
            <input type="text" className="form-control mb-2" onChange={handlerChangeAddressMAN} placeholder="Ethereum Address" required />
            <input type="text" className="form-control mb-2" onChange={handlerChangeNameMAN} placeholder="Manufacturer Name" required />
            <input type="text" className="form-control mb-2" onChange={handlerChangePlaceMAN} placeholder="Based In" required />
            <button type="submit" className="btn btn-outline-success w-100">Register</button>
          </form>
          <table className="table table-bordered table-sm">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Place</th>
                <th>Ethereum Address</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(MAN).map(key => (
                <tr key={key}>
                  <td>{MAN[key].id}</td>
                  <td>{MAN[key].name}</td>
                  <td>{MAN[key].place}</td>
                  <td>{MAN[key].addr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title"><i className="bi bi-truck me-2 text-success"></i>Distributors</h5>
          <form onSubmit={handlerSubmitDIS} className="mb-3">
            <input type="text" className="form-control mb-2" onChange={handlerChangeAddressDIS} placeholder="Ethereum Address" required />
            <input type="text" className="form-control mb-2" onChange={handlerChangeNameDIS} placeholder="Distributor Name" required />
            <input type="text" className="form-control mb-2" onChange={handlerChangePlaceDIS} placeholder="Based In" required />
            <button type="submit" className="btn btn-outline-success w-100">Register</button>
          </form>
          <table className="table table-bordered table-sm">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Place</th>
                <th>Ethereum Address</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(DIS).map(key => (
                <tr key={key}>
                  <td>{DIS[key].id}</td>
                  <td>{DIS[key].name}</td>
                  <td>{DIS[key].place}</td>
                  <td>{DIS[key].addr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title"><i className="bi bi-shop me-2 text-success"></i>Retailers</h5>
          <form onSubmit={handlerSubmitRET} className="mb-3">
            <input type="text" className="form-control mb-2" onChange={handlerChangeAddressRET} placeholder="Ethereum Address" required />
            <input type="text" className="form-control mb-2" onChange={handlerChangeNameRET} placeholder="Retailer Name" required />
            <input type="text" className="form-control mb-2" onChange={handlerChangePlaceRET} placeholder="Based In" required />
            <button type="submit" className="btn btn-outline-success w-100">Register</button>
          </form>
          <table className="table table-bordered table-sm">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Place</th>
                <th>Ethereum Address</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(RET).map(key => (
                <tr key={key}>
                  <td>{RET[key].id}</td>
                  <td>{RET[key].name}</td>
                  <td>{RET[key].place}</td>
                  <td>{RET[key].addr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
}

export default AssignRoles;
