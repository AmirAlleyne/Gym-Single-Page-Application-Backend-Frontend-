import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

const Studios = ({ studios, loading }) => {
  const navigate= useNavigate();

  if (loading) {
    return <h2>Loading...</h2>;
  }
  const handleClick = async (id, e) => {
    e.preventDefault();
    navigate("/studios/" + id, { replace: true });
  }
 
  const handleCClick = async (id, e) => {
    e.preventDefault();
    navigate("/studios/" + id + "/classes", { replace: true });    
  }
  return (
    <ul className='list-group mb-4'>
      {
                    
                    studios.map(studio => (
                        <Card style={{ width: '40rem' }} className='list-group-item'>
                        <Card.Body>
                          <Card.Title>{studio.name}</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">{studio.address}</Card.Subtitle>
                          <Card.Text >
                            {studio.amenities?.map((amen, ind) => (
                                <p> {amen}:{studio.qamenities[ind]} </p>))}
                          </Card.Text>
                          <div class="button-group ">                
                            <Button variant="primary" onClick={(e) => handleClick(studio.pk, e)}>View Info</Button>
                            <Button variant="primary" onClick={(e) => handleCClick(studio.pk, e)}>View Classes</Button>        
                          </div>
                        </Card.Body>
                      </Card>
                         
                       
                       
                    ))
        }
    </ul>
  );
};

export default Studios;