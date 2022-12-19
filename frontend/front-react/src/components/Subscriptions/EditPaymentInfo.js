import React from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useRef, useState, useEffect, useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
const EDIT_URL = "/subscriptions/edit_payments/"

const EditMembership = () => {
    const history = useNavigate();
    const [user, setUser] = useState('');
    const [card_number, setCard_number] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVV, setCardCVV] = useState('');
    const axios = useAxiosPrivate();
    const errRef = useRef();

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);


    useEffect(()=>{
        axios.get('http://127.0.0.1:8000/subscriptions/payment_info/')
            .then(res =>{
                console.log(res)
                // setMembership(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    },[])
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let formData = new FormData();
            formData.append('email', user.email)
            formData.append('card_number', card_number)
            formData.append('card_expiry', cardExpiry)
            formData.append('card_cvv_code', cardCVV)

            const response = await axios.post(EDIT_URL, formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                }
            );

            console.log(formData);
            console.log(response.data);
            const roles = response?.data?.roles;
            setUser('');
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
            } else {
                setErrMsg('Edit Subscription Failed');
            }
            errRef.current.focus();
        }
    } // end of handle form submit to API
    return (
        <>
            {success ? (
                <section>
                    <h1>You have edited your payment info!</h1>
                    {history('/accounts/profile/')}
                    <br/>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Edit Payments</h1>
                    <Form onSubmit={handleSubmit}>
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
                        <Button style={{ width: '100%' }} type="submit">Edit Payment Information</Button>
                    </Form>
                </section>
            )}
        </>
    )
}

export default EditMembership
