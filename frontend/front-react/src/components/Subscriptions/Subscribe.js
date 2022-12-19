import React from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useRef, useState, useEffect, useContext } from 'react';
import {useNavigate} from "react-router-dom";
import { Button, Form } from 'react-bootstrap';

const SUBSCRIBE_URL = "/subscriptions/subscribe/"

export const Subscribe = () => {
    const axios = useAxiosPrivate();
    const errRef = useRef();
    const history = useNavigate();
    const userRef = useRef();

    // all request fields
    const [user, setUser] = useState('')
    const [membership, setMembership] = useState();
    const [plans, setPlans] = useState([])
    const [card_number, setCard_number] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVV, setCardCVV] = useState('');
    const [error, setErrorpage] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(()=>{
        axios.get('http://127.0.0.1:8000/subscriptions/plans/')
            .then(res =>{
                console.log(res)
                setPlans(res.data)
            })
            .catch(err => {
                console.log(err)
               
            })
    },[])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let formData = new FormData();
            formData.append('user', user[0])
            formData.append('membership_plan', membership)
            formData.append('card_number', card_number)
            formData.append('card_expiry', cardExpiry)
            formData.append('card_cvv_code', cardCVV)

            const response = await axios.post(SUBSCRIBE_URL, formData,
                {
                    headers: {'Content-Type': 'multipart/form-data'},
                    withCredentials: true
                }
            );
            const accessToken = response?.data?.accessToken;
            console.log("hello", formData);
            // console.log(response.data);

            setUser('');
            setMembership('');
            setCard_number('');
            setCardExpiry('');
            setCardCVV('');
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Data, please complete full form');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
                console.log('hi')
               
            } else {
                setErrMsg('Subscription Failed');
            }
            // errRef.current.focus();
        }
    }    // end of handle form submit to API

    const handleClick = (e) => {
      history("/accounts/login", { replace: true });
    }
    const handleText = async (e) => {
        e.preventDefault()
        console.log(e.target.value)
        setMembership(e.target.value)
    }
    function moveToEditSubscription(e) {
        e.preventDefault();
        history('/subscriptions/edit_membership/');
    }

    return (
        <>
        {error?(
            <div class="text">
              <h1>401 Error</h1>  
            <h2>You Do Not Have Access To This Page</h2>
            <h2 onClick={handleClick} style={{color:"Blue"}}>Click Here To Login </h2>
            
               
          </div>

        ):   success ? (
                <section>
                    {history('/accounts/profile/')}
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Subscribe</h1>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label htmlFor="membership">Choose membership plan</Form.Label>
                            <Form.Select id="membership" onChange={handleText}>
                                <option>--select from options below--</option>
                                {
                                    plans.map(plan => (
                                        <option value={plan.name}>{plan.name}</option>))
                                }
                            </Form.Select>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="card_number">Card Number</Form.Label>
                            <Form.Control
                                type="text"
                                id="card_number"
                                onChange={(e) => setCard_number(e.target.value)}
                                required/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="card_expiry">Card Expiry Date</Form.Label>
                            <Form.Control
                                type="text"
                                id="card_expiry"
                                onChange={(e) => setCardExpiry(e.target.value)}
                                required/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="card_cvv_code">Card CVV Code</Form.Label>
                            <Form.Control
                                type="text"
                                id="card_cvv_code"
                                onChange={(e) => setCardCVV(e.target.value)}
                                required/>
                        </Form.Group>
                        <br/>
                        <Button style={{ width: '100%' }} variant="primary" type="submit">Subscribe</Button>
                    </Form>
                </section>
            )}
        </>
    )
}

export default Subscribe