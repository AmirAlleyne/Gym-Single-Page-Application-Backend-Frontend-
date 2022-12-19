import { useRef, useState, useEffect, useContext } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {useParams} from "react-router-dom";
import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

function FetchStudio(){
    const info = useParams();
    const navigate = useNavigate();
    const [ims, setIms] = useState([]);  
    const [studio, setStudio] = useState([]);
    const axios = useAxiosPrivate();
    const URL =  'http://127.0.0.1:8000/studios/' +info['id'] + '/'
    
    const handleClick2 = ( e) => {
      e.preventDefault();
      navigate("/studios/all", { replace: true });
      
  } 

    useEffect(()=>{
        axios.get(URL)
        .then(res =>{
            setStudio(res.data)
            setIms(res.data.images)
            console.log( res.data.images)
            
        })
        .catch(err => {
            console.log(err)
        })
    },[])

  
   
    return (
        
        <>
        
    <Card style={{ width: '100%' }} className="cards-list">  
    <Card.Title>{studio.name}</Card.Title>
    
    <Table bordered hover>
                        <tbody>
                        <tr>
                            <td>Address:</td>
                            <td>{studio.address}</td>
                        </tr>
                        <tr>
                            <td>Location</td>
                            <td>({studio.latitude},{studio.longitude})</td>
                        </tr>
                        <tr>
                            <td>Directions</td>
                            <td><a href={studio.directions} style={{color:"Blue"}}> Click Here</a></td>
                        </tr>
                        </tbody>
                            
                    </Table>
                    
   
   
    <div>
    <Carousel variant='dark'>
    {
      ims.map(img =>(

       <Carousel.Item>
        <img
          className="d-block w-100"
          src={"http://127.0.0.1:8000"+img}
          alt="First slide"
        />
        
      </Carousel.Item>
      ))
    }
        </Carousel>

    </div>
   
    <Button style={{position:"fixed",bottom:"0"}} onClick={(e) => handleClick2(e)} > Go Back</Button>
    </Card>
    </>
        );
 }
export default FetchStudio

// hi - {studio.images}
    
//         <ImageGallery items={Immy(ims)}  />