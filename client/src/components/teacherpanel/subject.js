import React, { useState, useEffect } from 'react';
import axios from 'axios'; // If using 'react-modal' library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faTimes, faDollarSign, faCopy, faMinus } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dropdown, Form, Tab, Nav, InputGroup } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';
import { FaMinus } from 'react-icons/fa';

const Subject = () => {
  const [subjects, setSubjects] = useState([]);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showEditSubjectModal, setShowEditSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectDescription, setNewSubjectDescription] = useState('');
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newSubjectPrice, setNewSubjectPrice] = useState('');
  const [currentSubjectId, setCurrentSubjectId] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [quesets, setQuesets] = useState([]); // Store available quesets
  const [selectedQueset, setSelectedQueset] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeQuesetIndex, setActiveQuesetIndex] = useState(0);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSubjects();
    fetchQueset();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/subject");
      setSubjects(data);
      setFilteredSubjects(data);
    } catch (error) {
      toast.error("Error fetching Topics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = subjects.filter((subject) =>
      subject.name.toLowerCase().includes(query)
    );

    setFilteredSubjects(filtered);
  };

  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) {
      toast.error("Please enter a Topic name.");
      return;
    }
    const priceInDollars = parseFloat(newSubjectPrice);
    if (isNaN(priceInDollars) || priceInDollars <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/subject', { name: newSubjectName, price: priceInDollars.toFixed(2), description: newSubjectDescription });
      setNewSubjectName('');
      setNewSubjectPrice('');
      setNewSubjectDescription('');
      setShowAddSubjectModal(false);
      fetchSubjects();
    } catch (error) {
      toast.error('Error adding Topic:', error);
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
      await axios.put(`/api/subject/${editingSubject._id}`, { name: editingSubject.name, price: editingSubject.price, description: editingSubject.description });
      setShowEditSubjectModal(false);
      fetchSubjects();
    } catch (error) {
      toast.error('Error updating Topic:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm('Are you sure you want to delete this Topic?')) {
      try {
        await axios.delete(`/api/subject/${id}`);
        fetchSubjects();
      } catch (error) {
        toast.error('Error deleting Topic:', error);
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
        toast.error("Failed to delete question. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("An error occurred while deleting the question.");
    }
  };

  // Fetch quesets from backend
  const fetchQueset = () => {
    setLoading(true); // Start loader
    axios.get("/api/queset")
      .then((response) => {
        console.log("Fetched subjects:", response.data);
        setQuesets(response.data);
      })
      .catch((error) => console.error("Error fetching subjects:", error))
      .finally(() => setLoading(false));
  };

  const selectedQuesetsText = selectedQueset.length
    ? quesets
      .filter((q) => selectedQueset.includes(q._id))
      .map((q) => q.name)
      .join(", ")
    : "Select Quesets";

  // Handle checkbox selection
  const handleCheckboxChange = (quesetId) => {
    setSelectedQueset((prev) => {
      const updatedSelection = prev.includes(quesetId)
        ? prev.filter((id) => id !== quesetId) // Remove if already selected
        : [...prev, quesetId]; // Add if not selected

      console.log("Updated Selected Quesets:", updatedSelection);
      return updatedSelection;
    });
  };


  // Function to add queset's questions to subject
  const handleAddQuesetToSubject = (subjectId) => {
    if (selectedQueset.length === 0) {
      toast.warn("Please select at least one queset!");
      return;
    }

    axios.post(`/api/subject/${subjectId}/add-queset-questions`, { quesetIds: selectedQueset })
      .then((response) => {
        toast.success("Questions from selected quesets have been added to the Topic!");
        setSelectedQueset([]); // Clear selection after successful addition
        setShowDropdown(false);
        fetchQueset();
        fetchSubjects();
      })
      .catch((error) => {
        console.error("Error adding queset questions to Topic:", error);
        toast.error("An error occurred while adding the questions.");
      });
  };

  const handleRemoveQuesetFromSubject = (subjectId, quesetId) => {
    axios
      .delete(`/api/subject/${subjectId}/remove-queset`, { data: { quesetId } })
      .then((response) => {
        toast.success("Queset removed successfully!");
        fetchSubjects(); // Refresh subject data
      })
      .catch((error) => {
        console.error("Error removing queset:", error);
        toast.error("An error occurred while removing the queset.");
      });
  };

  console.log(subjects)

  const handleCopySubject = (subject) => {
    // Extracting the existing subjects to find copies
    const copyCount = subjects.filter(s => s.name.startsWith(`${subject.name} copy`)).length;
    const newName = `${subject.name} copy (${copyCount + 1})`;

    // Copy the subject along with its quesets
    const newSubject = {
      name: newName,
      price: subject.price, // Keeping the price
      quesets: subject.quesets ? subject.quesets.map(q => ({ ...q })) : [] // Deep copy quesets
    };

    console.log('newSubject', newSubject);

    axios.post(`/api/subject`, newSubject)
      .then((response) => {
        console.log("Response from API:", response.data);
        toast.success(`Subject "${newName}" copied successfully!`);
        fetchSubjects(); // Refresh subject list
      })
      .catch((error) => {
        console.error("Error copying subject:", error);
        toast.error("An error occurred while copying the subject.");
      });
  };
  const sanitizeHtml = (html) => html.replace(/<br\s*\/?>/g, "").trim();

  return (
    <div>
      <ToastContainer />
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#100B5C' }}>Topics Details</h2>

      {/* Button to Add Subject */}
      <button onClick={() => setShowAddSubjectModal(true)} style={{ marginBottom: '20px', backgroundColor: '#100B5C', color: 'white', padding: '10px 12px', fontSize: '14px', borderRadius: '8px', cursor: 'pointer' }}>
        <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px', }} /> Add Topic
      </button>

      <div className="mt-3">
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <BsSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search by Subject Name..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </InputGroup>
      </div>

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div style={{ display: 'flex', zIndex: 999, justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '400px', textAlign: 'center', position: 'relative' }}>
            <span onClick={() => setShowAddSubjectModal(false)} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', fontSize: '20px' }}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
            <h3>Add New Topic</h3>
            <input type="text" value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} placeholder="Topic Name" style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
            <div style={{ position: 'relative', width: '100%', margin: '10px 0' }}>
              <FontAwesomeIcon icon={faDollarSign} style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', fontSize: '16px', color: '#888' }} />
              <input type="number" value={newSubjectPrice} onChange={(e) => setNewSubjectPrice(e.target.value)} placeholder="Topic Price" style={{ width: '100%', padding: '10px 10px 10px 30px', margin: '0', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} min="0" />
            </div>
            <textarea
              value={newSubjectDescription}
              onChange={(e) => setNewSubjectDescription(e.target.value)}
              className="form-control mt-2"
              placeholder="Enter Subject description"
            />
            <button className='mt-3' onClick={handleAddSubject} style={{ backgroundColor: '#100B5C', color: 'white', padding: '10px 12px', fontSize: '14px', borderRadius: '8px', cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px', }} />Add Topic
            </button>
          </div>
        </div>
      )}

      {/* Edit Subject Modal */}
      {showEditSubjectModal && (
        <div style={{ display: 'flex', zIndex: 999, justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '400px', textAlign: 'center', position: 'relative' }}>
            <span onClick={() => setShowEditSubjectModal(false)} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', fontSize: '20px' }}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
            <h3>Edit Topic</h3>
            <input type="text" value={editingSubject.name} onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })} placeholder="Topic Name" style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
            <div style={{ position: 'relative', width: '100%', margin: '10px 0' }}>
              <FontAwesomeIcon icon={faDollarSign} style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', fontSize: '16px', color: '#888' }} />
              <input type="number" value={editingSubject.price} onChange={(e) => setEditingSubject({ ...editingSubject, price: e.target.value })} placeholder="Topic Price" style={{ width: '100%', padding: '10px 10px 10px 30px', margin: '0', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
            </div>
            <textarea
              value={editingSubject.description}
              onChange={(e) => setEditingSubject({ ...editingSubject, description: e.target.value })}
              className="form-control mt-2"
              placeholder="Enter Subject description"
            />
            <button className='mt-3' onClick={handleUpdateSubject} style={{ backgroundColor: '#100B5C', color: 'white', padding: '10px 12px', fontSize: '14px', borderRadius: '8px', cursor: 'pointer' }}>
              Update Topic
            </button>
          </div>
        </div>
      )}

      {/* List of Subjects */}
      {filteredSubjects.map((subject) => (
        <div key={subject._id} onClick={() => toggleSubjectExpansion(subject._id)} style={{ marginBottom: '20px', backgroundColor: '#f1f1f1', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            {/* Left Section: Expand Icon, Subject Name, and Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div className="d-flex align-items-center gap-3" style={{ fontWeight: 'bold' }}>
                <button
                  className="pd-0"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents parent click event
                    setExpandedSubject(expandedSubject === subject._id ? null : subject._id);
                  }}
                  style={{ background: "transparent", border: "none", cursor: "pointer" }}
                >
                  <FontAwesomeIcon
                    icon={expandedSubject === subject._id ? faMinus : faPlus}
                    style={{
                      color: "#4CAF50",
                      cursor: "pointer",
                      fontSize: "20px",
                    }}
                  />
                </button>
                {subject.name}
              </div>
              <span style={{ color: '#555', fontSize: '14px', marginLeft: '74px' }}>{subject.description || ''}</span>
            </div>

            {/* Right Section: Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={(e) => {
                e.stopPropagation();
                handleEditSubject(subject);
              }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faEdit} style={{ color: '#333', fontSize: '20px' }} />
              </button>

              <button onClick={(e) => {
                e.stopPropagation();
                handleCopySubject(subject);
              }} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faCopy} style={{ color: '#007bff', cursor: 'pointer', fontSize: '20px' }} />
              </button>

              <button onClick={(e) => {
                e.stopPropagation();
                handleDeleteSubject(subject._id);
              }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faTrash} style={{ color: '#e74c3c', cursor: 'pointer', fontSize: '20px' }} />
              </button>
            </div>
          </div>


          {expandedSubject === subject._id && (
            <div className='select-queset' style={{ marginTop: '10px' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', gap: '50px', marginBottom: '20px' }}>
                {/* Checkboxes to select Quesets */}
                <Dropdown show={showDropdown} onToggle={(isOpen) => setShowDropdown(isOpen)}>
                  <Dropdown.Toggle variant="light" className="text-left d-flex align-items-center justify-content-between select-topic" onClick={() => setShowDropdown(!showDropdown)}>
                    {selectedQuesetsText}
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    className="topic-dropdown w-100"
                    style={{ maxHeight: "200px", overflowY: "auto", padding: "10px" }}
                  >
                    {quesets.map((queset) => (
                      <Form.Check
                        key={queset._id}
                        id={`checkbox-${queset._id}`}
                        type="checkbox"
                        className="d-flex align-items-center"
                        label={queset.name}
                        checked={selectedQueset.includes(queset._id)}
                        onChange={() => handleCheckboxChange(queset._id)}
                        style={{ cursor: "pointer" }}
                      />
                    ))}
                  </Dropdown.Menu>
                </Dropdown>

                {/* Button to add selected quesets */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSubjectId(subject._id);
                    handleAddQuesetToSubject(subject._id);
                  }}
                  style={{
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

              <div style={{ background: "#f9f9f9", padding: "15px", borderRadius: "10px" }}>
                {/* Tabs Navigation */}
                <Nav variant="tabs" activeKey={activeQuesetIndex} onSelect={(selectedKey) => setActiveQuesetIndex(selectedKey)}>
                  {subject.quesets?.length > 0 ? (
                    subject.quesets.map((subjectQueset, index) => (
                      <Nav.Item key={subjectQueset._id} style={{ display: 'flex', alignItems: 'center' }}>
                        <Nav.Link eventKey={`${subject._id}-${index}`}>
                          {subjectQueset.name}
                          <button className='btn'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveQuesetFromSubject(subject._id, subjectQueset._id);
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} style={{ color: 'red' }} />
                          </button>
                        </Nav.Link>
                      </Nav.Item>
                    ))
                  ) : (
                    <Nav.Item key={subject._id}>
                      <Nav.Link eventKey={`no-queset-${subject._id}`} disabled>
                        No quesets available.
                      </Nav.Link>
                    </Nav.Item>
                  )}
                </Nav>

                {/* Tab Content */}
                <Tab.Content style={{ marginTop: "15px" }} activeKey={activeQuesetIndex}>
                  {subject.quesets?.map((queset, index) => (
                    <Tab.Pane
                      key={queset._id}
                      eventKey={`${subject._id}-${index}`}
                      active={activeQuesetIndex === `${subject._id}-${index}`}
                    >
                      {queset.questions?.length > 0 ? (
                        queset.questions.map((question, qIndex) => (
                          <div key={question._id || qIndex} style={{ background: "#fff", padding: "10px", marginTop: "10px", borderRadius: "5px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                            <h4>Question {qIndex + 1}</h4>
                            {["questionText1", "questionText2", "questionText3"].map(
                              (key) =>
                                question[key] && (
                                  <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(question[key]) }} />
                                )
                            )}
                            {["questionImage1", "questionImage2", "questionImage3"].map(
                              (key) =>
                                question[key] && (
                                  <div key={key}>
                                    <img src={question[key]} style={{ maxWidth: "100%", borderRadius: "5px", marginBottom: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }} />
                                  </div>
                                )
                            )}
                            <p><strong>Options:</strong></p>
                            <ul style={{ listStyleType: "none", paddingLeft: "10px" }}>
                              {Object.entries(question.options || {}).map(([key, value]) => (
                                <li key={key} className='d-flex'>
                                  {key.toUpperCase()}. <span dangerouslySetInnerHTML={{ __html: value }} />
                                </li>
                              ))}
                            </ul>
                            <p><strong>Correct Answer:</strong> <span dangerouslySetInnerHTML={{ __html: question.correctAns }} /></p>
                          </div>
                        ))
                      ) : (
                        <p style={{ marginTop: "10px", fontStyle: "italic", color: "#666" }}>No questions added yet.</p>
                      )}
                    </Tab.Pane>
                  ))}
                </Tab.Content>
              </div>

            </div>
          )}
        </div>
      ))
      }
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