import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import './llf.css';

const Llf = () => {
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState('');

  const [equipmentItems, setEquipmentItems] = useState([]);
  const [equipmentNumber, setEquipmentNumber] = useState('');
  const [description, setDescription] = useState('');
  const [spares, setSpares] = useState('');
  const resetForm = () => {
    setMessage('');
    setEquipmentNumber('');
    setCategories('');
    setEquipmentItems([]);
    setDescription('');
    setSpares('');
  };
  useEffect(() => {
    if (categories) {
      axios
        .get('http://localhost:8800/api/equipmentitems', {
          params: { category: categories },
        })
        .then((res) => {
          setEquipmentItems(res.data);
        });
    }
  }, [categories]);

  useEffect(() => {
    if (equipmentItems.length > 0) {
      setSpares(equipmentItems[0].name);
    }
  }, [equipmentItems]);
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.get('http://localhost:8800/api/equipment/checkNumber', {
        params: { equipmentNumber },
      });
  
      if (response.data.notExists) {
        setMessage('No equipment found');
        setTimeout(() => {
          resetForm();
        }, 3000);
      } else {
        axios
          .post('http://localhost:8800/api/llf', {
            equipmentNumber,
            spares,
            description,
          })
          .then((res) => {
            setMessage('Data successfully added');
            setTimeout(() => {
              resetForm();
            }, 3000);
          })
          .catch((err) => {
            console.error('Error adding data', err.response.data);
          });
      }
    } catch (err) {
      console.error('Error getting data', err);
    }
  };
  

return (
  <div className="gradientContainer">
    <div className="pageContent">
      <div className="contentWrapper">
        <Container className="llfContainer">
          <Row>
            <Col md={{ span: 6, offset: 3 }}>
              <div className="llfCard">
                <h2 className="llfHeading">LLF Form</h2>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col>
                      <Form.Group controlId="equipmentNumber">
                        <Form.Label>Equipment Number</Form.Label>
                        <Form.Control
                          type="text"
                          value={equipmentNumber}
                          onChange={(e) => setEquipmentNumber(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="category">
                        <Form.Label>Category</Form.Label>
                        <Form.Select value={categories} onChange={(e) => setCategories(e.target.value)} required>
                          <option value="">Select a category</option>
                          <option value="conveyor">Belt Conveyor</option>
                          <option value="idfan">ID Fan</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                    <Form.Group controlId="equipmentItem">
      <Form.Label>Equipment Item</Form.Label>
      <Form.Select value={spares} onChange={(e) => setSpares(e.target.value)} required>
        {equipmentItems.map((item, index) => (
          <option key={index} value={item.name}>
            {item.name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="textBox">
                        <Form.Label>Text Box</Form.Label>
                        <Form.Control
                          type="textbox"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button className="llfButton" variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>
                {message && <p className="message">{message}</p>}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  </div>
);
};
export default Llf;