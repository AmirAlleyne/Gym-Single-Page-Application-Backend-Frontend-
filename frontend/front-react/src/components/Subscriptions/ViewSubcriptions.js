import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate } from "react-router-dom";
import { Card, Button } from 'react-bootstrap';

import '../../App.css'

function ViewSubscriptions(){
    const history = useNavigate();
    const [plans, setPlans] = useState([])
    // console.log(plans)
    // console.log(setPlans)
    const axios = useAxiosPrivate();

    useEffect(()=>{
        axios.get('http://127.0.0.1:8000/subscriptions/plans/')
            .then(res =>{
                // console.log(res)
                console.log(res.data)
                setPlans(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    },[])

    function moveToSubscribe(e) {
        e.preventDefault();
        history('/subscriptions/subscribe/');
    }

    function moveToEditSubscriptions(e) {
        e.preventDefault();
        history('/subscriptions/edit_membership/');
    }

    return (
        <>
            <div className="cards-list">
                {
                    plans.map(plan => (

                        <Card style={{ width: '20rem' }} className="sub-cards">
                            <div key={plan.name}>
                                <Card.Body >
                                    <Card.Title>{plan.name}</Card.Title>
                                    <Card.Text>Cost of the Plan: ${plan.cost_per_unit} per {plan.length_in_days} days</Card.Text>
                                </Card.Body>
                            </div>
                        </Card>
                    ))
                }
                <Button style={{ width: '20rem' }} onClick={moveToSubscribe}>Sign Up</Button>
                Already have an account and changed your mind?
                <Button style={{ width: '20rem' }} onClick={moveToEditSubscriptions}>Edit your current plan</Button>
            </div>
        </>

    )
}
export default ViewSubscriptions