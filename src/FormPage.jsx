import React, { useState } from 'react';
import { Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import styled from 'styled-components';
import Header from './PageHeader';
import uniqueId from 'uniqueid';
import axios from 'axios';




const API_ROOT = 'https://greenvelvet.alwaysdata.net/pfc';
const YOUR_TOKEN = 'b8d327aeae00cc1a1cb8fe818fec422c2b317489';

const axiosInstance = axios.create({
    baseURL: API_ROOT,
    headers: {
        'Content-Type': 'application/json',
        'token': YOUR_TOKEN,
    },
});


export const sendChecklistToAPI = async (checklist) => {
    try {
        const response = await axiosInstance.post('/checklist/add', checklist);
        console.log('Réponse de l\'API (ajout de checklist) :', response.data);
        return response.data; // Retourne les données du serveur si nécessaire
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la checklist :', error.response.data);
        throw error;
    }
};

const ChecklistForm = () => {

    const [successMessage, setSuccessMessage] = useState('');

    const [checklistData, setChecklistData] = useState({
        id: uniqueId(),
        name: '',
        description: '',
        status: 0,
        tasks: [],
        currentTask: {},
    });

    const handleAddTask = () => {
        const newTask = {
            id: uniqueId(),
            name: '',
        };

        setChecklistData(prevData => ({
            ...prevData,
            tasks: [...prevData.tasks, newTask],
            currentTask: newTask,
        }));
    };

    const handleSaveTask = () => {
        setChecklistData(prevData => {
            const updatedTasks = prevData.tasks.map((task) =>
                task.id === prevData.currentTask.id ? { ...task, name: prevData.currentTask.name } : task
            );

            return {
                ...prevData,
                tasks: updatedTasks,
                currentTask: {},
            };
        });
    };

    const handleDeleteTask = (taskId) => {
        setChecklistData(prevData => {
            const updatedTasks = prevData.tasks.filter((task) => task.id !== taskId);
            return { ...prevData, tasks: updatedTasks };
        });
    };

    const handleSubmitChecklist = async () => {
        try {
            // Crée la checklist avec les données appropriées
            const checklistToSend = {
                title: checklistData.name,
                description: checklistData.description,
                todo: checklistData.tasks.map(task => ({ name: task.name })),

            };

            // Appel la fonction pour envoyer la checklist à l'API
            const response = await sendChecklistToAPI(checklistToSend);

            // Vérifie si la réponse contient un ID
            if (response && response.id) {
                console.log('Checklist ajoutée avec succès. ID de la checklist :', response.id);


                setSuccessMessage('La checklist a été ajoutée avec succès.');


                setChecklistData({
                    id: uniqueId(),
                    name: '',
                    description: '',
                    status: 0,
                    tasks: [],
                    currentTask: {
                        id: response.id,
                        name: '',
                    },
                });

                // Gestion des réponses du serveur en cas d'erreur
            } else {
                console.error('La réponse de l\'API ne contient pas d\'ID.');

            }
        } catch (error) {

            console.error('Erreur lors de l\'envoi de la checklist :', error);
        }
    };
    return (
        <>

            <Header />
            <FormContain className='form-container'>
                <div className="container">
                    <Form>
                        <h2>Form</h2>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name of the List </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Name"
                                value={checklistData.name}
                                onChange={(e) => setChecklistData({ ...checklistData, name: e.target.value })}
                            />
                        </Form.Group>
                        <InputGroup>
                            <InputGroup.Text>Description</InputGroup.Text>
                            <Form.Control
                                as="textarea"
                                aria-label="With textarea"
                                value={checklistData.description}
                                onChange={(e) => setChecklistData({ ...checklistData, description: e.target.value })}
                            />
                        </InputGroup>
                    </Form>

                    {/* Liste des tâches */}
                    <ul>
                        {checklistData.tasks.map((task, index) => (
                            <li key={index}>
                                {/* Affichage du nom de la tâche */}
                                {checklistData.currentTask.id === task.id ? (
                                    <FormControl
                                        type="text"
                                        value={checklistData.currentTask.name}
                                        onChange={(e) =>
                                            setChecklistData({
                                                ...checklistData,
                                                currentTask: { ...checklistData.currentTask, name: e.target.value },
                                            })
                                        }
                                    />
                                ) : (
                                    <span>{task.name}</span>
                                )}

                                {/* Boutons pour supprimer et enregistrer la tâche */}
                                <div>
                                    <Button variant="danger" onClick={() => handleDeleteTask(task.id)}>
                                        Delete
                                    </Button>

                                    {checklistData.currentTask.id === task.id ? (
                                        <Button variant="success" onClick={handleSaveTask}>
                                            Register
                                        </Button>
                                    ) : null}
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Bouton pour ajouter une Todo/Tache */}
                    <Button variant="primary" onClick={handleAddTask}>
                        Add Task
                    </Button>

                    {/* Bouton pour sauvegarder la checklist */}
                    <Button variant="primary" onClick={handleSubmitChecklist}>
                        SAVE
                    </Button>
                </div>
                {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
            </FormContain>

        </>
    );
};


const FormContain = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 40px;
  border-radius: 1rem;
  width: 400px;
  height: auto;
  transition: all 0.5s;
  margin: 20px;
  

  ul {
    list-style: none;
    padding: 0;
  }


  li {
    background-color: #ffffff;
    border-radius: 10px;
    margin-bottom: 10px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }


  input,
  span,
  textarea,
  button {
    margin-bottom: 10px;
  }
 
 
  li div {
    display: flex;
    align-items: center;
   
  }


 
  button {
    padding: 5px 10px;
    font-size: 14px;
  }
`;

const SuccessMessage = styled.div`
  color: green;
  margin-top: 10px;
`;


export default ChecklistForm;
