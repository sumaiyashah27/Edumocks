const express = require('express');
const Queset = require('../models/queset-model');
const Question = require('../models/question-model');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const stream = require('stream');
const { Parser } = require('json2csv'); 
const upload = multer({ storage: multer.memoryStorage() });

// GET all quesets
router.get('/', async (req, res) => {
  try {
    const quesets = await Queset.find().populate('questions').sort({ createdAt: 1 });

    if (!quesets.length) {
      return res.status(404).json({ message: 'No quesets found' });
    }

    res.status(200).json(quesets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching Quesets', error: err.message });
  }
});

  
// POST: Create a new queset
router.post('/', async (req, res) => {
  const { name, questions = [], originalId } = req.body; // Accept `originalId` for cloning

  if (!name) {
      return res.status(400).json({ message: 'Queset name is required' });
  }

  try {
      let createdAt = Date.now(); // Default timestamp

      // If cloning, set `createdAt` slightly after the original queset
      if (originalId) {
          const originalQueset = await Queset.findById(originalId);
          if (originalQueset) {
              createdAt = new Date(originalQueset.createdAt.getTime() + 1); // Ensure it appears below
          }
      }

      const newQueset = new Queset({ name, questions, createdAt });
      await newQueset.save();
      res.status(201).json(newQueset);
  } catch (error) {
      console.error('Error adding queset:', error);
      res.status(500).json({ message: 'Error adding queset', error });
  }
});


// PUT: Update a queset
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;  // Expecting 'name' in the body
  
    try {
      const updatedQueset = await Queset.findByIdAndUpdate(id, { name }, { new: true });
      if (!updatedQueset) {
        return res.status(404).json({ message: 'Queset not found' });
      }
      res.json(updatedQueset);
    } catch (error) {
      res.status(500).json({ message: 'Error updating queset', error });
    }
});  

// DELETE: Delete a queset
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedQueset = await Queset.findByIdAndDelete(id);
    if (!deletedQueset) {
      return res.status(404).json({ message: 'Queset not found' });
    }
    res.status(200).json({ message: 'Queset deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting queset', error });
  }
});
//=============================================================================================
//==============================================================================================

// Route to add a new question to a queset
router.post('/:quesetId/add', async (req, res) => {
  try {
    console.log('Request body received:', req.body);
    console.log('QusetId received:', req.params.quesetId);

    const { quesetId } = req.params;
    const { index, ...newQuestion } = req.body; // Get index from request

    // Validate correctAns field
    if (!newQuestion.correctAns) {
      return res.status(400).json({ message: 'Correct answer is required.' });
    }

    // Create a new Question document
    const question = new Question({
      quesetId, // Ensure `quesetId` is included
      ...newQuestion,
    });

    console.log('Question to be saved:', question);
    await question.save();
    console.log('Saved Question:', question);

    // Retrieve the Queset by ID
    const queset = await Queset.findById(quesetId);
    if (!queset) {
      return res.status(404).json({ message: 'Queset not found' });
    }

    // Insert at the correct index
    if (index !== undefined && index >= 0 && index <= queset.questions.length) {
      queset.questions.splice(index + 1, 0, question._id); // Insert right after the original question
    } else {
      queset.questions.push(question._id); // Default to adding at the end if index is invalid
    }

    await queset.save();

    // Return the updated queset
    res.status(200).json(queset);

  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ message: 'Error adding question', error: error.message });
  }
});



  //========================================================================================
  //========================================================================================
  //add manually by add question button
  router.get('/:quesetId', async (req, res) => {
    try {
      const queset = await Queset.findById(req.params.id).populate('questions');
      if (!queset) return res.status(404).json({ message: 'Queset not found' });
      res.json(queset);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  //delete question
  router.delete("/:quesetId/questions/:questionId", async (req, res) => {
    const { quesetId, questionId } = req.params;

    try {
        console.log("Received quesetId:", quesetId, "questionId:", questionId);

        const queset = await Queset.findById(quesetId);
        if (!queset) {
            console.log("Queset not found in DB!");
            return res.status(404).json({ message: "Queset not found" });
        }

        if (!queset.questions || queset.questions.length === 0) {
            return res.status(404).json({ message: "No questions found in the queset" });
        }

        console.log("Queset questions:", queset.questions);

        const questionIndex = queset.questions.findIndex(q => q._id.toString() === questionId);
        if (questionIndex === -1) {
            return res.status(404).json({ message: "Question not found in the queset" });
        }

        queset.questions.splice(questionIndex, 1);
        await queset.save();

        res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
        console.error("Error deleting question:", error);
        res.status(500).json({ message: "Server error" });
    }
});


 
  // Update question by ID
  router.put('/:quesetId/questions/:questionId', async (req, res) => {
    const { quesetId, questionId } = req.params;
    console.log("quesetId:", req.params.quesetId);console.log("questionId:", req.params.questionId);
    const updatedData = req.body;
    try {
      console.log("Received update request:", updatedData);
      // Find the question by its ID
      const question = await Question.findByIdAndUpdate(questionId, updatedData, { new: true });
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }

      res.status(200).json({ message: 'Question updated successfully', question });
    } catch (error) {
      console.error('Error updating question:', error);
      res.status(500).json({ error: 'Failed to update question' });
    }
  });

  //==============================================================================
  // Route to upload CSV and process it
router.post("/:quesetId/upload", upload.single("file"), async (req, res) => {
  const { quesetId } = req.params; // Get Quset ID from the route
  const file = req.file; // Get the uploaded file

  // Check if the file exists
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const questionsData = []; // Array to store the parsed question objects
  const csvStream = new stream.Readable();
  csvStream.push(file.buffer.toString());
  csvStream.push(null);

  let isHeaderValid = true;
  let hasValidRow = false;

  const expectedHeaders = [
    "questionText1", "questionImage1", "questionTable1",
    "questionText2", "questionImage2", "questionTable2",
    "questionText3", "questionImage3", "questionTable3",
    "a", "b", "c", "d", "correctAns",
    "answerDescriptionText1", "answerDescriptionImage1", "answerDescriptionTable1",
    "answerDescriptionText2", "answerDescriptionImage2", "answerDescriptionTable2",
    "answerDescriptionText3", "answerDescriptionImage3", "answerDescriptionTable3"
  ];

  // Parsing the CSV stream
  csvStream
    .pipe(csv())
    .on('headers', (headers) => {
      // Validate headers match your expected headers
      if (
        headers.length !== expectedHeaders.length ||
        !headers.every((header, index) => header.trim() === expectedHeaders[index])
      ) {
        isHeaderValid = false;
      }
    })
    .on('data', (row) => {
      if (!isHeaderValid) return;

      const isEmptyRow = Object.values(row).every(value => !value.trim());
      if (isEmptyRow) return; // Skip empty rows

      hasValidRow = true;

      // Helper function to parse JSON table columns
      const parseTable = (tableString) => {
        try {
          return tableString && tableString.trim() ? JSON.parse(tableString) : null;
        } catch (e) {
          return null;
        }
      };

      // Create question object based on the row data
      const question = {
        questionText1: row.questionText1 || null,
        questionImage1: row.questionImage1 || null,
        questionTable1: parseTable(row.questionTable1),

        questionText2: row.questionText2 || null,
        questionImage2: row.questionImage2 || null,
        questionTable2: parseTable(row.questionTable2),

        questionText3: row.questionText3 || null,
        questionImage3: row.questionImage3 || null,
        questionTable3: parseTable(row.questionTable3),

        options: {
          a: row.a || null,
          b: row.b || null,
          c: row.c || null,
          d: row.d || null,
        },
        correctAns: row.correctAns || null,

        answerDescriptionText1: row.answerDescriptionText1 || null,
        answerDescriptionImage1: row.answerDescriptionImage1 || null,
        answerDescriptionTable1: row.answerDescriptionTable1 || null,

        answerDescriptionText2: row.answerDescriptionText2 || null,
        answerDescriptionImage2: row.answerDescriptionImage2 || null,
        answerDescriptionTable2: row.answerDescriptionTable2 || null,

        answerDescriptionText3: row.answerDescriptionText3 || null,
        answerDescriptionImage3: row.answerDescriptionImage3 || null,
        answerDescriptionTable3: row.answerDescriptionTable3 || null,

        quesetId,  // Link the question to the correct Quset
      };

      questionsData.push(question);
    })
    .on('end', async () => {
      if (!isHeaderValid) {
        return res.status(400).json({
          message: "Invalid CSV headers. Please use the correct format."
        });
      }

      if (!hasValidRow) {
        return res.status(400).json({
          message: "No valid rows found in the file."
        });
      }

      try {
        // Insert questions into the database
        const insertedQuestions = await Question.insertMany(questionsData);
        console.log("Queset ID:", quesetId);
        console.log("Questions Data:", questionsData);
        // Add the questions to the Quset
        const questionIds = insertedQuestions.map(q => q._id);
        await Queset.findByIdAndUpdate(
          quesetId,
          { $push: { questions: { $each: questionIds } } },
          { new: true }
        );

        res.status(200).json({
          message: "Questions uploaded successfully!",
          insertedQuestions,
        });
      } catch (error) {
        console.error("Error inserting questions:", error);
        res.status(500).json({
          message: "Failed to upload questions",
          error: error.message,
        });
      }
    })
    .on('error', (error) => {
      console.error("Error parsing CSV:", error);
      res.status(500).json({
        message: "Failed to process CSV",
        error: error.message,
      });
    });
});

//!download
router.get('/:quesetId/download-csv', async (req, res) => {
  const { quesetId } = req.params; // Get the queset ID from the route parameter
  console.log(quesetId);
  
  try {
    // Fetch the queset and its questions from the database
    const queset = await Queset.findById(quesetId).populate('questions');
    if (!queset) {
      return res.status(404).json({ message: "Queset not found" });
    }

    // Format the questions data for the CSV
    const questionsData = queset.questions.map((question) => ({
      questionText1: question.questionText1 || "",
      questionImage1: question.questionImage1 || "",
      questionTable1: question.questionTable1 || "",
      
      questionText2: question.questionText2 || "",
      questionImage2: question.questionImage2 || "",
      questionTable2: question.questionTable2 || "",
      
      questionText3: question.questionText3 || "",
      questionImage3: question.questionImage3 || "",
      questionTable3: question.questionTable3 || "",
      
      a: question.options.a || "",
      b: question.options.b || "",
      c: question.options.c || "",
      d: question.options.d || "",
      
      correctAns: question.correctAns || "",
      
      answerDescriptionText1: question.answerDescriptionText1 || "",
      answerDescriptionImage1: question.answerDescriptionImage1 || "",
      answerDescriptionTable1: question.answerDescriptionTable1 || "",
      
      answerDescriptionText2: question.answerDescriptionText2 || "",
      answerDescriptionImage2: question.answerDescriptionImage2 || "",
      answerDescriptionTable2: question.answerDescriptionTable2 || "",
      
      answerDescriptionText3: question.answerDescriptionText3 || "",
      answerDescriptionImage3: question.answerDescriptionImage3 || "",
      answerDescriptionTable3: question.answerDescriptionTable3 || "",
    }));

    // Use json2csv to generate the CSV
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(questionsData);

    // Send the CSV file as a response
    res.header('Content-Type', 'text/csv');
    res.attachment('questions.csv');
    return res.send(csv);
  } catch (error) {
    console.error("Error generating CSV:", error);
    return res.status(500).json({ message: "Failed to generate CSV" });
  }
});

//============================================================================
//===========================================================================

module.exports = router;