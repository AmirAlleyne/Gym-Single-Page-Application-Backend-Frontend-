import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate } from "react-router-dom";
import '../../index.css'
import { Card, ListGroup, Table } from "react-bootstrap";


function ViewPaymentInfo(){
    const history = useNavigate();
    const [membership, setMembership] = useState([])
    const axios = useAxiosPrivate();

    useEffect(()=>{
        axios.get('http://127.0.0.1:8000/subscriptions/payment_info/')
            .then(res =>{
                // console.log(res)
                console.log(res.data)
                setMembership(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    },[])

    return (
        <div className="cards-list">
            <Card style={{ width: '100%' }} className="sub-cards">
                <Card.Body>
                    <Card.Title>Your current payment details</Card.Title>
                    <Table bordered hover>
                        <tbody>
                        <tr>
                            <td>Card Number</td>
                            <td>{membership.card_number}</td>
                        </tr>
                        <tr>
                            <td>Card Expiry date</td>
                            <td>{membership.card_expiry}</td>
                        </tr>
                        <tr>
                            <td>Card CVV Number</td>
                            <td>{membership.card_cvv_code}</td>
                        </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    )
}
export default ViewPaymentInfo