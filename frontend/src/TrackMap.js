import React, { useState, useEffect } from "react";
import Web3 from "web3";
import L from "leaflet";
import SupplyChainABI from "./artifacts/SupplyChain.json";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'leaflet/dist/leaflet.css';
import './TrackMap.css';

function TrackMap({ medicineId }) {
  const [currentAccount, setCurrentAccount] = useState("");
  const [loader, setLoader] = useState(true);
  const [supplyChain, setSupplyChain] = useState();
  const [medicineDetails, setMedicineDetails] = useState(null);

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

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

  const loadBlockchainData = async () => {
    setLoader(true);
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setCurrentAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();
    const networkData = SupplyChainABI.networks[networkId];
    
    if (networkData) {
      const supplyChain = new web3.eth.Contract(SupplyChainABI.abi, networkData.address);
      setSupplyChain(supplyChain);

      if (medicineId) {
        const medicine = await supplyChain.methods.MedicineStock(medicineId).call();
        const supplier = await supplyChain.methods.RMS(medicine.RMSid).call();
        const manufacturer = await supplyChain.methods.MAN(medicine.MANid).call();
        const distributor = await supplyChain.methods.DIS(medicine.DISid).call();
        const retailer = await supplyChain.methods.RET(medicine.RETid).call();
  
        setMedicineDetails({
          medicine,
          supplier,
          manufacturer,
          distributor,
          retailer,
        });

        initializeMap({
          supplier,
          manufacturer,
          distributor,
          retailer,
        });
      }
      setLoader(false);
    } else {
      window.alert("The smart contract is not deployed to current network");
    }
  };

  const initializeMap = (details) => {
    const { supplier, manufacturer, distributor, retailer } = details;

    const locations = [
      { name: 'Supplier', lat: parseFloat(supplier.lat), lng: parseFloat(supplier.lng) },
      { name: 'Manufacturer', lat: parseFloat(manufacturer.lat), lng: parseFloat(manufacturer.lng) },
      { name: 'Distributor', lat: parseFloat(distributor.lat), lng: parseFloat(distributor.lng) },
      { name: 'Retailer', lat: parseFloat(retailer.lat), lng: parseFloat(retailer.lng) },
    ];

    const map = L.map('map').setView([locations[0].lat, locations[0].lng], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    locations.forEach((location, index) => {
      L.marker([location.lat, location.lng])
        .addTo(map)
        .bindPopup(`<b>${location.name}</b><br>${location.lat}, ${location.lng}`);
      
      if (index > 0) {
        const prevLocation = locations[index - 1];
        L.polyline([[prevLocation.lat, prevLocation.lng], [location.lat, location.lng]], {
          color: 'blue',
          weight: 4,
          opacity: 0.6,
          smoothFactor: 1,
        }).addTo(map);
      }
    });
  };

  return (
    <div className="container py-5">
      {loader ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <span><b>Current Account Address:</b> {currentAccount}</span>
            <button onClick={() => window.location.href = '/'} className="btn btn-outline-danger btn-sm">
              <i className="bi bi-house-fill me-2"></i>HOME
            </button>
          </div>
          <div id="map" className="map-container"></div>
        </>
      )}
    </div>
  );
}

export default TrackMap;