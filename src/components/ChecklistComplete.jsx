import React, { useState } from 'react';
import styled from 'styled-components';
import DeleteCompo from './DeleteCompo';
import { useNavigate } from 'react-router-dom';
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

const ChecklistComplete = ({ checklistDetails, onDeleteSuccess, onDeleteError }) => {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const navigate = useNavigate();


    //Si l'option oui est choisi , suivra la supression de la TodoList avce le DeleteCompo
    const handleDeleteChecklist = async () => {
        try {
            console.log('Checklist deleted successfully');
            onDeleteSuccess(checklistDetails.id);
            setShowDeleteConfirmation(false);
            navigate('/'); // Redirection vers le tableau de bord après suppression
        } catch (error) {
            console.error('Error deleting checklist:', error);
            onDeleteError();
        }
    };

    //Si l'option non eest choisi la TodoList est conservé et les tâches sont considérer comme done
    const handleNoButtonClick = async () => {
        try {
            const updatedTodo = checklistDetails.todo.map(task => ({
                ...task,
                statut: 1,
            }));

            await axiosInstance.post('/checklist/update', {
                id: checklistDetails.id,
                title: checklistDetails.title,
                description: checklistDetails.description,
                todo: updatedTodo,
            });

            navigate('/');
        } catch (error) {
            console.error('Error updating checklist status:', error);
        }
    };

    return (
        <Container>
            <div>
                <CongratulationsMessage>
                    <h2>Success</h2>
                </CongratulationsMessage>
                <MessageContent>
                    <p>Congratulations, you completed your entire tasks list! 🎉🥳<br /> Do you want to delete your Todolist ?</p>
                    <ButtonContainer>
                        <OptionButton onClick={() => setShowDeleteConfirmation(true)}>Yes</OptionButton>
                        <OptionButton onClick={handleNoButtonClick}>No</OptionButton>
                    </ButtonContainer>
                </MessageContent>

                {showDeleteConfirmation && (
                    <DeleteCompo
                        checklistId={checklistDetails.id}
                        onDeleteSuccess={handleDeleteChecklist}
                        onDeleteError={onDeleteError}
                        onClose={() => setShowDeleteConfirmation(false)}
                    />
                )}
            </div>
        </Container>
    );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  height: 40vh; 
  max-width: 400px; 
  margin: 82px auto; 
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
`;

const OptionButton = styled.button`
  background-color: #EF476F;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background-color: #D64161;
  }
`;

const MessageContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 0 0 8px 8px;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const CongratulationsMessage = styled.div`
  background-color: #4caf50;
  color: white;
  padding: 20px;
  text-align: center;
  width: 100%;
  border-radius: 8px 8px 0 0;
`;

export default ChecklistComplete;
