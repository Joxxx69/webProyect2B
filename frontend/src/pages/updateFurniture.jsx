import axios from "axios";
import { useEffect,useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const UpdateFurniture = () => {
    const navigate = useNavigate();
    const { furnitureID } = useParams()
    const [loaded,setLoaded] = useState(false)

  const [furniture, setFurniture] = useState({
    nameFurniture: '',
    height: '',
    length: '',
    depth: '',
    weight: '',
    woods: '', // este va ser un array  
    category: '',
    price: '',
    photo: '',
    categories: [],
    formData: new FormData(),
    loading: false,
    error: "",
  });
  const {
    nameFurniture,
    woods,
    category,
    price,
    photo,
    categories,
    loading,
    error,
    formData,
    height,
    length,
    depth,
    weight,
  } = furniture;

  useEffect(() => {
      axios.get(`http://localhost:8080/api/furniture/${furnitureID}`)
          .then(({ data }) => {
              setFurniture({
                  height: data.height,
                  nameFurniture: data.nameFurniture,
                  depth: data.depth,
                  length: data.length,
                  weight: data.weight,
                  woods: data.woods, // este va ser un array
                  category: data.category,
                  price: data.price,
                  photo: data.photo,
                  categories: [],
                  formData: new FormData(),
                  loading: false,
                  error: "",
              });
              setLoaded(true);
          })
          .catch(err => console.log(err));
          axios.get(`http://localhost:8080/api/categories`)
              .then(({ data }) => {
                      setFurniture({
                        ...furniture,
                        categories: data,
                        formData: new FormData(),
                      })  
                    
              }
        
            )
            .catch((err) => setFurniture({ ...furniture, error: err }));
  },[loaded])    


  const handleChange = (e) => {

    switch (e.target.name) {  
      case "photo":
        console.log(e.target.value);
        formData.set('photo', e.target.value);
        setFurniture({ ...furniture, [e.target.name]: e.target.value });
        break;
      case "woods":
        setFurniture({
          ...furniture,
          [e.target.name]: e.target.value.split(","),
        });
        const woods = e.target.value.split(",");
        formData.set(e.target.name, e.target.value);
        break;

      default:
        formData.set(e.target.name, e.target.value);
        setFurniture({ ...furniture, [e.target.name]: e.target.value });
        break;
    }
  };



  const SubmitFurniture = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(formData);
    setFurniture({ ...furniture, error: "", loading: true });
    console.log("este es el form data", data);
    axios.put(`http://localhost:8080/api/updateFurniture/${furnitureID}`, data)
      .then(({data}) => {
        console.log(data);
          setFurniture({
            ...furniture,
            nameFurniture: "",
            height: "",
            length: "",
            depth: "",
            weight: "",
            woods: "",
            formData:new FormData(),
            category: "",
            price: "",
            photo: "",
            loading: false,
          })
        })
      .catch((err) => console.log("existe un error", err));
  };

  return (
    <>
      <div className="conatiner mt-5">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <h2 className="mb-4">Update  Furniture</h2>
            {loading  && <div className="alert alert-success"><h2>Loading ...</h2></div>}

            <form className="mb-3" onSubmit={SubmitFurniture}>
              <h4>Post Photo</h4>
              <div className="form-group">
                <label className="btn btn-secondary">
                  <input
                    onChange={handleChange}
                    type="text"
                    name="photo"
                    value={photo}
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  name="nameFurniture"
                  value={nameFurniture}
                  required
                />
              </div>
              <div className="form-group">
                <label className="text-muted">Category</label>
                <select
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                                  name="category"
                                  value={category}
                  required
                >
                  <option>Select Category</option>
                  {categories &&
                    categories.map((c, i) => (
                      <option key={i} value={c._id}>
                        {c.nameCategory}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group col-md-3">
                  <label className="text-muted">height</label>
                  <input
                    onChange={handleChange}
                    type="number"
                    className="form-control"
                    value={height}
                    name={"height"}
                    required
                  />
                </div>
                <div className="form-group col-md-3">
                  <label className="text-muted">length</label>
                  <input
                    onChange={handleChange}
                    type="number"
                    className="form-control"
                    value={length}
                    name={"length"}
                    required
                  />
                </div>
                <div className="form-group col-md-3">
                  <label className="text-muted">depth</label>
                  <input
                    onChange={handleChange}
                    type="number"
                    className="form-control"
                    value={depth}
                    name={"depth"}
                    required
                  />
                </div>
                <div className="form-group col-md-3">
                  <label className="text-muted">weight</label>
                  <input
                    onChange={handleChange}
                    type="number"
                    className="form-control"
                    value={weight}
                    name={"weight"}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="text-muted">Price</label>
                <input
                  onChange={handleChange}
                  type="number"
                  className="form-control"
                  value={price}
                  name={"price"}
                  required
                />
              </div>
              <div className="form-group">
                <label className="text-muted">woods</label>
                <input
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  value={woods}
                  name={"woods"}
                  placeholder={"wood1,wood2,wood3,wood4..."}
                  required
                />
                          </div>
                          
              <input
                className="btn btn-primary"
                value={"Update Furniture"}
                              type={"submit"}
                          />
                          <Link to={'/'} className="btn btn-danger">Cancel</Link>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateFurniture;
