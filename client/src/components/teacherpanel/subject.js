import React, { useState, useEffect } from 'react';
import axios from 'axios'; // If using 'react-modal' library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faTimes, faDollarSign, } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Subject = () => {
  const [subjects, setSubjects] = useState([]);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showEditSubjectModal, setShowEditSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newSubjectPrice, setNewSubjectPrice] = useState('');
  const [currentSubjectId, setCurrentSubjectId] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [quesets, setQuesets] = useState([]); // Store available quesets
  const [selectedQueset, setSelectedQueset] = useState(""); 
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/subject');
      setSubjects(data);
    } catch (error) {
      toast.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) {
      toast.error("Please enter a subject name.");
      return;
    }
    const priceInDollars = parseFloat(newSubjectPrice);
    if (isNaN(priceInDollars) || priceInDollars <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/subject', { name: newSubjectName, price: priceInDollars.toFixed(2),});
      setNewSubjectName('');
      setNewSubjectPrice('');
      setShowAddSubjectModal(false);
      fetchSubjects();
    } catch (error) {
      toast.error('Error adding subject:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setShowEditSubjectModal(true);
  };

  const handleUpdateSubject = async () => {
    if (!editingSubject) return;

    setLoading(true);
    try {
      await axios.put(`/api/subject/${editingSubject._id}`, { name: editingSubject.name, price: editingSubject.price, });
      setShowEditSubjectModal(false);
      fetchSubjects();
    } catch (error) {
      toast.error('Error updating subject:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await axios.delete(`/api/subject/${id}`);
        fetchSubjects();
      } catch (error) {
        toast.error('Error deleting subject:', error);
      }
    }
  };
 
  const toggleSubjectExpansion = (subjectId) => {
    setExpandedSubject(expandedSubject === subjectId ? null : subjectId);
  };

const handleDeleteQuestion = async (questionId, currentSubjectId) => {
  try {
    // Confirm deletion
    const confirmDelete = window.confirm("Are you sure you want to delete this question?");
    if (!confirmDelete) return;

    // API call to delete question from the database
    const response = await fetch(`/api/subject/${currentSubjectId}/questions/${questionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      // Update the local state after deletion
      setSubjects((prevSubjects) =>
        prevSubjects.map((sub) =>
          sub._id === currentSubjectId
            ? {
                ...sub,
                questions: sub.questions.filter((q) => q._id !== questionId),
              }
            : sub
        )
      );
      toast.success("Question deleted successfully!");
    } else {
      alert("Failed to delete question. Please try again.");
    }
  } catch (error) {
    console.error("Error deleting question:", error);
    alert("An error occurred while deleting the question.");
  }
};

// Fetch quesets from backend
useEffect(() => {
  axios.get("/api/queset") // Adjust API route as needed
    .then((response) => {
      setQuesets(response.data);
    })
    .catch((error) => console.error("Error fetching quesets:", error));
}, []);

// Function to add queset's questions to subject
const handleAddQuesetToSubject = (subjectId) => {
  if (!selectedQueset) {
    alert("Please select a queset first!");
    return;
  }

  axios.post(`/api/subject/${subjectId}/add-queset-questions`, { quesetId: selectedQueset })
    .then((response) => {
      alert("Questions from the queset have been added to the subject!");
      // Optionally update the UI to show the new questions
    })
    .catch((error) => {
      console.error("Error adding queset questions to subject:", error);
      alert("An error occurred while adding the questions.");
    });
};


  return (
    <div>
       <ToastContainer />
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#4CAF50' }}>Subject Details</h2>

      {/* Button to Add Subject */}
      <button onClick={() => setShowAddSubjectModal(true)} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 12px', fontSize: '14px', borderRadius: '8px', cursor: 'pointer' }}>
        <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} /> Add Subject
      </button>

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '400px', textAlign: 'center', position: 'relative' }}>
            <span onClick={() => setShowAddSubjectModal(false)} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', fontSize: '20px' }}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
            <h3>Add New Subject</h3>
            <input type="text" value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} placeholder="Subject Name" style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
            <div style={{ position: 'relative', width: '100%', margin: '10px 0' }}>
              <FontAwesomeIcon icon={faDollarSign} style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', fontSize: '16px', color: '#888' }} />
              <input type="number" value={newSubjectPrice} onChange={(e) => setNewSubjectPrice(e.target.value)} placeholder="Subject Price" style={{ width: '100%', padding: '10px 10px 10px 30px', margin: '0', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} min="0" />
            </div>
            <button onClick={handleAddSubject} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 12px', fontSize: '14px', borderRadius: '8px', cursor: 'pointer' }}>
              Add Subject
            </button>
          </div>
        </div>
      )}

      {/* Edit Subject Modal */}
      {showEditSubjectModal && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '400px', textAlign: 'center', position: 'relative' }}>
            <span onClick={() => setShowEditSubjectModal(false)} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', fontSize: '20px' }}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
            <h3>Edit Subject</h3>
            <input type="text" value={editingSubject.name} onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })} placeholder="Subject Name" style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
            <div style={{ position: 'relative', width: '100%', margin: '10px 0' }}>
              <FontAwesomeIcon icon={faDollarSign} style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', fontSize: '16px', color: '#888' }} />
              <input type="number" value={editingSubject.price} onChange={(e) => setEditingSubject({ ...editingSubject, price: e.target.value })} placeholder="Subject Price" style={{ width: '100%', padding: '10px 10px 10px 30px', margin: '0', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box'}} />            
            </div>
            <button onClick={handleUpdateSubject} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 12px', fontSize: '14px', borderRadius: '8px', cursor: 'pointer' }}>
              Update Subject
            </button>
          </div>
        </div>
      )}

      {/* List of Subjects */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        subjects.map((subject) => (
          <div key={subject._id} style={{ marginBottom: '20px', backgroundColor: '#f1f1f1', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div onClick={() => toggleSubjectExpansion(subject._id)} style={{ fontWeight: 'bold' }}>
                {subject.name}</div>
              <div>
                <button onClick={() => handleEditSubject(subject)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={faEdit} style={{ color: '#333',  fontSize: '20px', marginRight: '10px' }} />
                </button>
                <button onClick={() => handleDeleteSubject(subject._id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={faTrash} style={{ color: '#e74c3c', cursor: 'pointer', fontSize: '20px' }} />
                </button>
                <button onClick={() => setExpandedSubject(expandedSubject === subject._id ? null : subject._id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={faPlus} style={{color: '#4CAF50', cursor: 'pointer', fontSize: '20px',marginLeft: '20px',marginRight: '10px'}} />
                </button>
              </div>
            </div>

            {expandedSubject === subject._id && (
              <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', gap: '50px', marginBottom: '30px' }}>
                  <h2>Add Questions from Queset</h2>
                  {/* Dropdown to select Queset */}
                  <select value={selectedQueset} onChange={(e) => setSelectedQueset(e.target.value)}>
                    <option value="">Select a Queset</option>
                    {quesets.map((queset) => (
                      <option key={queset._id} value={queset._id}>
                        {queset.name}
                      </option>
                    ))}
                  </select>

                  {/* Button to add selected queset's questions */}
                  <button 
                    onClick={() => {
                      setCurrentSubjectId(subject._id);
                      handleAddQuesetToSubject(subject._id);
                    }}
                    style={{
                      marginLeft: '10px',
                      padding: '5px 12px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Add Queset
                  </button>
                </div>

                {subject.questions && subject.questions.length > 0 ? (
                  subject.questions.map((question, index) => (
                    <div  key={question._id || index}  style={{background: '#fff',padding: '10px',marginTop: '10px',borderRadius: '5px',boxShadow: '0 2px 4px rgba(0,0,0,0.1)', }}>
                      <h4>Question {index + 1}</h4>
                      {['questionText1', 'questionText2', 'questionText3'].map((key) =>
                        question[key] ? <p key={key}>{question[key]}</p> : null
                      )}

                      {['questionImage1', 'questionImage2', 'questionImage3'].map((key) =>
                        question[key] ? (
                          <div key={key}>
                            <img  src={question[key]}  style={{maxWidth: '100%',borderRadius: '5px',marginBottom: '10px',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', }}
                            />
                          </div>
                        ) : null
                      )}

                      {['questionTable1', 'questionTable2', 'questionTable3'].map((key) =>
                        question[key] && Array.isArray(question[key].data) && question[key].data.length > 0 ? (
                          <div key={key}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
                              <tbody>
                                {question[key].data.map((row, rowIndex) => (
                                  <tr key={rowIndex}>
                                    {row.map((cell, colIndex) => (
                                      <td 
                                        key={colIndex} 
                                        style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}
                                      >
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : null
                      )}

                      {/* Options */}
                      <p><strong>Options:</strong></p>
                      <ul style={{ listStyleType: 'none', paddingLeft: '10px' }}>
                        {Object.entries(question.options || {}).map(([key, value]) => (
                          <li key={key}>{key.toUpperCase()}. {value}</li>
                        ))}
                      </ul>

                      {/* Correct Answer */}
                      {question.correctAns && (
                        <p><strong>Correct Answer:</strong> {question.correctAns}</p>
                      )}

                      {/* Answer Description */}
                      <p><strong>Answer Description:</strong></p>
                      {['answerDescriptionText1', 'answerDescriptionText2', 'answerDescriptionText3'].map((key) =>
                        question[key] ? <p key={key}>{question[key]}</p> : null
                      )}

                      {['answerDescriptionImage1', 'answerDescriptionImage2', 'answerDescriptionImage3'].map((key) =>
                        question[key] ? (
                          <div key={key}>
                            <img  src={question[key]}  style={{maxWidth: '75%',borderRadius: '5px',marginBottom: '10px',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',}}
                            />
                          </div>
                        ) : null
                      )}

                      {['answerDescriptionTable1', 'answerDescriptionTable2', 'answerDescriptionTable3'].map((key) =>
                        question[key] && Array.isArray(question[key].data) && question[key].data.length > 0 ? (
                          <div key={key}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
                              <tbody>
                                {question[key].data.map((row, rowIndex) => (
                                  <tr key={rowIndex}>
                                    {row.map((cell, colIndex) => (
                                      <td 
                                        key={colIndex} 
                                        style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}
                                      >
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : null
                      )}
                    </div>
                  ))
                ) : (
                  <p style={{ marginTop: '10px', fontStyle: 'italic', color: '#666' }}>
                    No questions added yet.
                  </p>
                )}
              </div>
            )}
          </div>
        ))
      )}
      {successMessage && (
        <div style={{ color: "green", marginTop: "10px" }}>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{ color: "red", marginTop: "10px" }}>
          {errorMessage}
        </div>
      )}  
      
    </div>
  );
};
export default Subject;