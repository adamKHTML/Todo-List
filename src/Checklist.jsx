import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from './PageHeader';
import styled from '@emotion/styled';
import { Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import ChecklistComplete from './components/ChecklistComplete';

const API_ROOT = 'https://greenvelvet.alwaysdata.net/pfc';
const YOUR_TOKEN = 'b8d327aeae00cc1a1cb8fe818fec422c2b317489';

const axiosInstance = axios.create({
    baseURL: API_ROOT,
    headers: {
        'Content-Type': 'application/json',
        'token': YOUR_TOKEN,
    },
});

const getChecklistDetails = async (checklistId) => {
    try {
        const response = await axiosInstance.get(`/checklist?id=${checklistId}`);
        console.log('API Response (retrieving checklist details):', response.data);
        return response.data;
    } catch (error) {
        console.error('Error retrieving checklist details:', error.response.data);
        throw error;
    }
};

const ChecklistPreview = () => {
    const { id } = useParams();
    const [checklistDetails, setChecklistDetails] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');


    const handleDeleteSuccess = (deletedChecklistId) => {
        console.log(`Checklist with ID ${deletedChecklistId} deleted successfully.`);
    };
    const handleDeleteError = () => {

        console.error('Error deleting checklist.');
    };

    useEffect(() => {
        const fetchChecklistDetails = async () => {
            try {
                const details = await getChecklistDetails(id);
                setChecklistDetails(details);
            } catch (error) {
                console.error('Error fetching checklist details:', error);
            }
        };

        fetchChecklistDetails();
    }, [id]);

    const handleEditChecklist = () => {
        setEditMode(true);
    };

    const handleSaveChanges = async () => {
        try {
            // Obtient les tâches à partir des détails de la checklist.
            const tasksToUpdate = (checklistDetails?.todo || []).map((task) => ({
                id: task.id,
                name: task.name,
                statut: task.statut,
            }));

            // Envoie une requête POST pour mettre à jour la checklist avec le titre, la description et les tâches.
            await axiosInstance.post('/checklist/update', {
                id: checklistDetails.id,
                title: checklistDetails.title,
                description: checklistDetails.description,
                todo: tasksToUpdate,
            });

            // Récupére et met à jour les détails de la checklist
            const updatedDetails = await getChecklistDetails(id);
            setChecklistDetails(updatedDetails);

            // Affichage du message de réussite
            setSuccessMessage('Checklist updated successfully! Redirect you to Homepage to see the updated Checklist');
        } catch (error) {
            console.error('Error updating checklist:', error);
        } finally {
            setEditMode(false);
        }
    };

    const handleCheckboxChange = async (index) => {
        try {
            const updatedTodo = [...checklistDetails.todo];
            const currentTask = updatedTodo[index];

            // Met à jour le statut de la tâche actuelle
            currentTask.statut = currentTask.statut === 0 ? 1 : 0;

            console.log('Updated Todo:', updatedTodo);

            // Enregistre la mise à jour de l'état de la tâche dans l'API
            await axiosInstance.get('/checklist/statut', {
                params: {
                    id: checklistDetails.id,
                    statut: currentTask.statut,
                },
            });

            console.log('Checkbox Changed. New Todo:', updatedTodo);

            // Met à jour l'état local
            setChecklistDetails({
                ...checklistDetails,
                todo: updatedTodo,
            });
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };
    const getStatusText = (tasks) => {
        // Si aucune tâche n'est présente, le statut est "Not Done"
        if (!tasks || tasks.length === 0) {
            return 'Not Done';
        }
        const allTasksNotDone = tasks.every(task => task.statut === 0);

        if (allTasksNotDone) {
            return 'Not Done';
        }

        // Vérification si toutes les tâches  marquées comme "Done"
        const allTasksDone = tasks.every(task => task.statut === 1);

        if (allTasksDone) {
            return 'Done';
        }

        // Vérification d'au moins une tâche  marquée comme "In Progress"
        const someTasksInProgress = tasks.some(task => task.statut === 0);

        if (someTasksInProgress) {
            return 'In Progress';
        }

        // Si aucune des conditions précédentes n'est remplie, le statut est "Not Done"
        return 'Not Done';
    };


    return (
        <>


            <Header />
            {/* Condition pour afficher ChecklistComplete si le statut est "Done" */}
            {getStatusText(checklistDetails?.todo) === 'Done' ? (
                <ChecklistComplete
                    checklistDetails={checklistDetails}
                    onDeleteSuccess={handleDeleteSuccess}
                    onDeleteError={handleDeleteError}
                />
            ) : (
                <ChecklistDetailsContainer className='checklist-container'>
                    {checklistDetails ? (
                        <CardContainer className="checklist-card">
                            {editMode ? (
                                <>
                                    <Form >
                                        <h3>Edit Checklist</h3>
                                        <Form.Group controlId="formTitle">
                                            <Form.Label>Title:</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={checklistDetails?.title || ''}
                                                onChange={(e) =>
                                                    setChecklistDetails({
                                                        ...checklistDetails,
                                                        title: e.target.value,
                                                    })
                                                }
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formDescription">
                                            <Form.Label>Description:</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                value={checklistDetails?.description || ''}
                                                onChange={(e) =>
                                                    setChecklistDetails({
                                                        ...checklistDetails,
                                                        description: e.target.value,
                                                    })
                                                }
                                            />
                                        </Form.Group>
                                        <Button variant="primary" type="button" onClick={handleSaveChanges}>
                                            Save Changes
                                        </Button>
                                    </Form>
                                </>
                            ) : (
                                <>
                                    <h3>{checklistDetails?.title}</h3>
                                    <p>{checklistDetails?.description}</p>
                                    <p>
                                        Status: <StatusTextSpan status={getStatusText(checklistDetails?.todo)}>
                                            {getStatusText(checklistDetails?.todo)}
                                        </StatusTextSpan>
                                    </p>
                                    <p>Created at: {checklistDetails?.created_at}</p>

                                    <h2>Todo List:</h2>
                                    <ul>
                                        {(checklistDetails?.todo || []).map((task, index) => (
                                            <TodoItem key={index} isChecked={task.statut === 1} className="todo-item" >
                                                <TodoContent >
                                                    <Checkbox
                                                        isChecked={task.statut === 1}
                                                        onClick={() => handleCheckboxChange(index)}
                                                    />
                                                    <TaskName>{task.name || ''}</TaskName>
                                                </TodoContent>
                                            </TodoItem>
                                        ))}
                                    </ul>
                                    <Button variant="primary" onClick={handleEditChecklist}>
                                        Edit Checklist
                                    </Button>
                                    <Button variant="primary" onClick={handleSaveChanges}>
                                        Save Changes
                                    </Button>

                                </>
                            )}
                            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
                        </CardContainer>
                    ) : (
                        <p>Loading...</p>
                    )}
                </ChecklistDetailsContainer>
            )}

        </>
    );
};

const ChecklistDetailsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin-top: 110px;
  background-color: ${({ isDarkMode }) => (isDarkMode ? '#4a5b72' : '#ffffff')};
`;

const CardContainer = styled.div`
  background-color: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  padding: 30px;
  border-radius: 10px;
  width: 60%;
  margin: 20px auto;
  

 
`;

const TodoItem = styled.li`
  list-style: none;
  margin: 10px 0;
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  background-color: ${(props) => (props.isChecked ? '#8FED8F' : 'white')};

  &:hover {
    background-color: ${(props) => (props.isChecked ? '#8FED8F' : '#C2F2C2')};
  }
`;

const TodoContent = styled.div`
  display: flex;
  align-items: center;
`;

const Checkbox = styled.span`
  border: 1px solid blue;
  border-radius: 3px;
  width: 16px;
  height: 16px;
  display: inline-block;
  position: relative;
  cursor: pointer;

  input {
    display: none;
  }

  &::before {
    content: "${props => props.isChecked ? '✔' : ''}";
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(${props => props.isChecked ? 1 : 0});
    font-size: 12px;
    color: white;
    transition: 0.3s;
  }
`;

const TaskName = styled.span`
  flex: 1;
  margin-left: 10px;
  font-weight: bold;
`;

const SuccessMessage = styled.div`
    color: green;
    margin-top: 10px;
`;
const StatusTextSpan = styled.span`
    ${(props) => {
        switch (props.status) {
            case 'Not Done':
                return `
                    background-color: #f0f0f0;
                    color: #888383;
                    border-radius: 18px;
                `;
            case 'In Progress':
                return `
                    background-color: #ffd166;
                    color: #664c10;
                    border-radius: 18px;
                `;
            case 'Done':
                return `
                    background-color: #8FED8F;
                    color: #314031;
                    border-radius: 18px;
                `;
            default:
                return '';
        }
    }};
        font-size: 16px; 
        padding: 6px;
`;

export default ChecklistPreview;
