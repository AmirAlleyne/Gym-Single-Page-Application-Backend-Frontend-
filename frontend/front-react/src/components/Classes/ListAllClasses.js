import { useRef, useState, useEffect, useContext } from 'react';
// import axios from 'axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Link, useParams } from "react-router-dom";
import Classes from './Classes';
import axios from '../axios/axios';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import ClassSearchFilterForm from './ClassSearchFilterForm';
import Pagination from '../Pagination';

function ListAllClasses() {
    var URL = 'http://127.0.0.1:8000/studios/classes/all/';
    const [classes, setClasses] = useState([]);
    const axios = useAxiosPrivate();
    const [show, setShow] = useState(false);
    const [clear, setClear] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const classesPerPage = 10;

    function handleFilter() {
        setShow(true);
    }
    function handleClose() {
        setShow(false);
    }
    function handleClearFilters() {
        setClear(!clear);
    }

    function handleApplyFilters(url) {
        URL = 'http://127.0.0.1:8000/studios/classes/search?' + url;
        setShow(false);
        axios.get(URL)
            .then(res => {
                setClasses(res.data.results);
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        axios.get(URL)
            .then(res => {
                setClasses(res.data.results);
            })
            .catch(err => {
                console.log(err)
            })
    }, [clear]);

    const indexOfLastPost = currentPage * classesPerPage;
    const indexOfFirstPost = indexOfLastPost - classesPerPage;
    const currentclasses = classes.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = pageNumber => setCurrentPage(pageNumber);
    
    return (
        <div>
            <h1>All Classes</h1>
            <Row>
                <Button variant="primary" type="submit" onClick={handleFilter}>
                    Filter
                </Button>
                <Button variant="secondary" type="submit" onClick={handleClearFilters}>
                    Clear Filters
                </Button>
            </Row>
            <Classes classes={currentclasses} />
            <Pagination
                  studiosPerPage={classesPerPage}
                  totalstudios={classes.length}
                  paginate={paginate}
                /> 
            <ClassSearchFilterForm show={show} handleClose={handleClose} handleaf={handleApplyFilters} />
        </div>
    );
}

export default ListAllClasses;