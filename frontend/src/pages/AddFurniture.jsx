import axios from "axios";
import { useEffect,useRef,useState } from "react";
const AddFurniture = () => {
  const cloudinaryRef = useRef()
  const widgetRef = useRef()
  const [furniture, setFurniture] = useState({
    nameFurniture: "",
    height: "",
    length: "",
    depth: "",
    weight: "",
    woods: "", // este va ser un array
    category: "",
    price: "",
    photo: "",
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
    setFurniture({ ...furniture, formData: new FormData() });
    //setFurniture({ ...furniture });
    axios.get(`http://localhost:8080/api/categories`)
      .then(({ data }) =>
        setFurniture({
          ...furniture,
          categories: data,
          formData: new FormData(),
        })

      )
      .catch((err) => setFurniture({ ...furniture, error: err }));
  }, []);

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
    axios.post(`http://localhost:8080/api/registerfurniture`, data)
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
            <h2 className="mb-4">Add a Furniture</h2>
            {loading  && <div className="alert alert-success"><h2>Loading ...</h2></div>}

            <form className="mb-3" onSubmit={SubmitFurniture}>
              <h4>Post Photo</h4>
              <div className="form-group">
                <label className="btn btn-secondary">
                  <input
                    onChange={handleChange}
                    type="text"
                    name="photo"

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
                value={"Create Furniture"}
                type={"submit"}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddFurniture;
