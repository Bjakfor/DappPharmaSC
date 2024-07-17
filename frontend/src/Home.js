import React from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Home.css';
import Footer from './Footer';

function Home() {
  const navigate = useNavigate();

  const redirect_to_roles = () => {
    navigate("/roles");
  };

  const redirect_to_addmed = () => {
    navigate("/addmed");
  };

  const redirect_to_supply = () => {
    navigate("/supply");
  };

  const redirect_to_track = () => {
    navigate("/track");
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container py-5 flex-grow-1">
        <div className="text-center mb-5">
          <h1 className="display-4"><i className="bi bi-capsule bi-success"></i> Pharmaceutical Supply Chain</h1>
          <p className="lead">Welcome to the pharmaceutical supply chain using blockchain and smart contracts technology.</p>
        </div>
        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <div className="card text-center">
              <div className="card-body">
                <i className="bi bi-person-plus bi-success display-4 mb-3"></i>
                <h5 className="card-title">Register Roles</h5>
                <p className="card-text">Register Raw material suppliers, Manufacturers, Distributors, and Retailers.</p>
                <button
                  onClick={redirect_to_roles}
                  className="btn btn-outline-success btn-sm"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="card text-center">
              <div className="card-body">
                <i className="bi bi-bag-plus bi-success display-4 mb-3"></i>
                <h5 className="card-title">Order Medicines</h5>
                <p className="card-text">Order medicines from various suppliers.</p>
                <button
                  onClick={redirect_to_addmed}
                  className="btn btn-outline-success btn-sm"
                >
                  Order Medicines
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="card text-center">
              <div className="card-body">
                <i className="bi bi-gear-fill bi-success display-4 mb-3"></i>
                <h5 className="card-title">Control Supply Chain</h5>
                <p className="card-text">Manage and control the supply chain effectively.</p>
                <button
                  onClick={redirect_to_supply}
                  className="btn btn-outline-success btn-sm"
                >
                  Control Supply Chain
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="card text-center">
              <div className="card-body">
                <i className="bi bi-truck bi-success display-4 mb-3"></i>
                <h5 className="card-title">Track Medicines</h5>
                <p className="card-text">Track the status and location of medicines.</p>
                <button
                  onClick={redirect_to_track}
                  className="btn btn-outline-success btn-sm"
                >
                  Track Medicines
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;