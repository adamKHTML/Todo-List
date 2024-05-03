import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const DarkModeComponent = () => {
    const [isDarkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Applique le mode sombre ou clair lors du chargement de la page
        applyTheme(isDarkMode);
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        // Inverse le mode sombre ou clair lors du clic sur l'icône
        setDarkMode((prevMode) => !prevMode);
    };

    const applyTheme = (darkMode) => {
        const body = document.body;

        if (darkMode) {
            // Applique les styles pour le mode sombre
            body.style.backgroundColor = '#363e49';
            body.style.color = '#ffffff';
        } else {
            body.style.backgroundColor = '#ffffff';
            body.style.color = '#000000';
        }

        // Cela applique le sstyle pour le mode sombre à d'autre élèments 
        const cards = document.querySelectorAll('.checklist-card');

        cards.forEach((card) => {
            card.style.backgroundColor = darkMode ? '#4a5b72' : '#ffffff';
            card.style.border = darkMode ? '1px solid #ffffff' : '1px solid transparent';
            card.style.color = darkMode ? '#ffffff' : '#212529';

        });

        const forms = document.querySelectorAll('.form-container');

        forms.forEach((form) => {

            form.style.backgroundColor = darkMode ? '#8d99aa' : '#ededed';
        })

        const messages = document.querySelectorAll('.message-content');

        messages.forEach((message) => {

            message.style.backgroundColor = darkMode ? '#617693' : '#ffffff';
        })


        const checklists = document.querySelectorAll('.checklist-container');

        checklists.forEach((checklist) => {

            checklist.style.backgroundColor = darkMode ? '#363e49' : '#ffffff';
        })

        const todos = document.querySelectorAll('.todo-item');
        todos.forEach((todo) => {
            todo.style.color = darkMode ? '#2b713c' : '#000000';
        })

    };

    return (
        <div className="dark-mode-container">
            {isDarkMode ? (
                <FontAwesomeIcon
                    icon={faMoon}
                    style={{ color: '#ffffff', cursor: 'pointer' }}
                    onClick={toggleDarkMode}
                />
            ) : (
                <FontAwesomeIcon
                    icon={faSun}
                    style={{ color: '#ffffff', cursor: 'pointer' }}
                    onClick={toggleDarkMode}
                />
            )}
        </div>
    );
};

export default DarkModeComponent;
