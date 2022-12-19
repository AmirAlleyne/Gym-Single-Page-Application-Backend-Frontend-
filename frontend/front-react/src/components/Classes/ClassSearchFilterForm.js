import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';

function ClassSearchFilterForm(props) {
    const [cname, setCname] = useState('');
    const [c1name, setC1name] = useState('');
    const [c2name, setC2name] = useState('');
    const [c3name, setC3name] = useState('');
    const [d1, setD1] = useState('');
    const [d2, setD2] = useState('');
    const [d3, setD3] = useState('');
    const [stime, setStime] = useState('');
    const [etime, setEtime] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        let url = 'class_name=' + cname + '&coaches=' + c1name + '&coaches=' + c2name + '&coaches=' + c3name + '&dates_allowed=' + d1  + '&dates_allowed=' + d2  + '&dates_allowed=' + d3  + '&start_time=' + stime   + '&end_time=' + etime;
        props.handleaf(url);
        setCname('');
        setC1name('');
        setC2name('');
        setC3name('');
        setD1('');
        setD2('');
        setD3(''); 
        setStime('');
        setEtime('');
    }
    return (
        <Modal
        show={props.show}
        onHide={props.handleClose}
        backdrop="static"
        keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Filter Classes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formClassName">
                        <Form.Label>Class Name</Form.Label>
                        <Form.Control autoComplete="off" type="text" placeholder="Enter Class Name" onChange={e => {setCname(e.target.value)}} value={cname} />
                    </Form.Group>
                    <Row className="mb-3">
                        <Form.Group className="mb-3" controlId="formCOne">
                            <Form.Label>Coach 1</Form.Label>
                            <Form.Control autoComplete="off" type="text" placeholder="Enter Coach Name" onChange={e => {setC1name(e.target.value)}} value={c1name} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formCTwo">
                            <Form.Label>Coach 2</Form.Label>
                            <Form.Control autoComplete="off" type="text" placeholder="Enter Coach Name" onChange={e => {setC2name(e.target.value)}} value={c2name} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formCThr">
                            <Form.Label>Coach 3</Form.Label>
                            <Form.Control autoComplete="off" type="text" placeholder="Enter Coach Name" onChange={e => {setC3name(e.target.value)}} value={c3name} />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group className="mb-3" controlId="formDOne">
                            <Form.Label>Date 1</Form.Label>
                            <Form.Control autoComplete="off" type="text" placeholder="Enter Date (as ddmmyyy)" onChange={e => {setD1(e.target.value)}} value={d1}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDTwo">
                            <Form.Label>Date 2</Form.Label>
                            <Form.Control autoComplete="off" type="text" placeholder="Enter Date (as ddmmyyy)" onChange={e => {setD2(e.target.value)}} value={d2}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDThr">
                            <Form.Label>Date 3</Form.Label>
                            <Form.Control autoComplete="off" type="text" placeholder="Enter Date (as ddmmyyy)" onChange={e => {setD3(e.target.value)}} value={d3}/>
                        </Form.Group>
                    </Row>
                    <Form.Group className="mb-3" controlId="formST">
                        <Form.Label>Start Time</Form.Label>
                        <Form.Control type="text" autoComplete="off" placeholder="Enter Start Time (as hhmm)" onChange={e => {setStime(e.target.value)}} value={stime}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formET">
                        <Form.Label>End Time</Form.Label>
                        <Form.Control type="text" autoComplete="off" placeholder="Enter End Time (as hhmm)" onChange={e => {setEtime(e.target.value)}} value={etime}/>
                    </Form.Group>
                    <Button variant="primary" type="submit" >
                        Apply Filters
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default ClassSearchFilterForm;