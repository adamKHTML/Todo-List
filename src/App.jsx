import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import FormPage from './FormPage';
import ChecklistPreview from './Checklist';



function App() {
  const [createMessage, setCreateMessage] = useState(null);

  const handleCreateMessage = (message) => {
    setCreateMessage(message);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Dashboard createMessage={createMessage} setCreateMessage={setCreateMessage} />}
        />
        <Route
          path="/formulaire"
          element={<FormPage createMessage={createMessage} setCreateMessage={setCreateMessage} />}
        />
        <Route
          path="/checklist/:id"
          element={<ChecklistPreview createMessage={createMessage} setCreateMessage={setCreateMessage} />}
        />
      </Routes>
    </Router>
  );
}

export default App;