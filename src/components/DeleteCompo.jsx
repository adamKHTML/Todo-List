import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';


const API_ROOT = 'https://greenvelvet.alwaysdata.net/pfc';
const YOUR_TOKEN = 'b8d327aeae00cc1a1cb8fe818fec422c2b317489';

const axiosInstance = axios.create({
    baseURL: API_ROOT,
    headers: {
        'Content-Type': 'application/json',
        'token': YOUR_TOKEN,
    },
});

const DeleteCompo = ({ checklistId, onDeleteSuccess, onDeleteError }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleDeleteChecklist = async (event) => {
        event.preventDefault();

        try {
            //Envoi une requête DELETE pour supprimer la checklist
            const response = await axiosInstance.get(`/checklist/delete?id=${checklistId}`);

            if (response.data.done) {
                // Notifie le composant parent de la suppression réussie.
                onDeleteSuccess(checklistId); // Pass the checklist ID to onDeleteSuccess
            } else {
                // Notifie le composant parent de l'échec de la suppression.
                onDeleteError();
            }
        } catch (error) {
            console.error('Error deleting checklist:', error);
            // Notifie le composant parent de l'échec de la suppression.
            onDeleteError();
        } finally {
            // Ferme la boîte de dialogue de confirmation indépendamment du résultat.
            setShowConfirmation(false);
        }
    };

    const openConfirmation = () => {
        setShowConfirmation(true);
    };

    const closeConfirmation = () => {
        setShowConfirmation(false);
    };

    return (
        <>
            <StyledButton onClick={openConfirmation}>
                <FontAwesomeIcon icon={faTrashAlt} />
            </StyledButton>

            {showConfirmation && (
                <ConfirmationModal>
                    <p>Are you sure you want to delete?</p>
                    <div>
                        <button onClick={handleDeleteChecklist}>Yes</button>
                        <button onClick={closeConfirmation}>No</button>
                    </div>
                </ConfirmationModal>
            )}
        </>
    );
};

const StyledButton = styled.button`
  background-color: #EF476F;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px;
  cursor: pointer;
  margin-left: 94px;
  width: 100px;

  &:hover {
    background-color: #D64161;
  }
`;

const ConfirmationModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
`;

export default DeleteCompo;
