import  { useEffect, useState } from 'react'
import axios from 'axios';

const ShowImage = ({photoID, furniture}) => {
    const [loaded, setLoaded] = useState(false);
    const [image, setImage] = useState('');

    
    useEffect(()=>{
        axios.get(`http://localhost:8080/api/photofurniture/${photoID}`)
            .then(({ data }) => {
                console.log('photo', data);
                setImage(data)
                setLoaded(true)
            })
        .catch(err => console.log(err))
    },[photoID])
    

    return(
        <div>
        { loaded &&  <img src={image} alt={furniture.nameFurniture} 
                style={{height:'280px', maxWidth:'230px'}}
            />
        }
        </div>
    );
}

export default ShowImage;





