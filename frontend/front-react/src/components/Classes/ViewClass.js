import { useRef, useState, useEffect, useContext } from 'react';
// import axios from 'axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Link, useParams } from "react-router-dom";
import ClassCard from './ClassCard';

function FetchClass(){
    const [clas, SetClas] = useState([])
    const [enrolled, SetEnrolled] = useState([])
    const axios = useAxiosPrivate();
    const { c_id } = useParams(); 
    const url = 'http://127.0.0.1:8000/studios/classes/' + c_id + '/';
    const [dispText, setDispText] = useState();

    function setter(err) {
        if (!err?.response) {
            setDispText('No Server Response.');
        } else if (err.response?.status === 403) {
            setDispText('Forbidden, ensure you have a valid active subscription.');
        } else if (err.response?.status === 401) {
            setDispText('Unauthorized, please login.');
        } else {
            setDispText('UserMembership does not exist OR No space left in the class!');
        }
    }
    function handleEnrol() {
        axios.get('http://127.0.0.1:8000/studios/' + clas.id + '/enroll/')
        .then(res =>{
            setDispText('You have been enrolled in the class!');
        })
        .catch(err => {setter(err)})
    }
    function handleDrop() {
        axios.get('http://127.0.0.1:8000/studios/' + clas.id + '/drop/')
        .then(res =>{
            setDispText('You have dropped the class!');
        })
        .catch(err => {setter(err)})
    }
    function handleEnrolAll() {
        axios.get('http://127.0.0.1:8000/studios/' + clas.id + '/enrollall/')
        .then(res =>{
            setDispText('You have been enrolled in this weekly class!');
        })
        .catch(err => {setter(err)})
    }
    function handleDropAll() {
        axios.get('http://127.0.0.1:8000/studios/' + clas.id + '/dropall/')
        .then(res =>{
            setDispText('You have been dropped this weekly class!');
        })
        .catch(err => {setter(err)})
    }

    useEffect(() => {
        axios.get(url)
            .then(res => {
                SetClas(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [dispText]);

    return ( 
        <div>
            <ClassCard clas={clas} dispText={dispText}
                handleEnrol={handleEnrol} handleEnrolAll={handleEnrolAll}
                handleDrop={handleDrop} handleDropAll={handleDropAll} />
        </div>
    )
}
export default FetchClass