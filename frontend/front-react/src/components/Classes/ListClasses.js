import { useRef, useState, useEffect, useContext } from 'react';
// import axios from 'axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Link, useParams } from "react-router-dom";
import Classes from './Classes';
import axios from '../axios/axios';
import Button from 'react-bootstrap/Button';
import Pagination from '../Pagination';

function ListClasses(props) {
    const URL = 'http://127.0.0.1:8000/' + props.url;
    const [classes, setClasses] = useState([]);
    const axios = useAxiosPrivate();
    const [currentPage, setCurrentPage] = useState(1);
    const classesPerPage = 5;

    useEffect(() => {
        axios.get(URL)
            .then(res => {
                setClasses(res.data.results);
            })
            .catch(err => {
                console.log(err)
            })
    }, []);

    const indexOfLastPost = currentPage * classesPerPage;
    const indexOfFirstPost = indexOfLastPost - classesPerPage;
    const currentclasses = classes.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = pageNumber => setCurrentPage(pageNumber);

        return (
            <div>
                <h1>{props.title}</h1>
                <Classes classes={currentclasses} />
                <Pagination
                  studiosPerPage={classesPerPage}
                  totalstudios={classes.length}
                  paginate={paginate}
                />
            </div>
        );
}

export default ListClasses;