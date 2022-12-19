import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';

function StudioSearchFilterForm(props) {
    const [sname, setSname] = useState('');
    const [a1, setA1] = useState('');
    const [a2, setA2] = useState('');
    const [a3, setA3] = useState('');
    const [c1name, setC1name] = useState('');
    const [c2name, setC2name] = useState('');
    const [c3name, setC3name] = useState('');
    const [co1, setCo1] = useState('');
    const [co2, setCo2] = useState('');
    const [co3, setCo3] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        let url = 'studio_name=' + sname + '&amenities=' + a1 + '&amenities=' + a2 + '&amenities=' + a3 + '&class_names=' + c1name + '&class_names=' + c2name + '&class_names=' + c3name + '&coaches=' + co1 + '&coaches=' + co2 + '&coaches=' + co3;
        props.handleaf(url);
        setSname('');
        setA1('');
        setA2('');
        setA3(''); 
        setC1name('');
        setC2name('');
        setC3name('');
        setCo1('');
        setCo2('');
        setCo3(''); 
    }
    return (
        <Modal
        show={props.show}
        onHide={props.handleClose}
        backdrop="static"
        keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Filter Studios</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formStudioName">
                        <Form.Label>Studio Name</Form.Label>
                        <Form.Control autoComplete="off" type="text" placeholder="Enter Studio Name" onChange={e => {setSname(e.target.value)}} value={sname} />
                    </Form.Group>
                    <Row className="mb-3">
                        <Form.Group className="mb-3" controlId="formAmenOne">
                            <Form.Label>Amenity 1</Form.Label>
                            <Form.Control autoComplete="off" type="text" placeholder="Enter Amenity Name" onChange={e => {setA1(e.target.value)}} value={a1} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formAmenTwo">
                            <Form.Label>Amenity 2</Form.Label>
                            <Form.Control autoComplete="off" type="text" placeholder="Enter Amenity Name" onChange={e => {setA2(e.target.value)}} value={a2} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formAmenThr">
                            <Form.Label>Amenity 3</Form.Label>
                            <Form.Control autoComplete="off" type="text" placeholder="Enter Amenity Name" onChange={e => {setA3(e.target.value)}} value={a3} />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group className="mb-3" controlId="formClassOne">
                            <Form.Label>Class 1</Form.Label>
                            <Form.Control autoComplete="off" type="text" placeholder="Enter Class Name" onChange={e => {setC1name(e.target.value)}} value={c1name} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formClassTwo">
                            <Form.Label>Class 2</Form.Label>
                            <Form.Control autoComplete="off" type="text" placeholder="Enter Class Name" onChange={e => {setC2name(e.target.value)}} value={c2name} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formClassThr">
                            <Form.Label>Class 3</Form.Label>
                            <Form.Control autoComplete="off" type="text" placeholder="Enter Class Name" onChange={e => {setC3name(e.target.value)}} value={c3name} />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group className="mb-3" controlId="formCoachOne">
                            <Form.Label>Coach 1</Form.Label>
                            <Form.Control autoComplete="off" type="text" placeholder="Enter Coach Name" onChange={e => {setCo1(e.target.value)}} value={co1} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formCoachTwo">
                            <Form.Label>Coach 2</Form.Label>
                            <Form.Control autoComplete="off" type="text" placeholder="Enter Coach Name" onChange={e => {setCo2(e.target.value)}} value={co2} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formCoachThr">
                            <Form.Label>Coach 3</Form.Label>
                            <Form.Control autoComplete="off" type="text" placeholder="Enter Coach Name" onChange={e => {setCo3(e.target.value)}} value={co3} />
                        </Form.Group>
                    </Row>
                    <Button variant="primary" type="submit" >
                        Apply Filters
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default StudioSearchFilterForm;