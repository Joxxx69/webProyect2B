import Navbar from './components/Navbar'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import MainPage from './pages/MainPage'
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import {AuthProvider, useAuth} from './hooks/useAuth'
import {CookiesProvider} from 'react-cookie'
import CreateCategory from './pages/Category';
import AddFurniture from './pages/AddFurniture';
import FurniturePrice from './pages/FurnituresPrices';
import SearchFurnitures from './pages/SearchFurnitures';
import FurnitureView from './pages/FurnitureView';
import UpdateFurniture from './pages/updateFurniture';

function App() {

  return (
    <div className='App'>

       <CookiesProvider>
          <AuthProvider>
            <Navbar/>
            <Routes>
              <Route path='/' element={<MainPage/>}/>
              <Route path='/login' element={<Signin/>}/>
              <Route path='/register' element={<Signup/>}/>
              <Route path='/registerFurniture' element={<RequireAuth permission={'admin'}> <AddFurniture/> </RequireAuth> }></Route>
              <Route path='/registerCategory' element={<RequireAuth permission={'admin'} > <CreateCategory/> </RequireAuth>}></Route>
              <Route path='/furniture/price/range' element={<FurniturePrice/>}></Route>
              <Route path='/search/furniture' element={<SearchFurnitures/>} />
              <Route path='/view/furniture/:furnitureID' element={<FurnitureView/>} />
              <Route path='/update/:furnitureID' element={<UpdateFurniture/>} />
            </Routes>
          </AuthProvider>
        </CookiesProvider>
    </div>
  )
}

function RequireAuth({children,permission}) {
  const {isAuthed, hasPermissions} =useAuth();
  const location = useLocation();

  const getAllowedComponent =()=>{
    console.log('estos son los permisos',permission)
    if(hasPermissions(permission)){
      return children;
    }else{
      return (
        <div className='container'>
          <div className='font-weight-bold h1'>access denied</div>
        </div>
      );
    }
  }

  console.log('este es location.pathname', location.pathname)
  return (isAuthed())? (
    getAllowedComponent()
  ) : (
    <Navigate to='/signup' replace state={{path: location.pathname}}></Navigate>
  )

}


export default App
