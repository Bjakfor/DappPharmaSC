import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Loader.css'; // Custom styles for loader

function Loader() {
  return (
    <div className="loader-background d-flex justify-content-center align-items-center">
      <div className="custom-loader"></div>
    </div>
  );
}

export default Loader;
