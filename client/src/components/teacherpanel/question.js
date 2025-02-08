import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faTimes, faUpload, faDownload } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Queset = () => {
  const [quesets, setQuesets] = useState([]);
  const [showAddQuesetModal, setShowAddQuesetModal] = useState(false);
  const [showEditQuesetModal, setShowEditQuesetModal] = useState(false);
  const [newQuesetText, setNewQuesetText] = useState('');
  const [editingQueset, setEditingQueset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedQueset, setExpandedQueset] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    // Question 1
    questionText1: '',
    questionImage1: '',
    questionTable1: [],
    // Question 2
    questionText2: '',
    questionImage2: '',
    questionTable2: [],
    // Question 3
    questionText3: '',
    questionImage3: '',
    questionTable3: [],
    // Options and Correct Answer
    options: { a: '', b: '', c: '', d: '' },
    correctAns: '',
    // Answer Descriptions for Question 1
    answerDescriptionText1: '',
    answerDescriptionImage1: '',
    answerDescriptionTable1: [],
    // Answer Descriptions for Question 2
    answerDescriptionText2: '',
    answerDescriptionImage2: '',
    answerDescriptionTable2: [],
    // Answer Descriptions for Question 3
    answerDescriptionText3: '',
    answerDescriptionImage3: '',
    answerDescriptionTable3: [],
    // The ID of the queset
    quesetId: '',
  });  
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentQuesetId, setCurrentQuesetId] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [updatedQuestion, setUpdatedQuestion] = useState({question: '', image: '', options: { a: '', b: '', c: '', d: '' }, correctAnswer: '', description: ''});
  const [showEditQuestionModal, setShowEditQuestionModal] = useState(false); 
  const [editingQuestion, setEditingQuestion] = useState(null); 
  useEffect(() => { fetchQuesets(); }, []);

  const fetchQuesets = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/queset');
      setQuesets(data);
    } catch (error) {
      toast.error(`Error fetching queset: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQueset = async () => {
    if (!newQuesetText.trim()) return toast.error("Please enter a queset.");
    setLoading(true);
    try {
      await axios.post('/api/queset', { name: newQuesetText, questions: [] });
      setNewQuesetText(''); setShowAddQuesetModal(false); fetchQuesets();
    } catch (error) {
      toast.error(`Error adding queset: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditQueset = (queset) => { setEditingQueset({ ...queset }); setShowEditQuesetModal(true); };

  const handleUpdateQueset = async () => {
    if (!editingQueset) return;
    setLoading(true);
    try {
      await axios.put(`/api/queset/${editingQueset._id}`, { name: editingQueset.name });
      setShowEditQuesetModal(false); fetchQuesets();
    } catch (error) {
      toast.error(`Error updating queset: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQueset = async (id) => {
    if (!window.confirm('Are you sure you want to delete this queset?')) return;
    try {
      await axios.delete(`/api/queset/${id}`);
      fetchQuesets();
    } catch (error) {
      toast.error(`Error deleting queset: ${error.message}`);
    }
  };
  const toggleExpandedQueset = (quesetId) => { 
    setExpandedQueset(prev => (prev === quesetId ? null : quesetId)); 
  };
  
  const handleAddQuestion = (quesetId) => {
    setNewQuestion(prev => ({ ...prev, quesetId }));
    setShowAddQuestionModal(true);
  };

  const handleSubmitQuestion = async () => {
  // Validate that correctAns and quesetId are not empty
  if (!newQuestion.correctAns.trim()) {
    return toast.error('Please select a correct answer.');
  }

  if (!newQuestion.quesetId) {
    return toast.error('Quset ID is required.');
  }

  console.log("newQuestion before submitting:", newQuestion);

  setLoading(true);
  try {
    await axios.post(`/api/queset/${newQuestion.quesetId}/add`, newQuestion, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    setNewQuestion({
      questionText1: '',
      questionImage1: '',
      questionTable1: [],
      questionText2: '',
      questionImage2: '',
      questionTable2: [],
      questionText3: '',
      questionImage3: '',
      questionTable3: [],
      options: { a: '', b: '', c: '', d: '' },
      correctAns: '',
      answerDescriptionText1: '',
      answerDescriptionImage1: '',
      answerDescriptionTable1: [],
      answerDescriptionText2: '',
      answerDescriptionImage2: '',
      answerDescriptionTable2: [],
      answerDescriptionText3: '',
      answerDescriptionImage3: '',
      answerDescriptionTable3: [],
      quesetId: '', // Ensure quesetId is reset after submission
    });
    setShowAddQuestionModal(false);
    fetchQuesets();
  } catch (error) {
    console.error(`Error adding question: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  const generateTableData = (rows, cols) => {
    const data = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push('');
      }
      data.push(row);
    }
    return { rows, cols, data };
  };
  
  const updateTableCell = (question, tableKey, index, rowIndex, colIndex, newValue) => {
    const updatedTableData = [...question[`${tableKey}${index}`].data];
    updatedTableData[rowIndex][colIndex] = newValue;
    
    setNewQuestion((prev) => ({
      ...prev,
      [`${tableKey}${index}`]: {
        ...prev[`${tableKey}${index}`],
        data: updatedTableData,
      },
    }));
  };

  // Handle modal toggle and set quesetId
  const handleUploadModalToggle = (quesetId) => {
    setCurrentQuesetId(quesetId); // Set the current Quset ID when button is clicked
    setShowUploadModal(true); // Show the upload modal
    setExpandedQueset(true);
  };
 
  const handleUploadCSV = async () => { 
    if (!selectedFile || !currentQuesetId) {
      toast.error("Please select a file and a Quset.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile); // Append the selected file
  
    try {
      await axios.post(`/api/queset/${currentQuesetId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("File uploaded successfully!");
      setShowUploadModal(false);
      fetchQuesets(); // Reload the quesets after uploading
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file, please try again.");
    }
  };
  const handleEditQuestion = (question, currentQuesetId) => {
    setEditingQuestion(question); // Set the selected question to be edited
    setCurrentQuesetId(currentQuesetId); // Set the subject ID
    setExpandedQueset(true);
    console.log('quesetID: ',currentQuesetId);
    setUpdatedQuestion({
      questionText1: question.questionText1 || '',
      questionImage1: question.questionImage1 || '',
      questionTable1: question.questionTable1 || [],
      
      questionText2: question.questionText2 || '',
      questionImage2: question.questionImage2 || '',
      questionTable2: question.questionTable2 || [],
      
      questionText3: question.questionText3 || '',
      questionImage3: question.questionImage3 || '',
      questionTable3: question.questionTable3 || [],
      
      options: question.options || { a: '', b: '', c: '', d: '' },
      correctAns: question.correctAns || '',
      
      answerDescriptionText1: question.answerDescriptionText1 || '',
      answerDescriptionImage1: question.answerDescriptionImage1 || '',
      answerDescriptionTable1: question.answerDescriptionTable1 || [],
      
      answerDescriptionText2: question.answerDescriptionText2 || '',
      answerDescriptionImage2: question.answerDescriptionImage2 || '',
      answerDescriptionTable2: question.answerDescriptionTable2 || [],
      
      answerDescriptionText3: question.answerDescriptionText3 || '',
      answerDescriptionImage3: question.answerDescriptionImage3 || '',
      answerDescriptionTable3: question.answerDescriptionTable3 || [],
    });
  
    setShowEditQuestionModal(true); // Show the edit question modal
  };

  const handleDeleteQuestion = async (questionId, currentQuesetId) => {
    console.log('quesetId:', currentQuesetId);
    try {
      console.log("Before calling handleDeleteQuestion: ", { questionId, currentQuesetId });

      if (!questionId || !currentQuesetId) {
        console.error("Missing quesetId or questionId:", { questionId, currentQuesetId });
        toast.error("Missing queset ID or question ID");
        return;
      }
  
      // Confirm deletion
      const confirmDelete = window.confirm("Are you sure you want to delete this question?");
      if (!confirmDelete) return;
  
      console.log("Deleting question with ID:", questionId, "from queset:", currentQuesetId);
  
      // API call to delete question
      const response = await fetch(`/api/queset/${currentQuesetId}/questions/${questionId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        // Update state after deletion
        setQuesets((prevQuesets) =>
          prevQuesets.map((queset) =>
            queset._id === currentQuesetId
              ? { ...queset, questions: queset.questions.filter((q) => q._id !== questionId) }
              : queset
          )
        );
        toast.success("Question deleted successfully!");
      } else {
        console.error("Failed to delete question:", responseData);
        toast.error(responseData.message || "Failed to delete question. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("An error occurred while deleting the question.");
    }
  };

  const handleUpdateQuestion = async () => {
    if (!currentQuesetId || !editingQuestion?._id) {
      console.log('quesetId:', currentQuesetId);
      console.log('editingQuestion._id:', editingQuestion._id);

      toast.error("Missing queset ID question ID");
      return; 
    }
    setLoading(true);
  
    try {
      // Send PUT request to update the question with all its fields
      const response = await axios.put(
        `/api/queset/${currentQuesetId}/questions/${editingQuestion._id}`,
        {
          questionText1: updatedQuestion.questionText1,
          questionImage1: updatedQuestion.questionImage1,
          questionTable1: updatedQuestion.questionTable1,
          
          questionText2: updatedQuestion.questionText2,
          questionImage2: updatedQuestion.questionImage2,
          questionTable2: updatedQuestion.questionTable2,
          
          questionText3: updatedQuestion.questionText3,
          questionImage3: updatedQuestion.questionImage3,
          questionTable3: updatedQuestion.questionTable3,
          
          options: updatedQuestion.options,
          correctAns: updatedQuestion.correctAns,
          
          answerDescriptionText1: updatedQuestion.answerDescriptionText1,
          answerDescriptionImage1: updatedQuestion.answerDescriptionImage1,
          answerDescriptionTable1: updatedQuestion.answerDescriptionTable1,
          
          answerDescriptionText2: updatedQuestion.answerDescriptionText2,
          answerDescriptionImage2: updatedQuestion.answerDescriptionImage2,
          answerDescriptionTable2: updatedQuestion.answerDescriptionTable2,
          
          answerDescriptionText3: updatedQuestion.answerDescriptionText3,
          answerDescriptionImage3: updatedQuestion.answerDescriptionImage3,
          answerDescriptionTable3: updatedQuestion.answerDescriptionTable3,
        }
      );
  
      console.log('Question updated:', response.data);
      toast.success('Question updated successfully');
      setShowEditQuestionModal(false); // Close the modal after updating
      fetchQuesets(); 
    } catch (error) {
      toast.error('Error updating question:', error.response?.data || error);
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };
  //download question file
  const handleDownloadCSV = async (currentQuesetId) => {
    console.log(currentQuesetId);
    if (!currentQuesetId) {
      toast.error("Please select a Queset first.");
      return;
    }
    try {
      const response = await axios.get(`/api/queset/${currentQuesetId}/download-csv`, {
        responseType: 'blob', // Important for handling files
      });
      
      // Create a download link for the CSV file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'questions.csv'); // Specify the file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error("Error downloading CSV:", error);
      toast.error("Failed to download CSV. Please try again.");
    }
  };
  return (
    <div>
      <ToastContainer />
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#100B5C' }}>Queset Details</h2>

      <button onClick={() => setShowAddQuesetModal(true)} style={{ marginBottom: '20px', backgroundColor: '#100B5C', color: 'white', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} /> Add Queset
      </button>

      {showAddQuesetModal && (
        <Modal title="Add New Queset" onClose={() => setShowAddQuesetModal(false)}>
          <input type="text" value={newQuesetText} onChange={(e) => setNewQuesetText(e.target.value)} placeholder="Queset Text" style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #100B5C' }} />
          <button onClick={handleAddQueset} style={{ backgroundColor: '#100B5C', color: 'white', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Add Queset
          </button>
        </Modal>
      )}

      {showEditQuesetModal && editingQueset && (
        <Modal title="Edit Queset" onClose={() => setShowEditQuesetModal(false)}>
          <input type="text" value={editingQueset.name} onChange={(e) => setEditingQueset({ ...editingQueset, name: e.target.value })} placeholder="Queset Name" style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #100B5C' }} />
          <button onClick={handleUpdateQueset} style={{ backgroundColor: '#100B5C', color: 'white', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Update Queset
          </button>
        </Modal>
      )}

      {loading ? <p>Loading...</p> : quesets.map((queset) => (
        <div key={queset._id} style={{ marginBottom: '20px', backgroundColor: '#f1f1f1', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderLeft: '4px solid #100B5C', cursor: 'pointer' }} onClick={() => toggleExpandedQueset(queset._id)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 'bold', color: '#100B5C' }}>{queset.name}</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={(e) => { e.stopPropagation(); handleEditQueset(queset); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#100B5C', fontSize: '18px' }}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); handleDeleteQueset(queset._id); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#C80D18', fontSize: '18px' }}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>

          {expandedQueset === queset._id && (
  <div style={{ maxHeight: 'auto', overflowY: 'auto', marginTop: '10px', padding: '10px', border: 'none' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {/* Add Question Button */}
      <button 
        onClick={(e) => { 
          e.stopPropagation();   
          handleAddQuestion(queset._id);  
          setCurrentQuesetId(queset._id); 
        }} 
        style={{ backgroundColor: '#100B5C', color: 'white', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
      >
        <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} /> Add Question
      </button>

      {/* Upload Questions Button */}
      <button 
        onClick={() => handleUploadModalToggle(queset._id)} 
        style={{ backgroundColor: '#4CAF50', color: 'white', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}
      >
        <FontAwesomeIcon icon={faUpload} style={{ marginRight: '8px' }} /> Upload Questions
      </button>

      {/* Download Questions Button */}
      <button 
        onClick={() => { handleDownloadCSV(queset._id); }} 
        style={{ backgroundColor: '#2196F3', color: 'white', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}
      >
        <FontAwesomeIcon icon={faDownload} style={{ marginRight: '8px' }} /> Download Questions
      </button>
    </div>

    {queset.questions && queset.questions.length > 0 ? (
      queset.questions.map((question, index) => (
        <div 
          key={question._id || index} 
          style={{ background: '#fff', padding: '10px', marginTop: '10px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
        >
          <h4>Question {index + 1}</h4>
          
          {/* Edit and Delete Icons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ marginLeft: 'auto' }}> {/* This aligns the buttons to the right */}
              <FontAwesomeIcon 
                icon={faEdit} 
                style={{ cursor: 'pointer', marginRight: '8px' }} 
                onClick={() => handleEditQuestion(question, queset._id)} 
              />
              <FontAwesomeIcon 
                icon={faTrash} 
                style={{ cursor: 'pointer', color: 'red' }} 
                onClick={() => handleDeleteQuestion(question._id, queset._id)} 
              />
            </div>
          </div>

          {/* Question Text 1 */}
          {question.questionText1 && <p>{question.questionText1}</p>}

          {/* Question Image 1 */}
          {question.questionImage1 && (
            <div>
              <img 
                src={question.questionImage1} 
                style={{ maxWidth: "100%", borderRadius: "5px", marginBottom: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }} 
              />
            </div>  
          )}

          {/* Question Table 1 */}
          {question.questionTable1 && Array.isArray(question.questionTable1.data) && question.questionTable1.data.length > 0 && (
            <div>
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
                <tbody>
                  {question.questionTable1.data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, colIndex) => (
                        <td key={colIndex} style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Question Text 2 */}
          {question.questionText2 && <p>{question.questionText2}</p>}

          {/* Question Image 2 */}
          {question.questionImage2 && (
            <div>
              <img 
                src={question.questionImage2} 
                style={{ maxWidth: "100%", borderRadius: "5px", marginBottom: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }} 
              />
            </div>
          )}

          {/* Question Table 2 */}
          {question.questionTable2 && Array.isArray(question.questionTable2.data) && question.questionTable2.data.length > 0 && (
            <div>
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
                <tbody>
                  {question.questionTable2.data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, colIndex) => (
                        <td key={colIndex} style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Question Text 3 */}
          {question.questionText3 && <p>{question.questionText3}</p>}

          {/* Question Image 3 */}
          {question.questionImage3 && (
            <div>
              <img 
                src={question.questionImage3} 
                style={{ maxWidth: "100%", borderRadius: "5px", marginBottom: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }} 
              />
            </div>
          )}

          {/* Question Table 3 */}
          {question.questionTable3 && Array.isArray(question.questionTable3.data) && question.questionTable3.data.length > 0 && (
            <div>
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
                <tbody>
                  {question.questionTable3.data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, colIndex) => (
                        <td key={colIndex} style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Options */}
          <p><strong>Options:</strong></p>
          <ul style={{ listStyleType: "none", paddingLeft: "10px" }}>
            {question.options.a && <li>A. {question.options.a}</li>}
            {question.options.b && <li>B. {question.options.b}</li>}
            {question.options.c && <li>C. {question.options.c}</li>}
            {question.options.d && <li>D. {question.options.d}</li>}
          </ul>

          {/* Correct Answer */}
          {question.correctAns && <p><strong>Correct Answer:</strong> {question.correctAns}</p>}

          {/* Answer Description */}
          <p><strong>Answer Description:</strong></p>

          {/* Answer Description Text 1 */}
          {question.answerDescriptionText1 && <p>{question.answerDescriptionText1}</p>}

          {/* Answer Description Image 1 */}
          {question.answerDescriptionImage1 && (
            <div>
              <img 
                src={question.answerDescriptionImage1} 
                style={{ maxWidth: "75%", borderRadius: "5px", marginBottom: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }} 
              />
            </div>
          )}

          {/* Answer Description Table 1 */}
          {question.answerDescriptionTable1 && Array.isArray(question.answerDescriptionTable1.data) && question.answerDescriptionTable1.data.length > 0 && (
            <div>
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
                <tbody>
                  {question.answerDescriptionTable1.data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, colIndex) => (
                        <td key={colIndex} style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Answer Description Text 2 */}
          {question.answerDescriptionText2 && <p>{question.answerDescriptionText2}</p>}

          {/* Answer Description Image 2 */}
          {question.answerDescriptionImage2 && (
            <div>
              <img 
                src={question.answerDescriptionImage2} 
                style={{ maxWidth: "75%", borderRadius: "5px", marginBottom: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }} 
              />
            </div>
          )}

          {/* Answer Description Table 2 */}
          {question.answerDescriptionTable2 && Array.isArray(question.answerDescriptionTable2.data) && question.answerDescriptionTable2.data.length > 0 && (
            <div>
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
                <tbody>
                  {question.answerDescriptionTable2.data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, colIndex) => (
                        <td key={colIndex} style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))
    ) : (
      <p style={{ marginTop: '10px', fontStyle: 'italic', color: '#666' }}>No questions added yet.</p>
    )}
  </div>
)}

        </div>
      ))}
      {/* Upload CSV Modal */}
      {showUploadModal && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', width: '500px', textAlign: 'center', position: 'relative', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)' }}>
            <span onClick={() => setShowUploadModal(false)} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', fontSize: '24px', color: '#333' }}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
            <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '20px' }}>Upload CSV for Questions</h3>
            <input type="file" accept=".csv" onChange={(e) => setSelectedFile(e.target.files[0])} style={{ padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '20px', width: '100%', boxSizing: 'border-box' }} />
            <div style={{ marginBottom: '10px' }}></div> {/* Added space */}
            <button onClick={handleUploadCSV} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '8px 12px', fontSize: '16px', borderRadius: '6px', cursor: 'pointer', width: '100%', border: 'none', boxSizing: 'border-box' }}>
              Upload CSV
            </button>
          </div>
        </div>
      )}
      {showAddQuestionModal && (
        <Modal isOpen={showAddQuestionModal}  onClose={() => setShowAddQuestionModal(false)} contentLabel="Add Question"
          style={{ overlay: {display: 'flex',justifyContent: 'center',alignItems: 'center',backgroundColor: 'rgba(0, 0, 0, 0.5)', },
            content: {position: 'relative',maxWidth: '800px',maxHeight: '80vh',margin: '0 auto',padding: '20px',overflow: 'hidden',borderRadius: '10px', },
          }}
        >
          <h3>Add New Question</h3>
          {/* Question Fields */}
          <div style={{ maxHeight: 'calc(80vh - 50px)', overflowY: 'auto', paddingRight: '10px' }}>
            {[1, 2, 3].map((index) => (
              <div key={`question-set-${index}`}>
                <textarea value={newQuestion[`questionText${index}`]}
                 onChange={(e) =>
                    setNewQuestion((prev) => ({
                      ...prev,
                      [`questionText${index}`]: e.target.value,
                    }))
                  } placeholder={`Question Text ${index}`}
                  style={{padding: '10px',width: '100%',marginBottom: '10px',resize: 'none',overflow: 'hidden',}}
                  rows="1"
                  onInput={(e) => {
                    e.target.style.height = 'auto'; // Reset height before calculation
                    e.target.style.height = `${e.target.scrollHeight}px`; // Set height to content
                  }}
                />

                <input type="text" value={newQuestion[`questionImage${index}`]}
                  onChange={(e) =>
                    setNewQuestion((prev) => ({
                      ...prev,
                      [`questionImage${index}`]: e.target.value,
                    }))
                  }  placeholder={`Question Image ${index} URL`}
                  style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
                />
                {newQuestion[`questionImage${index}`] && (
                  <img src={newQuestion[`questionImage${index}`]} alt={`Preview ${index}`} style={{ maxWidth: '25%', maxHeight: '200px', borderRadius: '5px', marginBottom: '10px' }}
                  />
                )}
                {/* Table Editor */}
                <div>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input type="number" min="1" placeholder="Rows" value={newQuestion[`questionTable${index}`]?.rows || 0}
                      onChange={(e) =>
                        setNewQuestion((prev) => {
                          const rows = parseInt(e.target.value) || 0;
                          const cols = newQuestion[`questionTable${index}`]?.cols || 0;
                          return {
                            ...prev,
                            [`questionTable${index}`]: generateTableData(rows, cols),
                          };
                        })
                      } style={{ width: '50%', padding: '10px' }}
                    />
                    <input type="number" min="1" placeholder="Columns" value={newQuestion[`questionTable${index}`]?.cols || 0}
                      onChange={(e) =>
                        setNewQuestion((prev) => {
                          const rows = newQuestion[`questionTable${index}`]?.rows || 0;
                          const cols = parseInt(e.target.value) || 0;
                          return {
                            ...prev,
                            [`questionTable${index}`]: generateTableData(rows, cols),
                          };
                        })
                      } style={{ width: '50%', padding: '10px' }}
                    />
                  </div>
                  <table border="1" style={{ width: '100%', textAlign: 'center', marginBottom: '10px' }}>
                    <tbody>
                      {newQuestion[`questionTable${index}`]?.data?.map((row, rowIndex) => (
                        <tr key={`row-${rowIndex}`}>
                          {row.map((cell, colIndex) => (
                            <td key={`cell-${rowIndex}-${colIndex}`}>
                              <input  type="text"  value={cell}
                                onChange={(e) =>
                                  updateTableCell(newQuestion, 'questionTable', index, rowIndex, colIndex, e.target.value)
                                } style={{ width: '100%', padding: '5px' }}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {/* Options */}
            {['a', 'b', 'c', 'd'].map((option) => (
              <input key={option} type="text" value={newQuestion.options[option]}
                onChange={(e) =>
                  setNewQuestion((prev) => ({
                    ...prev,
                    options: { ...prev.options, [option]: e.target.value },
                  }))
                } placeholder={`Option ${option.toUpperCase()}`} style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
              />
            ))}

            {/* Correct Answer */}
            <input type="text" value={newQuestion.correctAns}
              onChange={(e) =>
                setNewQuestion((prev) => ({
                  ...prev,
                  correctAns: e.target.value,
                }))
              } placeholder="Correct Answer (a, b, c, or d)" style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
            />
            {/* Answer Description Fields */}
            {[1, 2, 3].map((index) => (
              <div key={`answer-description-${index}`}>
                <textarea value={newQuestion[`answerDescriptionText${index}`]}
                  onChange={(e) =>
                    setNewQuestion((prev) => ({
                      ...prev,
                      [`answerDescriptionText${index}`]: e.target.value,
                    }))
                  } placeholder={`Answer Description Text ${index}`} style={{padding: '10px',width: '100%',marginBottom: '10px',resize: 'none', overflow: 'hidden',}}
                  rows="1" // Minimum height
                  onInput={(e) => {
                    e.target.style.height = 'auto'; // Reset height before calculation
                    e.target.style.height = `${e.target.scrollHeight}px`; // Set height to content
                  }}
                />
                <input type="text" value={newQuestion[`answerDescriptionImage${index}`]}
                  onChange={(e) =>
                    setNewQuestion((prev) => ({
                      ...prev,
                      [`answerDescriptionImage${index}`]: e.target.value,
                    }))
                  } placeholder={`Answer Description Image ${index} URL`} style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
                />
                {newQuestion[`answerDescriptionImage${index}`] && (
                  <img src={newQuestion[`answerDescriptionImage${index}`]} alt={`Answer Description Preview ${index}`} style={{ maxWidth: '25%', maxHeight: '200px', borderRadius: '5px', marginBottom: '10px', }}
                  />
                )}
                <div>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input type="number" min="1" placeholder="Rows" value={newQuestion[`answerDescriptionTable${index}`]?.rows || 0}
                      onChange={(e) =>
                        setNewQuestion((prev) => {
                          const rows = parseInt(e.target.value) || 0;
                          const cols = newQuestion[`answerDescriptionTable${index}`]?.cols || 0;
                          return {
                            ...prev,
                            [`answerDescriptionTable${index}`]: generateTableData(rows, cols),
                          };
                        })
                      } style={{ width: '50%', padding: '10px' }}
                    />
                    <input type="number" min="1" placeholder="Columns" value={newQuestion[`answerDescriptionTable${index}`]?.cols || 0}
                      onChange={(e) =>
                        setNewQuestion((prev) => {
                          const rows = newQuestion[`answerDescriptionTable${index}`]?.rows || 0;
                          const cols = parseInt(e.target.value) || 0;
                          return {
                            ...prev,
                            [`answerDescriptionTable${index}`]: generateTableData(rows, cols),
                          };
                        })
                      } style={{ width: '50%', padding: '10px' }}
                    />
                  </div>
                  <table border="1" style={{ width: '100%', textAlign: 'center', marginBottom: '10px' }}>
                    <tbody>
                      {newQuestion[`answerDescriptionTable${index}`]?.data?.map((row, rowIndex) => (
                        <tr key={`row-${rowIndex}`}>
                          {row.map((cell, colIndex) => (
                            <td key={`cell-${rowIndex}-${colIndex}`}>
                              <input type="text" value={cell}
                                onChange={(e) =>
                                  updateTableCell(newQuestion, 'answerDescriptionTable', index, rowIndex, colIndex, e.target.value)
                                } style={{ width: '100%', padding: '5px' }}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {/* Add Button */}
            <button onClick={handleSubmitQuestion} style={{ backgroundColor: 'green', color: 'white', padding: '10px 15px', borderRadius: '4px', }} >
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />
              Add Question
            </button>
          </div>
        </Modal>
      )}
      {showEditQuestionModal && (
        <Modal isOpen={showEditQuestionModal} onClose={() => setShowEditQuestionModal(false)} contentLabel="Edit Question"  style={{overlay: { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', }, content: { position: 'relative', maxWidth: '800px', maxHeight: '80vh', margin: '0 auto', padding: '20px', overflow: 'hidden', borderRadius: '10px', }, }}>
          <h3>Edit Question</h3>
          {/* Question Fields */}
          <div style={{ maxHeight: 'calc(80vh - 50px)', overflowY: 'auto', paddingRight: '10px',}}>
            {[1, 2, 3].map((index) => (
              <div key={`question-set-${index}`}>
                <textarea
                value={updatedQuestion[`questionText${index}`]}
                onChange={(e) =>
                  setUpdatedQuestion((prev) => ({
                    ...prev,
                    [`questionText${index}`]: e.target.value,
                  }))
                }
                placeholder={`Question Text ${index}`}
                style={{padding: '10px',width: '100%',marginBottom: '10px',resize: 'none', overflow: 'hidden', }}
                rows="1" // Minimum height
                onInput={(e) => {
                  e.target.style.height = 'auto'; // Reset height before calculation
                  e.target.style.height = `${e.target.scrollHeight}px`; // Set height to content
                }}
              />

                <input type="text" value={updatedQuestion[`questionImage${index}`]}
                  onChange={(e) =>
                    setUpdatedQuestion((prev) => ({
                      ...prev,
                      [`questionImage${index}`]: e.target.value,
                    }))
                  } placeholder={`Question Image ${index} URL`} style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
                />
                {updatedQuestion[`questionImage${index}`] && (
                  <img src={updatedQuestion[`questionImage${index}`]} alt={`Preview ${index}`} style={{ maxWidth: '25%', maxHeight: '200px', borderRadius: '5px', marginBottom: '10px', }}/>
                )}
                {/* Table Editor */}
                <div>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input type="number" min="1" placeholder="Rows"
                      value={updatedQuestion[`questionTable${index}`]?.rows || 0}
                      onChange={(e) =>
                        setUpdatedQuestion((prev) => {
                          const rows = parseInt(e.target.value) || 0;
                          const cols = updatedQuestion[`questionTable${index}`]?.cols || 0;
                          return {
                            ...prev,
                            [`questionTable${index}`]: generateTableData(rows, cols),
                          };
                        })
                      } style={{ width: '50%', padding: '10px' }}
                    />
                    <input type="number" min="1" placeholder="Columns"
                      value={updatedQuestion[`questionTable${index}`]?.cols || 0}
                      onChange={(e) =>
                        setUpdatedQuestion((prev) => {
                          const rows = updatedQuestion[`questionTable${index}`]?.rows || 0;
                          const cols = parseInt(e.target.value) || 0;
                          return {
                            ...prev,
                            [`questionTable${index}`]: generateTableData(rows, cols),
                          };
                        })
                      } style={{ width: '50%', padding: '10px' }}
                    />
                  </div>
                  <table border="1" style={{ width: '100%', textAlign: 'center', marginBottom: '10px' }}>
                    <tbody>
                      {updatedQuestion[`questionTable${index}`]?.data?.map((row, rowIndex) => (
                        <tr key={`row-${rowIndex}`}>
                          {row.map((cell, colIndex) => (
                            <td key={`cell-${rowIndex}-${colIndex}`}>
                              <input
                                type="text"
                                value={cell}
                                onChange={(e) =>
                                  updateTableCell(updatedQuestion, 'questionTable', index, rowIndex, colIndex, e.target.value)
                                }
                                style={{ width: '100%', padding: '5px' }}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {/* Options */}
            {['a', 'b', 'c', 'd'].map((option) => (
              <input key={option} type="text" value={updatedQuestion.options[option]}
                onChange={(e) =>
                  setUpdatedQuestion((prev) => ({
                    ...prev,
                    options: { ...prev.options, [option]: e.target.value },
                  }))
                }
                placeholder={`Option ${option.toUpperCase()}`}
                style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
              />
            ))}

            {/* Correct Answer */}
            <input type="text" value={updatedQuestion.correctAns}
              onChange={(e) =>
                setUpdatedQuestion((prev) => ({
                  ...prev,
                  correctAns: e.target.value,
                }))
              } placeholder="Correct Answer (a, b, c, or d)" style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
            />
            {/* Answer Description Fields */}
            {[1, 2, 3].map((index) => (
              <div key={`answer-description-${index}`}>
                <textarea
                value={updatedQuestion[`answerDescriptionText${index}`]}
                onChange={(e) =>
                  setUpdatedQuestion((prev) => ({
                    ...prev,
                    [`answerDescriptionText${index}`]: e.target.value,
                  }))
                }
                placeholder={`Answer Description Text ${index}`}
                style={{
                  padding: '10px',
                  width: '100%',
                  marginBottom: '10px',
                  resize: 'none', // Disable manual resizing
                  overflow: 'hidden', // Disable scrolling
                }}
                rows="1" // Minimum height
                onInput={(e) => {
                  e.target.style.height = 'auto'; // Reset height before calculation
                  e.target.style.height = `${e.target.scrollHeight}px`; // Set height to content
                }}
              />
                <input
                  type="text"
                  value={updatedQuestion[`answerDescriptionImage${index}`]}
                  onChange={(e) =>
                    setUpdatedQuestion((prev) => ({
                      ...prev,
                      [`answerDescriptionImage${index}`]: e.target.value,
                    }))
                  }
                  placeholder={`Answer Description Image ${index} URL`}
                  style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
                />
                {updatedQuestion[`answerDescriptionImage${index}`] && (
                  <img
                    src={updatedQuestion[`answerDescriptionImage${index}`]}
                    alt={`Answer Description Preview ${index}`}
                    style={{
                      maxWidth: '25%',
                      maxHeight: '200px',
                      borderRadius: '5px',
                      marginBottom: '10px',
                    }}
                  />
                )}
                <div>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input type="number" min="1" placeholder="Rows"
                      value={updatedQuestion[`answerDescriptionTable${index}`]?.rows || 0}
                      onChange={(e) =>
                        setUpdatedQuestion((prev) => {
                          const rows = parseInt(e.target.value) || 0;
                          const cols = updatedQuestion[`answerDescriptionTable${index}`]?.cols || 0;
                          return {
                            ...prev,
                            [`answerDescriptionTable${index}`]: generateTableData(rows, cols),
                          };
                        })
                      } style={{ width: '50%', padding: '10px' }}
                    />
                    <input type="number" min="1" placeholder="Columns"
                      value={updatedQuestion[`answerDescriptionTable${index}`]?.cols || 0}
                      onChange={(e) =>
                        setUpdatedQuestion((prev) => {
                          const rows = updatedQuestion[`answerDescriptionTable${index}`]?.rows || 0;
                          const cols = parseInt(e.target.value) || 0;
                          return {
                            ...prev,
                            [`answerDescriptionTable${index}`]: generateTableData(rows, cols),
                          };
                        })
                      } style={{ width: '50%', padding: '10px' }}
                    />
                  </div>
                  <table border="1" style={{ width: '100%', textAlign: 'center', marginBottom: '10px' }}>
                    <tbody>
                      {updatedQuestion[`answerDescriptionTable${index}`]?.data?.map((row, rowIndex) => (
                        <tr key={`row-${rowIndex}`}>
                          {row.map((cell, colIndex) => (
                            <td key={`cell-${rowIndex}-${colIndex}`}>
                              <input
                                type="text"
                                value={cell}
                                onChange={(e) =>
                                  updateTableCell(updatedQuestion, 'answerDescriptionTable', index, rowIndex, colIndex, e.target.value)
                                }
                                style={{ width: '100%', padding: '5px' }}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            {/* Update Button */}
            <button onClick={handleUpdateQuestion} style={{ backgroundColor: 'green', color: 'white', padding: '10px 15px', borderRadius: '4px', }} >
              <FontAwesomeIcon icon={faEdit} style={{ marginRight: '5px' }} />
              Update Question
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
};

const Modal = ({ title, children, onClose }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '800px', textAlign: 'center', position: 'relative', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <span onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', fontSize: '20px' }}>
        <FontAwesomeIcon icon={faTimes} />
      </span>
      <h3>{title}</h3>
      {children}
    </div>
  </div>
);

export default Queset;
