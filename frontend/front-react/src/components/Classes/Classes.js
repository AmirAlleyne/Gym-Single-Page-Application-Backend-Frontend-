import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom';

function Classes(props) {
    const navigate = useNavigate();
    
    function handleClick(event, c_id) {
        event.preventDefault();
        navigate("/classes/" + c_id, {replace: true})
    }
    return (
        <ul className='list-group mb-4'>
            {
                props.classes.map(clas => (
                    <Card style={{ width: '18rem' }} className='list-group-item' key={clas.id} >
                        <Card.Body>
                            <Card.Title>{clas.name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{clas.coach}</Card.Subtitle>
                            <Card.Text>{clas.keywords}</Card.Text>
                            <Card.Link href="#">Card Link</Card.Link>
                            <Button variant="primary" onClick={event => handleClick(event, clas.id)}>View Info</Button>
                        </Card.Body>
                    </Card>
                ))
            }
        </ul>
    );
}

export default Classes;