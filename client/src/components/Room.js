import React, { useState } from "react";
import { Modal, Button, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";

function Room({ room, fromdate, todate }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function Room(props) {
    let stars = "⭐️".repeat(Math.floor(props.room.Ratings));
    if (props.room.Ratings % 1 > 0) {
      stars += "½";
    }

    return (
      <div className="row bs">
        <div className="col-md-4">
          <img src={props.room.imageurls[0]} className="smallimg" alt="Room" />
        </div>
        <div className="col-md-7 text-left">
          <h1>{props.room.name}</h1>
          <b>
            <p>Max Count: {props.room.maxcount}</p>
            <p>PhoneNumber: {props.room.phonenumber}</p>
            <p>Type: {props.room.type}</p>
            <p>Ratings: {stars}</p>
          </b>
          <div style={{ float: "right" }}>
            {fromdate && todate && (
              <Link to={`/book/${props.room._id}/${fromdate}/${todate}`}>
                <button className="btn btn-primary mr-2">Book Now</button>
              </Link>
            )}

            <button className="btn btn-primary" onClick={handleShow}>
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Room room={room} />
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{room.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel data-bs-theme="dark" prevLabel="" nextLabel="">
            {room.imageurls.map((url, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100 bigimg"
                  src={url}
                  alt={`Room ${index + 1}`}
                />
              </Carousel.Item>
            ))}
          </Carousel>
          <p>{room.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Room;
