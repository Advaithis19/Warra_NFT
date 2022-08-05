import React, { useState } from "react";
import axios from "axios";

const Home = () => {
  const [custName, setCustName] = useState("");
  const [custContact, setCustContact] = useState("");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [serial, setSerial] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [warranty, setWarranty] = useState("");

  const handleSubmit = async () => {
    let postData = new FormData();
    postData.append("customer_name", custName);
    postData.append("phone_no", custContact);
    postData.append("name", itemName);
    postData.append("description", description);
    postData.append("serial_no", serial);
    postData.append("brand", brand);
    postData.append("model", model);
    postData.append("duration", warranty);
    postData.append("issue_date", new Date());
    postData.append(
      "receiver_address",
      "0xCe96404fbe1D8A5420012A7Ac747bC77eeB6e51d"
    );

    axios
      .post(`https://sheltered-ocean-65232.herokuapp.com/api/mint/`, postData)
      .then(() => {
        alert(
          "e-Warranty successfully generated and sent to customer's smartphone!"
        );
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <div className="container">
      <div className="py-5 text-center">
        <img
          className="d-block mx-auto mb-4"
          src="data:image/png;base64,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"
          alt=""
          width={72}
          height={72}
        />
        <h2>Create an e-Warranty</h2>
        <p className="lead">
          Welcome! Fill in the fields below to generate an e-Warranty
          certificate for your product
        </p>
      </div>
      <div className="row">
        <div className="col-md-4 order-md-2 mb-4">
          <h4 className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted">Customer information</span>
          </h4>
          <ul className="list-group mb-3">
            <li className="list-group-item d-flex justify-content-between lh-condensed">
              <div>
                <h6 className="my-0 mb-2">Name</h6>
                <div className="col-md-12 mb-3">
                  <input
                    type="text"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="form-control"
                    id="name"
                    required
                  />
                </div>
              </div>
            </li>
            <li className="list-group-item d-flex justify-content-between lh-condensed">
              <div>
                <h6 className="my-0 mb-2">Contact #</h6>
                <div className="col-md-12 mb-3">
                  <input
                    type="text"
                    value={custContact}
                    onChange={(e) => setCustContact(e.target.value)}
                    className="form-control"
                    id="contact"
                    required
                  />
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-md-8 order-md-1">
          <h4 className="mb-3">Item information</h4>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="firstName">Name</label>
              <input
                type="text"
                className="form-control"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                id="itemName"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="lastName">Serial #</label>
              <input
                type="text"
                className="form-control"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                id="serialNumber"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="address">Description</label>
            <input
              type="text"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="description"
              placeholder="Short description of the product"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="address">Brand</label>
            <input
              type="text"
              className="form-control"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              id="brandName"
              placeholder="eg. Panasonic"
              required
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="model">Model</label>
              <input
                type="text"
                className="form-control"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                id="model"
                placeholder="eg. ER417K44B"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="term">Warranty term</label>
              <input
                type="number"
                className="form-control"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                id="term"
                placeholder="Time to expiry (in days)"
                required
              />
            </div>
          </div>

          <hr className="mb-4" />
          <button
            className="btn btn-primary btn-lg btn-block"
            onClick={handleSubmit}
          >
            Generate NFT!
          </button>
        </div>
      </div>
      <footer className="my-5 pt-5 text-muted text-center text-small">
        <p className="mb-1">© 2021-2022 The NFT Guys</p>
        <ul className="list-inline">
          <li className="list-inline-item">
            <a href="#">Privacy</a>
          </li>
          <li className="list-inline-item">
            <a href="#">Terms</a>
          </li>
          <li className="list-inline-item">
            <a href="#">Support</a>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default Home;
