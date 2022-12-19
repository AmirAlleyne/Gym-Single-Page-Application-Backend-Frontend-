import { useRef, useState, useEffect, useContext } from 'react';
// import axios from 'axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import "./studios.css"
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Pagination from '../Pagination';
import Studios from './Studios';
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import StudioSearchFilterForm from './StudioSearchFilterForm';

var center2 =0;
navigator.geolocation.getCurrentPosition(function(position) {
    center2 = { lat: parseFloat(position.coords.latitude), lng: parseFloat(position.coords.longitude)}
    
    
  });
function Mappy({data}) {
    let stus= []
    let names= []
    data.map(studio=>(
        stus.push({ lat: parseFloat(studio.latitude), lng: parseFloat(studio.longitude)})
    ))
    data.map(studio=>(
        names.push(studio.name)
    ))
    
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBVrm30GZbw9SPS9D6yK4xR6vQ5AMX0giE",
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map data= {stus} names = {names}/>;
}

function Map({data, names}) {
    


  return (
   
    <div className="bottomPane">
  
    <Marker position={center2} />
    <GoogleMap zoom={15} center={center2} mapContainerClassName="map-container" mapContainerStyle={{maxWidth: "50vw",
        height: "600px"}} >
   
      {
          data.map((mrkr,ind) =>(
              
            <Marker position={mrkr} />
          ))
      }  
      
    </GoogleMap>
    </div>
    
    
  );
}

function FetchStudios(){
  const [studios, setStudios] = useState([]);
    const axios = useAxiosPrivate();
    const [success, setSuccess] = useState(true);
    const [errMsg, setErrMsg] = useState('');
    const errRef = useRef();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [studiosPerPage] = useState(3);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [clear, setClear] = useState(false);

    function handleFilter() {
        setShow(true);
    }
    function handleClose() {
        setShow(false);
    }
    function handleClearFilters() {
        setClear(!clear);
    }
    function handleApplyFilters(url) {
      setShow(false);
      axios.get('http://127.0.0.1:8000/studios/search?' + url)
        .then(res => {
          setStudios(res.data.results);
        })
        .catch(err => {
          console.log(err)
        });
    }
    const handleClick = (e) => {
      navigate("/accounts/login", { replace: true });
  }

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/studios/all/')
      .then(res => {
        setStudios(res.data)
        setLoading(false);
            
      })
      .catch(err => {
        if (!err?.response) {
          setErrMsg('No Server Response');
        } else if (err.response?.status === 400) {
          setErrMsg('Missing Data, please complete full form');
        } else if (err.response?.status === 401) {
          setErrMsg('Unauthorized');
          setSuccess(false);
        } else {
          setErrMsg('Login Failed');
        }
        errRef.current?.focus();
      })
  }, [clear]);

  const indexOfLastPost = currentPage * studiosPerPage;
  const indexOfFirstPost = indexOfLastPost - studiosPerPage;
  const currentstudios = studios.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = pageNumber => setCurrentPage(pageNumber);
    
    return (
        <>
        {success ? (
        <section>
          <h1>All Studios</h1>   
          <Button variant="primary" type="submit" onClick={handleFilter}>
              Filter
          </Button>
          <Button variant="secondary" type="submit" onClick={handleClearFilters}>
              Clear Filters
          </Button>
          <div className="splitScreen" style={{bottom:"20px"}}>
            <div className="topPane">
              <Studios studios={currentstudios} loading={loading} />     
                <Pagination
                studiosPerPage={studiosPerPage}
                totalstudios={studios.length}
                paginate={paginate}
              />    
            </div>
            <Mappy data= {studios}/>
          </div>
          <StudioSearchFilterForm show={show} handleClose={handleClose} handleaf={handleApplyFilters} /> 
          <Button style={{position:"fixed",bottom:"0"}} onClick={(e) => navigate(-1)} > Go Back</Button>
         </section>
        ):(
          <div class="text">
              <h1>401 Error</h1>  
            <h2>You Do Not Have Access To This Page</h2>
            <h2 onClick={handleClick} style={{color:"Blue"}}>Click Here To Login </h2>
          </div>
        )
        }
    
    </>
    );
}



export default FetchStudios