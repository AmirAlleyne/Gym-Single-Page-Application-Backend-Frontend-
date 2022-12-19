import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate } from "react-router-dom";
import '../../index.css'
import {Card, Table} from "react-bootstrap";
import Button from 'react-bootstrap/Button';


function ViewPastPayments(){
    const history = useNavigate();
    const [payments, setPaymentHistory] = useState([])
    const axios = useAxiosPrivate();

    useEffect(()=>{
        axios.get('http://127.0.0.1:8000/subscriptions/payment_history/')
            .then(res =>{
                // console.log(res)
                console.log(res.data)
                setPaymentHistory(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    },[])

    return (
        <div>
            {
                payments.map(pay => (

                    <Card style={{ width: '100%' }} className="cards-list">
                        <Card.Body>
                            <Card.Title>Review your past payments</Card.Title>
                            <Table bordered hover>
                                <tbody>
                                <tr>
                                    <td>Payment Amount</td>
                                    <td>{pay.amount}</td>
                                </tr>
                                <tr>
                                    <td>Payment Date</td>
                                    <td>{pay.payment_date}</td>
                                </tr>
                                <tr>
                                    <td>Next Billing Date</td>
                                    <td>{pay.next_billing_date}</td>
                                </tr>
                                </tbody>
                            </Table>
                            <Card.Footer>
                                Recurrence: You will be billed every {pay.days_for_next_payment} day(s)
                            </Card.Footer>
                        </Card.Body>
                    </Card>
                ))
            }

<Button style={{position:"fixed",bottom:"0"}} onClick={(e) => history("/accounts/profile", { replace: true })} > Go Back</Button>
        </div>
    )
}
export default ViewPastPayments