import { useEffect, useState } from "react";
import axios from "axios";
import CardFurnitures from "../components/sliderCards/Card";
import { Link } from "react-router-dom";

const MainPage = () => {
  const [listFurniture, setListFurniture] = useState([]);
  const [listCategories, setListCategories]=useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/furnitures')
      .then(({ data }) => setListFurniture(data))
      .catch(err=> console.log(err))

  }, []);

  useEffect(() => {
    axios.get('http://localhost:8080/api/categories')
      .then(({ data }) => setListCategories(data))
      .catch(err=> console.log(err))
  }, []);


  return (
    <div>
      <>
        <div className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-light">
          <div className="col-md-5 p-lg-5 mx-auto my-5">
            <h1 className="display-4 font-weight-normal">Furnitures</h1>
            <p className="lead font-weight-normal">
              look for your furniture by price range, it is the best option to choose your comfort.
            </p>
            <Link className="btn btn-outline-secondary" to={'/furniture/price/range'}>Search Furnitures</Link>
          </div>
          <div className="product-device box-shadow d-none d-md-block"></div>
          <div className="product-device product-device-2 box-shadow d-none d-md-block"></div>
        </div>

        <CardFurnitures listFurniture={listFurniture} listCategories={listCategories} ></CardFurnitures>
     
      </>
    </div>
  );
};

export default MainPage;
