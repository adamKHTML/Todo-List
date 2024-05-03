import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from './PageHeader';
import styled from 'styled-components';
import axios from 'axios';
import DeleteCompo from './components/DeleteCompo';




const API_ROOT = 'https://greenvelvet.alwaysdata.net/pfc';
const YOUR_TOKEN = 'b8d327aeae00cc1a1cb8fe818fec422c2b317489';

const axiosInstance = axios.create({
  baseURL: API_ROOT,
  headers: {
    'Content-Type': 'application/json',
    'token': YOUR_TOKEN,
  },
});

const getAllChecklistsFromAPI = async () => {
  try {
    const response = await axiosInstance.get('/checklists');
    console.log('API Response (retrieving all checklists):', response.data);
    return response.data.response;
  } catch (error) {
    console.error('Error retrieving all checklists:', error.response.data);
    throw error;
  }
};

const Dashboard = () => {



  const [checklists, setChecklists] = useState([]);

  const fetchChecklists = async () => {
    try {
      const checklistsData = await getAllChecklistsFromAPI();
      setChecklists(checklistsData);
    } catch (error) {
      console.error('Error retrieving all checklists:', error);
    }
  };

  useEffect(() => {
    fetchChecklists();
  }, []);

  const handleDeleteSuccess = (deletedChecklistId) => {
    // Met à jour l'état pour supprimer la checklist supprimée
    setChecklists((prevChecklists) =>
      prevChecklists.filter((checklist) => checklist.id !== deletedChecklistId)
    );

    // Gére la réussite après la suppression de la checklist.
    console.log('Checklist deleted successfully');
  };

  const handleDeleteError = () => {
    //Gére l'erreur après la suppression de la checklist.
    console.error('Error deleting checklist');
  };

  return (
    <>
      <GlobalStyles>
        <Header />
        <Headreview>
          <div className="col-title banner-info-bg">
            <h5>Welcome to Pre Flight Checklist <br /> The to-do list device for Web Developers</h5>
            <img src="/images/Checklist.png" alt="Dev Logo SVG" className="img-fluid radius-image-curve" />
          </div>
        </Headreview>
        <TopContainer>
          <Link to="/formulaire" style={{ textDecoration: 'none', color: 'inherit' }}>
            <button type="button" className="btn btn-dark">
              Add
            </button>
          </Link>
        </TopContainer>
        <ChecklistContainer>
          {Array.isArray(checklists) && checklists.length > 0 ? (
            checklists.map((checklist) => (
              <div key={checklist.id}>
                <Link to={`/checklist/${checklist.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Card border="primary" style={{ width: '18rem', margin: '10px' }} className="checklist-card">
                    <CardHeader >{checklist.title}</CardHeader>
                    <CardBody >
                      <Card.Text>{checklist.description}</Card.Text>
                      {checklist.todo && Array.isArray(checklist.todo) && checklist.todo.length > 0 ? (
                        <ListGroup as="ul">
                          {checklist.todo.map((task, index) => (
                            <ListGroup.Item
                              key={index}
                              as="li"
                              className={`d-flex justify-content-between align-items-start ${task.statut === 1 ? 'task-done' : ''
                                }`}
                            >
                              <div className="ms-2 me-auto">
                                <div className={`fw-bold ${task.statut === 1 ? 'done-task' : ''}`}>{task.name}</div>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      ) : (
                        <p>No tasks available for this checklist.</p>
                      )}
                    </CardBody>
                  </Card>
                </Link>
                <div>
                  <DeleteCompo
                    checklistId={checklist.id}
                    onDeleteSuccess={handleDeleteSuccess}
                    onDeleteError={handleDeleteError}
                  />
                </div>
              </div>
            ))
          ) : (
            <p>No checklists available.</p>
          )}
        </ChecklistContainer>


      </GlobalStyles>
    </>
  );

};


const GlobalStyles = styled.div`
  font-size: 100%;
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const Headreview = styled.div`
  min-height: calc(100vh - 20px);
  position: relative;
  z-index: 0;
  display: grid;
  align-items: center;
  padding: 3em 0;
  background: #614da7;
  justify-items: center;
  width: 100%;
  margin: 0;

  .col-title {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;

    h5 {
      color: #fff;
      font-size: 52px;
      line-height: 1.1;
      font-weight: 400;
      margin-right: 20px;
    }

    .img-fluid {
      max-width: 100%;
      height: auto;
      margin-left: auto;
      margin-right: auto;
      width: 200px;
    }
  }
`;

const TopContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;

  .btn-dark {
    margin: 2.35em 8em 0 5.60em;
    height: 59px;
    width: 179px;
  }

  .btn-dark:hover {
    background-color: #ffd166;
  }
`;



const ChecklistContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  
 
  .checklist-card:hover {
    transform: scale(1.1); 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
   
    
  }
  

  .task-done {
    background-color: #4caf50; 
  }

  .done-task {
    color: #fff;
  }

`;



export default Dashboard;
