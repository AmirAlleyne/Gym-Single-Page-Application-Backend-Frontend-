import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {Card, Table} from 'react-bootstrap';

import { useNavigate } from "react-router-dom";

function ViewMembership(){
    const [membership, setMembership] = useState([])
    const axios = useAxiosPrivate();

    useEffect(()=>{
        axios.get('http://127.0.0.1:8000/subscriptions/membership/')
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
        <div>
             {membership.membership_plan}
        </div>

    )
}
export default ViewMembership