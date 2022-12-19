import React from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useRef, useState, useEffect, useContext } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
const EDIT_URL = "/subscriptions/edit_membership/"

const EditMembership = () => {
    const history = useNavigate();
    const [show, setShow] = useState(false);
    const [user, setUser] = useState([])
    const [membership, setMembership] = useState()
    const [plans, setPlans] = useState([])
    const axios = useAxiosPrivate();
    const errRef = useRef();
    const navigate = useNavigate();
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setErrorpage] = useState(false);

    useEffect(()=>{
        axios.get('http://127.0.0.1:8000/subscriptions/plans/')
            .then(res =>{
                console.log(res)
                setPlans(res.data)
            })
            .catch(err => {
                setErrorpage(true);
    
                console.log(err)
            })
    },[])

    // the handle change image function has an event e

    useEffect(()=>{
        axios.get('http://127.0.0.1:8000/subscriptions/membership/')
            .then(res =>{
                console.log(res)
                setMembership(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    },[])

    const handleText = async (e) => {
        e.preventDefault()
        console.log(e.target.value)
        setMembership(e.target.value)
    }
     const handleClick = (e) => {
      navigate("/accounts/login", { replace: true });
  }
    const handleCancelMembership = async (e) => {
        e.preventDefault()
        axios.get('http://127.0.0.1:8000/subscriptions/cancel_membership/')
            .then(res =>{
                console.log(res)
                setMembership(res.data)

            })
            .catch(err => {
                console.log(err)
            })
        setShow(true)
        history('/accounts/profile/')
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let formData = new FormData();
            const mem = JSON.stringify(membership);
            const json = JSON.parse(mem);
            formData.append('email', user.email)
            formData.append('membership_plan', membership)
            console.log(JSON.parse(JSON.stringify(membership)))

            const response = await axios.post(EDIT_URL, formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                }
            );

            console.log([...formData])
            console.log(response.data);
            const roles = response?.data?.roles;
            setMembership('');
            setSuccess(true)
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
        {error?(
            
          <div class="text">
              <h1>401 Error</h1>  
            <h2>You Do Not Have Access To This Page</h2>
            <h2 onClick={handleClick} style={{color:"Blue"}}>Click Here To Login </h2>
            
               
          </div>
   
      
        
        ):
            success ? (
                <section>
                    {/*<h1>You have edited your subs!</h1>*/}
                    {history('/accounts/profile/')}
                    <br/>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Change your Membership Plan here</h1>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="membership"></Form.Label>
                            <Form.Select id="membership" onChange={handleText}>
                                <option>--select from options below--</option>
                                {
                                    plans.map(plan => (
                                        <option value={plan.name}>{plan.name}</option>))
                                }
                            </Form.Select>
                        </Form.Group>
                        <Button style={{ width: '100%' }} type="submit">Submit</Button>
                    </Form>
                    <h2>OR</h2>
                    <Alert show={show} variant="danger" onClose={() => setShow(false)} dismissible>
                        <Alert.Heading>Are you sure you want to cancel your subscription?</Alert.Heading>
                        <p>Your subscription will remain active until the end of your period. You will have to
                            resubscribe after that!</p>
                        <hr />
                        <div className="d-flex justify-content-end">
                            <Button onClick={handleCancelMembership} variant="danger">Yes, I'm sure</Button>
                        </div>
                    </Alert>

                    {!show && <Button style={{ width: '100%', background: '#3043a1' }}
                                      onClick={() => setShow(true)}>Cancel Membership</Button>}
                </section>
            )
        }
    
        </>
    )
}

export default EditMembership
