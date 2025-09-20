import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faTrash, faSearch, faEdit, faFolder, faImage, faDollarSign,
  faAlignLeft, faBook, faGripVertical, faArrowLeft, faSort, faCheck, faListOl
} from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Dropdown, Form, Modal, InputGroup, Badge, Breadcrumb } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// --- STYLES ---
const ComponentStyles = () => (
  <style>{`
    :root {
      --primary-color: #4338CA;
      --bg-main: #F9FAFB;
      --bg-content: #FFFFFF;
      --border-color: #E5E7EB;
      --drop-zone-bg: #E0E7FF;
      --text-dark: #1F2937;
      --text-light: #6B7280;
      --shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.05);
      --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
      --font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    .course-panel-container { background-color: var(--bg-main); padding: 2rem; min-height: 100vh; font-family: var(--font-family); }
    
    /* Grid View */
    .course-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }
    .folder-card { background: var(--bg-content); border-radius: 0.75rem; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); transition: all 0.2s ease-in-out; overflow: hidden; display: flex; flex-direction: column; }
    .folder-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
    .folder-body { padding: 1rem; text-align: center; cursor: pointer; flex-grow: 1; }
    .folder-thumbnail { width: 100%; height: 120px; border-radius: 0.5rem; background-color: #F3F4F6; margin-bottom: 1rem; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .folder-thumbnail img { width: 100%; height: 100%; object-fit: cover; }
    .folder-footer { border-top: 1px solid var(--border-color); background-color: #F9FAFB; padding: 0.5rem 1rem; display: flex; justify-content: space-between; align-items: center; }
    
    /* Reorder Mode */
    .reorder-list { max-width: 800px; margin: 0 auto; }
    .reorder-item { display: flex; align-items: center; background: var(--bg-content); border: 1px solid var(--border-color); border-radius: 0.5rem; padding: 0.75rem; margin-bottom: 0.5rem; box-shadow: var(--shadow-sm); user-select: none; }
    .reorder-item.dragging { box-shadow: var(--shadow-md); }
    .reorder-handle { font-size: 1.2rem; color: var(--text-light); cursor: grab; margin-right: 1rem; }
    .reorder-thumbnail { width: 40px; height: 40px; border-radius: 0.375rem; background-color: #F3F4F6; margin-right: 1rem; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .reorder-thumbnail img { width: 100%; height: 100%; object-fit: cover; }

    /* Detail View */
    .detail-view-layout { display: flex; flex-direction: column; gap: 2rem; }
    @media (min-width: 992px) { .detail-view-layout { flex-direction: row; } }
    .detail-view-sidebar { flex: 0 0 100%; }
    @media (min-width: 992px) { .detail-view-sidebar { flex: 0 0 320px; } }
    .detail-view-main { flex: 1; }
    .metadata-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem; }
    .metadata-item { background: var(--bg-main); padding: 1rem; border-radius: .5rem; border: 1px solid var(--border-color); }
    .metadata-item .label { font-size: 0.875rem; color: var(--text-light); margin-bottom: 0.25rem; }
    .metadata-item .value { font-size: 1.125rem; font-weight: 600; color: var(--text-dark); }
    .topic-list-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; border: 1px solid var(--border-color); border-radius: 0.5rem; margin-bottom: 0.5rem; background-color: var(--bg-content); transition: background-color 0.2s; }
    .topic-list-item:hover { background-color: var(--bg-main); }
    .empty-state { border: 2px dashed var(--border-color); border-radius: 0.75rem; padding: 3rem; text-align: center; background-color: var(--bg-content); }
  `}</style>
);


// --- MAIN COMPONENT ---
const Course = () => {
  const [courses, setCourses] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modals, setModals] = useState({ addEdit: null, addSubject: false, deleteCourse: null, deleteSubject: null });
  const [password, setPassword] = useState({ value: '', show: false });
  const [reorderMode, setReorderMode] = useState(false);
  const isDraggingRef = useRef(false);

  useEffect(() => { fetchCourses(); fetchSubjects(); }, []);
  const fetchCourses = async () => { if (isDraggingRef.current) return; try { const token = localStorage.getItem('token'); const { data } = await axios.get('/api/course', { headers: { Authorization: `Bearer ${token}` } }); setCourses(data || []); return data || []; } catch (err) { toast.error('Error fetching courses.'); return []; } };
  const fetchSubjects = async () => { try { const token = localStorage.getItem('token'); const { data } = await axios.get('/api/subject', { headers: { Authorization: `Bearer ${token}` } }); setSubjectOptions(data || []); } catch (err) { toast.error('Error fetching topics.'); } };
  const refreshActiveCourse = async (courseId) => { const allCourses = await fetchCourses(); if (allCourses) { const updatedCourse = allCourses.find(c => c._id === courseId); setActiveCourse(updatedCourse); } };
  const handleAddOrEditCourse = async (formData, courseId) => { try { const token = localStorage.getItem('token'); const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } }; const data = new FormData(); Object.keys(formData).forEach(key => data.append(key, formData[key])); if (courseId) { await axios.put(`/api/course/${courseId}`, data, config); toast.success('Course updated successfully.'); } else { await axios.post('/api/course', data, config); toast.success('Course added successfully.'); } fetchCourses(); setModals(prev => ({ ...prev, addEdit: null })); } catch (err) { toast.error(err.response?.data?.message || 'An error occurred.'); } };
  const handleDeleteCourse = async () => { try { await axios.post('/api/course/delete-with-password', { courseId: modals.deleteCourse, password: password.value }); toast.success('Course deleted successfully'); setCourses(prev => prev.filter(c => c._id !== modals.deleteCourse)); setModals(prev => ({ ...prev, deleteCourse: null })); setPassword({ value: '', show: false }); } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete course'); } };
  const handleAddSubjects = async (subjectIds) => { if (!activeCourse || subjectIds.length === 0) return; try { const token = localStorage.getItem('token'); await axios.put(`/api/course/${activeCourse._id}/add-subject`, { subjectIds }, { headers: { Authorization: `Bearer ${token}` } }); toast.success('Topics added successfully.'); refreshActiveCourse(activeCourse._id); setModals(prev => ({...prev, addSubject: false})); } catch (err) { toast.error(err.response?.data?.message || 'Error adding topics.'); } };
  const handleDeleteSubject = async () => { try { const { courseId, subjectId } = modals.deleteSubject; await axios.put(`/api/course/${courseId}/remove-subject`, { subjectId, password: password.value }); toast.success('Subject deleted successfully.'); refreshActiveCourse(courseId); setModals(prev => ({...prev, deleteSubject: null})); setPassword({ value: '', show: false }); } catch (err) { toast.error('Error deleting subject.'); } };
  const onDragStart = () => { isDraggingRef.current = true; };
  const onDragEnd = (result) => {
    isDraggingRef.current = false;
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;
    const reorder = (list, startIndex, endIndex) => { const result = Array.from(list); const [removed] = result.splice(startIndex, 1); result.splice(endIndex, 0, removed); return result; };
    const orderedCourses = reorder(filteredCourses, source.index, destination.index);
    const newOrderIds = orderedCourses.map(c => c._id);
    const visibleIdsSet = new Set(newOrderIds);
    const invisibleCourses = courses.filter(c => !visibleIdsSet.has(c._id));
    setCourses([...orderedCourses, ...invisibleCourses]);
    (async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.put('/api/course/reorder', { order: newOrderIds }, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Order saved');
      } catch (err) {
        toast.error('Failed to save order; reloading.');
        fetchCourses();
      }
    })();
  };
  const filteredCourses = courses.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <ComponentStyles />
      <ToastContainer position="top-right" theme="colored" autoClose={3000} />
      <div className="course-panel-container">
        {activeCourse ? (
          <CourseDetailView course={activeCourse} onBack={() => setActiveCourse(null)} onAddSubject={() => setModals(prev => ({...prev, addSubject: true}))} onDeleteSubject={(subjectId) => setModals(prev => ({ ...prev, deleteSubject: { courseId: activeCourse._id, subjectId }}))} />
        ) : (
          <CourseGridView courses={filteredCourses} searchQuery={searchQuery} onSearchChange={setSearchQuery} onCourseClick={setActiveCourse} onDragStart={onDragStart} onDragEnd={onDragEnd} onNewCourse={() => setModals(prev => ({...prev, addEdit: 'new'}))} onEditCourse={(course) => setModals(prev => ({...prev, addEdit: course}))} onDeleteCourse={(courseId) => setModals(prev => ({...prev, deleteCourse: courseId}))} reorderMode={reorderMode} setReorderMode={setReorderMode} />
        )}
      </div>

      {modals.addEdit && <AddEditCourseModal show={!!modals.addEdit} course={modals.addEdit === 'new' ? null : modals.addEdit} onHide={() => setModals(prev => ({...prev, addEdit: null}))} onSubmit={handleAddOrEditCourse} />}
      
      {/* UPDATED: Pass existingSubjectIds to the modal */}
      {modals.addSubject && activeCourse && (
          <AddSubjectModal
              show={modals.addSubject}
              subjectOptions={subjectOptions}
              existingSubjectIds={activeCourse.subjects.map(s => s._id)}
              onHide={() => setModals(prev => ({ ...prev, addSubject: false }))}
              onSubmit={handleAddSubjects}
          />
      )}

      {(modals.deleteCourse || modals.deleteSubject) && <DeleteConfirmationModal show={!!modals.deleteCourse || !!modals.deleteSubject} onHide={() => setModals(prev => ({...prev, deleteCourse: null, deleteSubject: null}))} onConfirm={modals.deleteCourse ? handleDeleteCourse : handleDeleteSubject} passwordState={[password, setPassword]} />}
    </>
  );
};

// --- SUB-COMPONENTS ---

const CourseGridView = ({ courses, searchQuery, onSearchChange, onCourseClick, onDragStart, onDragEnd, onNewCourse, onEditCourse, onDeleteCourse, reorderMode, setReorderMode }) => (
  <>
    <header className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
      <h1 className="fw-bold text-dark">{reorderMode ? 'Sort Courses' : 'Course Library'}</h1>
      <div className="d-flex gap-2 w-100 w-md-auto mt-3 mt-md-0">
        {!reorderMode && (
          <>
            <InputGroup><InputGroup.Text><FontAwesomeIcon icon={faSearch} /></InputGroup.Text><Form.Control type="text" placeholder="Search..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} /></InputGroup>
            <Button variant="outline-secondary" onClick={() => setReorderMode(true)}><FontAwesomeIcon icon={faSort} className="me-2" />Reorder</Button>
            <Button onClick={onNewCourse} style={{backgroundColor: 'var(--primary-color)'}}><FontAwesomeIcon icon={faPlus} className="me-2" />New</Button>
          </>
        )}
        {reorderMode && <Button variant="success" onClick={() => setReorderMode(false)}><FontAwesomeIcon icon={faCheck} className="me-2" />Done</Button>}
      </div>
    </header>
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      {reorderMode ? (
        <ReorderListView courses={courses} />
      ) : (
        <Droppable droppableId="courses-droppable" isDropDisabled={true}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className='course-grid'>
              {courses.map((course) => (
                <div key={course._id} className="folder-card">
                  <div className="folder-body" onClick={() => onCourseClick(course)}>
                    <div className="folder-thumbnail">{course.image ? <img src={course.image} alt={course.name}/> : <span className="text-secondary opacity-50"><FontAwesomeIcon icon={faFolder} size="2x"/></span>}</div>
                    <h5 className="fw-bold text-dark fs-6">{course.name}</h5>
                  </div>
                  <div className="folder-footer">
                    <Badge pill bg="light" text="dark">${course.price ?? 0}</Badge>
                    <div>
                      <Button variant="link" size="sm" className="text-secondary p-1" onClick={(e) => { e.stopPropagation(); onEditCourse(course);}}><FontAwesomeIcon icon={faEdit}/></Button>
                      {course.name !== 'CFA LEVEL - 1' && <Button variant="link" size="sm" className="text-danger p-1" onClick={(e) => { e.stopPropagation(); onDeleteCourse(course._id);}}><FontAwesomeIcon icon={faTrash}/></Button>}
                    </div>
                  </div>
                </div>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </DragDropContext>
  </>
);

const ReorderListView = ({ courses }) => (
  <Droppable droppableId="courses-reorder-droppable">
    {(provided) => (
      <div {...provided.droppableProps} ref={provided.innerRef} className="reorder-list">
        {courses.map((course, index) => (
          <Draggable key={course._id} draggableId={course._id} index={index}>
            {(providedDraggable, snapshot) => (
              <div ref={providedDraggable.innerRef} {...providedDraggable.draggableProps} className={`reorder-item ${snapshot.isDragging ? 'dragging' : ''}`}>
                <span {...providedDraggable.dragHandleProps} className="reorder-handle"><FontAwesomeIcon icon={faGripVertical} /></span>
                <div className="reorder-thumbnail">{course.image ? <img src={course.image} alt=""/> : <FontAwesomeIcon icon={faFolder} className="text-secondary opacity-50"/>}</div>
                <span className="fw-bold">{course.name}</span>
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

const CourseDetailView = ({ course, onBack, onAddSubject, onDeleteSubject }) => (
  <div>
    <Breadcrumb className="mb-3">
      <Breadcrumb.Item onClick={onBack} href="#" className="fw-bold"><FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Course Library</Breadcrumb.Item>
      <Breadcrumb.Item active>{course.name}</Breadcrumb.Item>
    </Breadcrumb>
    <header className="d-flex justify-content-between align-items-center mb-4">
      <h1 className="fw-bolder text-dark mb-0">{course.name}</h1>
      <Button variant="primary" onClick={onAddSubject} style={{backgroundColor: 'var(--primary-color)'}}><FontAwesomeIcon icon={faPlus} className="me-2"/>Add Topic</Button>
    </header>
    <div className="detail-view-layout">
      <aside className="detail-view-sidebar">
        <div className="p-4 bg-white rounded shadow-sm">
          {course.image ? <img src={course.image} alt={course.name} className="img-fluid rounded mb-3"/> : <div className="rounded bg-light d-flex align-items-center justify-content-center mb-3" style={{height: '200px'}}><FontAwesomeIcon icon={faImage} size="3x" className="text-light"/></div>}
          <h5 className="fw-bold">About this course</h5>
          <p className="text-muted small mb-0">{course.description || 'No description available.'}</p>
          <div className="metadata-grid">
            <div className="metadata-item">
              <div className="label"><FontAwesomeIcon icon={faDollarSign} className="me-2"/>Price</div>
              <div className="value">${course.price ?? 'N/A'}</div>
            </div>
            <div className="metadata-item">
              <div className="label"><FontAwesomeIcon icon={faListOl} className="me-2"/>Topics</div>
              <div className="value">{course.subjects?.length || 0}</div>
            </div>
          </div>
        </div>
      </aside>
      <main className="detail-view-main">
        {course.subjects?.length > 0 ? (
          course.subjects.map((subject) => (
            <div key={subject._id} className="topic-list-item">
              <div className="fw-bold"><FontAwesomeIcon icon={faBook} className="me-3" style={{color: 'var(--primary-color)'}}/>{subject.name}</div>
              <Button variant="link" size="sm" className="text-danger" onClick={() => onDeleteSubject(subject._id)}><FontAwesomeIcon icon={faTrash} /></Button>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <h4 className="fw-bold">No Topics Yet</h4>
            <p className="text-muted">Click the "Add Topic" button to start building your course.</p>
          </div>
        )}
      </main>
    </div>
  </div>
);

// --- MODAL SUB-COMPONENTS ---
const AddEditCourseModal = ({ show, course, onHide, onSubmit }) => { const [name, setName] = useState(''); const [price, setPrice] = useState(''); const [description, setDescription] = useState(''); const [image, setImage] = useState(null); useEffect(() => { if (course) { setName(course.name || ''); setPrice(course.price || ''); setDescription(course.description || ''); setImage(null); } else { setName(''); setPrice(''); setDescription(''); setImage(null); } }, [course]); const handleSubmit = () => { onSubmit({ name, price, description, image }, course?._id); }; return ( <Modal show={show} onHide={onHide} centered><Modal.Header closeButton><Modal.Title>{course ? 'Edit Course' : 'Add New Course'}</Modal.Title></Modal.Header><Modal.Body><Form.Group className="mb-3"><Form.Label>Course Name</Form.Label><Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} /></Form.Group><Form.Group className="mb-3"><Form.Label>Price ($)</Form.Label><Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} /></Form.Group><Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></Form.Group><Form.Group><Form.Label>Course Image</Form.Label><Form.Control type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} /></Form.Group></Modal.Body><Modal.Footer><Button variant="secondary" onClick={onHide}>Cancel</Button><Button style={{backgroundColor: 'var(--primary-color)'}} onClick={handleSubmit}>{course ? 'Save Changes' : 'Add Course'}</Button></Modal.Footer></Modal> );};

// UPDATED: The AddSubjectModal now prevents adding duplicate topics
const AddSubjectModal = ({ show, onHide, onSubmit, subjectOptions, existingSubjectIds = [] }) => {
  const [selected, setSelected] = useState([]);

  const availableSubjects = React.useMemo(() => 
    subjectOptions.filter(s => !existingSubjectIds.includes(s._id)),
    [subjectOptions, existingSubjectIds]
  );
  
  const isAllSelected = availableSubjects.length > 0 && selected.length === availableSubjects.length;
  
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelected([]);
    } else {
      setSelected(availableSubjects.map(s => s._id));
    }
  };
  
  const handleSubmit = () => {
      onSubmit(selected);
      setSelected([]);
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Topics</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Dropdown>
          <Dropdown.Toggle variant="outline-secondary" className="w-100 d-flex justify-content-between align-items-center">
            {selected.length > 0 ? `${selected.length} topics selected` : 'Select Topics'}
          </Dropdown.Toggle>
          <Dropdown.Menu className="w-100 p-2" style={{ maxHeight: '250px', overflowY: 'auto' }}>
            {availableSubjects.length > 0 && (
                <>
                    <Form.Check 
                        type="checkbox" 
                        label="Select All Available" 
                        checked={isAllSelected} 
                        onChange={handleSelectAll} 
                        className="fw-bold mb-2" 
                    />
                    <Dropdown.Divider />
                </>
            )}
            {subjectOptions.map(s => {
              const isAdded = existingSubjectIds.includes(s._id);
              return (
                <Form.Check 
                  key={s._id} 
                  type="checkbox" 
                  label={isAdded ? `${s.name} (Already in course)` : s.name} 
                  checked={selected.includes(s._id)} 
                  disabled={isAdded}
                  onChange={() => 
                    setSelected(p => p.includes(s._id) ? p.filter(id => id !== s._id) : [...p, s._id])
                  } 
                />
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button 
          style={{backgroundColor: 'var(--primary-color)'}} 
          onClick={handleSubmit}
          disabled={selected.length === 0}
        >
          Add Selected
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const DeleteConfirmationModal = ({ show, onHide, onConfirm, passwordState }) => { const [password, setPassword] = passwordState; return ( <Modal show={show} onHide={onHide} centered size="sm"><Modal.Header closeButton><Modal.Title>Confirm Deletion</Modal.Title></Modal.Header><Modal.Body><p>This is irreversible. Enter password to confirm.</p><InputGroup><Form.Control type={password.show ? 'text' : 'password'} value={password.value} onChange={(e) => setPassword(p => ({...p, value: e.target.value}))} autoFocus /><Button variant="outline-secondary" onClick={() => setPassword(p => ({...p, show: !p.show}))}>{password.show ? <FaEyeSlash /> : <FaEye />}</Button></InputGroup></Modal.Body><Modal.Footer><Button variant="secondary" onClick={onHide}>Cancel</Button><Button variant="danger" onClick={onConfirm}>Delete Permanently</Button></Modal.Footer></Modal> );};

export default Course;