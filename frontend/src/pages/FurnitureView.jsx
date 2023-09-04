import axios from 'axios';
import  { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ShowImage from '../components/showImage';
import { useAuth } from '../hooks/useAuth';
import {Link} from 'react-router-dom'



const FurnitureView = () => {
    const navigate = useNavigate();
    const {isAuthed, hasPermissions} = useAuth();

    const {furnitureID} = useParams()
    const [infoFurniture, setInfoFurniture]= useState([]);
    const [woods, setWoods]=useState([]);

    const style ={'maxHeight':'500px', 'maxWidth':'500px'}
    const furniture ={style, infoFurniture}

    useEffect(()=>{
        axios.get(`http://localhost:8080/api/furniture/${furnitureID}`)
        .then(({data})=> {
            setInfoFurniture(data);
            setWoods(data.woods)
            console.log(data.woods);
        })
        .catch(err=> console.log('existio un error', err))
    }, []);

    const deleteFurniture = (id) => {
        axios.delete(`http://localhost:8080/api/delete/${id}`)
            .then(() => {
                navigate('/');
            })
        .catch(err=>console.log(err))
    }
    

    return(
        <div className=' offset-4'>
            <div className='col-lg-6 col-md-6 col-sm-6'>
                <div className='card m-10 mt-2 card-cont' >
                    <ShowImage photoID={infoFurniture._id} furniture={furniture}></ShowImage>
                    <h3 className='font-weight-bold text-uppercase' >{infoFurniture.nameFurniture}</h3>
                    <div className='card col align-self-center'style={{width:'18rem'}}>
                        <p className='font-weight-bold list-group-item h4' >Price: {infoFurniture.price} $</p>
                    </div>
                    <h4 className='text-left font-weight-bold'>Specifications:</h4>
                    <div className='card col align-self-center'style={{width:'18rem'}}>
                        <p className='font-weight-bold list-group-item h5' >Deph: {infoFurniture.depth} cm</p>
                        <p className='font-weight-bold list-group-item h5' >Height: {infoFurniture.height} cm</p>
                        <p className='font-weight-bold list-group-item h5' >Length: {infoFurniture.length} cm</p>
                        <p className='font-weight-bold list-group-item h5' >Weight: {infoFurniture.weight} cm </p>
                    </div>
                    <h4 className='text-left font-weight-bold'>Woods:</h4>
                    <div className='card col align-self-center' style={{width:'18rem'}}>
                        <ul className="list-group  ">
                            {
                                woods.map((wood,idx)=>(
                                    <li className='list-group-item ' key={idx}>
                                        <p className='font-weight-bold text-uppercase h5' > {wood}</p>
                                    </li>
                                ))
                            }

                        </ul>

                    </div>
                    <div>
                        {
                            (isAuthed() && hasPermissions('admin'))?
                            <button className='btn btn-danger'style={{marginTop:'10px'}} onClick={()=>deleteFurniture(furnitureID)}>Delete</button>:<></>
                        }
                        {
                            (isAuthed() && hasPermissions('admin'))?
                            <Link to={`/update/${furnitureID}`} className='btn btn-primary'style={{marginTop:'10px'}}>Update</Link>:<></>

                        }
                    </div>
                </div>

            </div>

        </div>
    );

}

export default FurnitureView;