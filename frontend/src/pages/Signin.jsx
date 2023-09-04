import axios from 'axios';
import FormLogin from '../components/FormLogin';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'


const Signin = () => {
    const navigate = useNavigate();
    const {login} = useAuth();
    const {state} = useLocation();
    

    

    const LoginUser =(user)=>{
        login(user)
        .then(()=>{
            navigate(state?.path || '/');
        })
        .catch(err=> alert(err,'error en el login'));
    }

    return (
        <>
            <FormLogin onSubmitProp={LoginUser} />
        </>

    
    );
}


export default Signin;