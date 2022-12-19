import React, { useState, useEffect } from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import mapStyles from "./mapStyles";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function Map() {
  const [selectedStudio, setselectedStudio] = useState(null);
  const [studios, setStudios] = useState([])
  const axios = useAxiosPrivate();

  useEffect(() => {
    const listener = e => {
      if (e.key === "Escape") {
        setselectedStudio(null);
      }
    };
    window.addEventListener("keydown", listener);


    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

   
    useEffect(()=>{
        axios.get('http://127.0.0.1:8000/studios/all/')
        .then(res =>{
            console.log(res)
            setStudios(res.data)
        })
        .catch(err => {
            console.log(err)
        })
    },[])
    console.log(studios)
  return (
    <GoogleMap
      defaultZoom={10}
      defaultCenter={{ lat: 43.6622, lng: 79.3803 }}
        defaultOptions={{ styles: mapStyles }}
    >
      {studios.map(studio => (
        <Marker
          key={studio.id}
          position={{
            lat: studio.latitude,
            lng: studio.longitude
          }}
          onClick={() => {
            setselectedStudio(studio);
          }}
        //   icon={{
        //     url: `/skateboarding.svg`,
        //     scaledSize: new window.google.maps.Size(25, 25)
        //   }}
        />
      ))}

      {selectedStudio && (
        <InfoWindow
          onCloseClick={() => {
            setselectedStudio(null);
          }}
          position={{
            lat: selectedStudio.latitude,
            lng: selectedStudio.longitude
          }}
        >
          <div>
            <h2>{selectedStudio.name}</h2>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

const MapWrapped = withScriptjs(withGoogleMap(Map));

export default function Mapdata() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MapWrapped
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyA4JhR8S78BMBs2bq6CPxfLJ3USe4QZoIY`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
}