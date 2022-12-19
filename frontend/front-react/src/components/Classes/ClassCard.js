import React, { useState } from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom';
import { MDBCol, MDBBtn, MDBBadge, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBListGroup, MDBListGroupItem, MDBTypography} from 'mdb-react-ui-kit';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

function ClassCard(props) {
    var clas = props.clas
    const axios = useAxiosPrivate();

    return (
        <MDBContainer>
            <MDBCard>
                <MDBRow className="g-0">
                    <MDBCol md="3" className="gradient-custom text-center text-white"
                    style={{ background: 'linear-gradient(45deg, rgba(77,170,251, 1), rgba(77,170,251, 1))'}}>
                        <MDBTypography style={{ fontSize: 'x-large'}}>
                            {clas.name}
                            {clas.recurse &&
                                <MDBBadge className='ms-2' style={{ fontSize: 'x-small', verticalAlign: "super"}}>Recurring</MDBBadge>
                            }
                        </MDBTypography>
                        <MDBTypography style={{ fontSize: 'medium'}}>Studio: {clas.studio_name}</MDBTypography>
                        <MDBTypography>Coach: {clas.coach}</MDBTypography>
                        <MDBTypography>Spots Left: {clas.capacity - clas.enrolled_users?.length}</MDBTypography>
                        <div className="d-grid gap-3 mx-auto">
                            <div className="d-grid gap-2 d-md-block mx-auto">
                                <MDBBtn rounded className='me-1' onClick={props.handleEnrol}>
                                    Enrol In Class
                                </MDBBtn>
                                <MDBBtn rounded className='me-1' color='secondary' onClick={props.handleDrop}>
                                    Drop Class
                                </MDBBtn>
                            </div>
                            {clas.recurse &&
                                <div className="d-grid gap-2 col-10 mx-auto">
                                    <MDBBtn rounded className='me-1' onClick={props.handleEnrolAll}>
                                        Enrol In All Recurring Classes
                                    </MDBBtn>
                                    <MDBBtn rounded className='me-1' color='secondary' onClick={props.handleDropAll}>
                                        Drop All Recurring Classes
                                    </MDBBtn>
                                </div> 
                            }   
                        </div>
                        <MDBTypography>{props.dispText}</MDBTypography>
                    </MDBCol>
                    <MDBCol>
                        <MDBCardBody>
                            <MDBTypography tag="h5">Details</MDBTypography>
                            <hr className="mt-0 mb-4" />
                            <MDBRow className="pt-1">
                                <MDBCol size="4" className="mb-3">
                                    <MDBTypography tag="h6">Date</MDBTypography>
                                    <MDBCardText>{clas.date}</MDBCardText>
                                </MDBCol>
                                <MDBCol size="4" className="mb-3">
                                    <MDBTypography tag="h6">Start Time</MDBTypography>
                                    <MDBCardText>{clas.start_time}</MDBCardText>
                                </MDBCol>
                                <MDBCol size="4" className="mb-3">
                                    <MDBTypography tag="h6">End Time</MDBTypography>
                                    <MDBCardText>{clas.end_time}</MDBCardText>
                                </MDBCol>
                            </MDBRow>
                            <hr className="mt-0 mb-4" />
                            <MDBRow>
                                <MDBCol size="6" className="mb-3">
                                    <MDBTypography tag="h6">Description</MDBTypography>
                                    <MDBCardText>{clas.description}</MDBCardText>
                                </MDBCol>
                                <MDBCol size="6" className="mb-3">
                                    <MDBTypography tag="h6">Keywords</MDBTypography>
                                    <MDBListGroup style={{ minWidthL: '22rem' }} light>
                                            {clas.keywords?.split(",").map(keyword => {
                                                return <MDBListGroupItem>{keyword}</MDBListGroupItem>
                                            })}
                                    </MDBListGroup>
                                </MDBCol>
                            </MDBRow>
                        </MDBCardBody>
                    </MDBCol>
                </MDBRow>
            </MDBCard>
        </MDBContainer> 
    );
}
export default ClassCard;