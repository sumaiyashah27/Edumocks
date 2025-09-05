const express = require("express");
const fs = require('fs');
const path = require('path');
const router = express.Router();
const StudEnroll = require("../models/studenroll-model");
const Student = require("../models/student-model");
const Course = require("../models/course-model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Razorpay = require('razorpay');
const nodemailer = require("nodemailer");
const authMiddleware = require('../middleware/authMiddleware');
const PDFDocument = require('pdfkit');
const dayjs = require('dayjs');
require('dotenv').config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Email setup with Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Mock payment gateway simulation (Replace with Razorpay/Stripe in production)
router.post("/", async (req, res) => {
  const { studentId, selectedCourse, selectedSubject, amount } = req.body;

  if (!studentId || !selectedCourse || !selectedSubject || !amount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Save initial payment record with "pending" status
    const enrollment = new StudEnroll({
      studentId,
      selectedCourse,
      selectedSubject,
      amount,
      paymentStatus: "pending",
    });

    const savedEnrollment = await enrollment.save();

    // Simulate payment gateway interaction
    const paymentId = `PAY-${Date.now()}`;
    setTimeout(async () => {
      savedEnrollment.paymentStatus = "success";
      savedEnrollment.paymentId = paymentId;
      await savedEnrollment.save();

      // Send email notification on successful payment
      const student = await Student.findById(studentId); // Fetch student data
      const course = await Course.findById(selectedCourse); // Fetch course data
      const subjectNames = selectedSubject.map(sub => sub.name).join(", ");

      const mailOptions = {
        from: process.env.EMAIL,
        to: student.email,
        subject: `Test Assigned Successfully - ${course.name}`,
        text: `Hello ${student.firstname},\n\nTest assignment for the course ${course.name} and selected subjects: ${subjectNames} is successful. Now, you can schedule your test.\n\nBest of luck!\n\nThe Edumocks Team\n[https://edumocks.com/]`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      console.log("Payment successful for:", paymentId);
    }, 5000);

    res.status(200).json({
      message: "Payment initiated",
      enrollmentId: savedEnrollment._id,
      paymentId,
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ message: "Payment failed", error });
  }
});

// Fetch course with its subjects based on courseId
router.get("/api/course/:courseId", authMiddleware, async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId).populate("subjects");
    if (!course) {
      return res.status(404).send("Course not found");
    }

    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).send("Server Error");
  }
});

// Route to get student details by studentId
router.get("/api/student/:studentId", authMiddleware, async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findOne({ studentId: studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({
      _id: student._id,
      studentId: student.studentId,
      firstname: student.firstname,
      lastname: student.lastname,
      email: student.email,
    });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Failed to fetch student details", error });
  }
});

// Create Stripe Payment Intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(400).send({ error: error.message });
  }
});

// Create Razorpay Order
router.post("/create-razorpay-order", async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const options = {
      amount,
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ success: false, message: "Error creating Razorpay order." });
  }
});

function formatCurrency(amount, currency = 'USD') {
  const symbol = currency === 'INR' ? '₹' : '$';
  return `${symbol}${Number(amount).toFixed(2)}`;
}

function buildInvoiceNumber(paymentId) {
  // Simple readable invoice number
  return `INV-${dayjs().format('YYYYMMDD')}-${String(paymentId).slice(-6).toUpperCase()}`;
}


/**
 * Generates a modern, high-quality invoice PDF.
 *
 * @param {object} data - The invoice data.
 * @returns {Promise<Buffer>} A promise that resolves with the PDF buffer.
 */
function generateInvoicePdf({
  invoiceNumber,
  invoiceDate,
  student,
  course,
  subjects,
  currency,
  subtotal,
  discount = 0,
  tax = 0,
  total,
  paymentMethod,
  paymentId,
  orderId,
  organization = {
    name: 'Edumocks',
    logoPath: path.resolve(__dirname, '..', 'assets', 'edulog-2.png'),
    brandColor: '#7C3AED', // Violet
    accentColor: '#06B6D4', // Cyan
    bgAccent:   '#F5F3FF', // Light Violet
    textColor:  '#111827', // Dark Gray
    subText:    '#6B7280', // Medium Gray
  },
  fonts = {
    regular: path.join(__dirname, '..', 'assets', 'Inter-Regular.ttf'),
    bold: path.join(__dirname, '..', 'assets', 'Inter-Bold.ttf'),
  }
}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 0 });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // --- Font Registration ---
    let hasCustomFonts = false;
    try {
      if (fonts?.regular && fs.existsSync(fonts.regular)) {
        doc.registerFont('Inter', fonts.regular);
        hasCustomFonts = true;
      }
      if (fonts?.bold && fs.existsSync(fonts.bold)) {
        doc.registerFont('Inter-Bold', fonts.bold);
      }
    } catch (e) {
      console.error("Error registering fonts:", e);
    }
    const FONT_REG = hasCustomFonts ? 'Inter' : 'Helvetica';
    const FONT_BOLD = (hasCustomFonts && fonts?.bold) ? 'Inter-Bold' : 'Helvetica-Bold';

    // --- Color & Style Palette ---
    const COLOR_BRAND = organization.brandColor;
    const COLOR_ACCENT = organization.accentColor;
    const COLOR_PRIMARY_TEXT = organization.textColor;
    const COLOR_SECONDARY_TEXT = organization.subText;
    const COLOR_BACKGROUND = '#F7F8FC'; // A light, neutral background
    const COLOR_WHITE = '#FFFFFF';
    const COLOR_TABLE_HEADER_BG = organization.bgAccent;

    // --- Page Layout ---
    const PAGE = { W: 595.28, H: 841.89 };
    const MARGIN = { X: 50, Y: 50 };
    const CONTENT = { W: PAGE.W - MARGIN.X * 2 };

    // --- SVG Icons (simple paths for embedding) ---
    const ICONS = {
      user: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
      calendar: 'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z',
      receipt: 'M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z'
    };

    // --- Helper Functions ---
    const money = (v) => `${currency === 'INR' ? '₹' : '$'}${Number(v ?? 0).toFixed(2)}`;
    const drawIcon = (path, x, y, scale = 0.6) => doc.save().translate(x, y).scale(scale).path(path).fill(COLOR_SECONDARY_TEXT).restore();

    // ===== HEADER SECTION =====
    const drawHeader = () => {
      // Draw background for the entire page
      doc.rect(0, 0, PAGE.W, PAGE.H).fill(COLOR_BACKGROUND);

      // Organization Logo
      if (organization.logoPath && fs.existsSync(organization.logoPath)) {
        doc.image(organization.logoPath, MARGIN.X, MARGIN.Y - 10, { width: 100 });
      }

      // Invoice Title
      doc.font(FONT_BOLD).fontSize(28).fillColor(COLOR_BRAND)
        .text('INVOICE', 0, MARGIN.Y + 10, { width: CONTENT.W, align: 'right' });
      
      // Decorative line
      doc.moveTo(MARGIN.X, 130).lineTo(PAGE.W - MARGIN.X, 130)
         .strokeColor(COLOR_BRAND).lineWidth(0.5).stroke();
    };

    // ===== BILL TO & METADATA SECTION =====
    const drawBilledToAndMeta = () => {
      const sectionY = 150;
      const col1X = MARGIN.X;
      const col2X = PAGE.W / 2;

      // Column 1: Bill To
      drawIcon(ICONS.user, col1X, sectionY - 2);
      doc.font(FONT_BOLD).fontSize(10).fillColor(COLOR_SECONDARY_TEXT).text('BILL TO', col1X + 20, sectionY);
      doc.font(FONT_BOLD).fontSize(12).fillColor(COLOR_PRIMARY_TEXT).text(`${student?.firstname ?? ''} ${student?.lastname ?? ''}`.trim(), col1X, sectionY + 20);
      doc.font(FONT_REG).fontSize(10).fillColor(COLOR_SECONDARY_TEXT).text(student?.email ?? '-', col1X, sectionY + 38);

      // Column 2: Invoice Metadata
      const drawMetaLine = (icon, label, value, y) => {
        drawIcon(icon, col2X, y - 2);
        doc.font(FONT_BOLD).fontSize(10).fillColor(COLOR_SECONDARY_TEXT).text(label, col2X + 20, y);
        doc.font(FONT_REG).fontSize(10).fillColor(COLOR_PRIMARY_TEXT)
          .text(value, col2X + 100, y, { width: CONTENT.W / 2 - 100, align: 'left' });
      };

      drawMetaLine(ICONS.receipt, 'Invoice Number', invoiceNumber, sectionY);
      drawMetaLine(ICONS.calendar, 'Invoice Date', invoiceDate, sectionY + 20);

      // Course Info
      doc.font(FONT_BOLD).fontSize(10).fillColor(COLOR_SECONDARY_TEXT).text('COURSE Details', col1X, sectionY + 70);
      doc.font(FONT_BOLD).fontSize(12).fillColor(COLOR_BRAND).text(course?.name ?? '-', col1X, sectionY + 85);
    };

    // ===== TABLE SECTION =====
    let tableY = 280; // Initial Y position for the table
    const table = {
      x: MARGIN.X,
      w: CONTENT.W,
      col1W: CONTENT.W * 0.75,
      col2W: CONTENT.W * 0.25,
      headerH: 25,
      rowH: 30,
    };

    const drawTableHeader = (y) => {
      doc.roundedRect(table.x, y, table.w, table.headerH, 5).fill(COLOR_TABLE_HEADER_BG);
      doc.font(FONT_BOLD).fontSize(10).fillColor(COLOR_BRAND);
      doc.text('TOPICS', table.x + 15, y + 8, { width: table.col1W - 15 });
      doc.text('PRICE', table.x + table.col1W, y + 8, { width: table.col2W - 15, align: 'right' });
    };

    const drawTableRow = (item, y, isEven) => {
      // Optional: zebra striping for rows
      if (isEven) {
        doc.rect(table.x, y, table.w, table.rowH).fill(COLOR_WHITE);
      }
      doc.font(FONT_REG).fontSize(10).fillColor(COLOR_PRIMARY_TEXT);
      doc.text(item.name ?? '-', table.x + 15, y + 10, { width: table.col1W - 25 });
      doc.text(money(item.price), table.x + table.col1W, y + 10, { width: table.col2W - 15, align: 'right' });
      
      // Thin line separator
      doc.moveTo(table.x, y + table.rowH).lineTo(table.x + table.w, y + table.rowH)
         .strokeColor(COLOR_TABLE_HEADER_BG).lineWidth(0.5).stroke();
    };
    
    // ===== TOTALS & FOOTER SECTION =====
    const drawTotalsAndFooter = (finalY) => {
      const totalsY = finalY + 20;
      const totalsBox = { w: 220, x: PAGE.W - MARGIN.X - 220, h: 110 };
      
      // Totals Box
      doc.roundedRect(totalsBox.x, totalsY, totalsBox.w, totalsBox.h, 5).fill(COLOR_WHITE);
      const putTotal = (label, value, yOffset, isBold = false) => {
        doc.font(isBold ? FONT_BOLD : FONT_REG).fontSize(10).fillColor(COLOR_SECONDARY_TEXT);
        doc.text(label, totalsBox.x + 15, totalsY + yOffset);
        doc.font(isBold ? FONT_BOLD : FONT_REG).fillColor(isBold ? COLOR_PRIMARY_TEXT : COLOR_SECONDARY_TEXT)
           .text(value, totalsBox.x + 15, totalsY + yOffset, { width: totalsBox.w - 30, align: 'right' });
      };

      let currentOffset = 15;
      putTotal('Subtotal', money(subtotal), currentOffset);
      currentOffset += 20;

      if (discount && Number(discount) > 0) {
        putTotal('Discount', `- ${money(discount)}`, currentOffset);
        currentOffset += 20;
      }
      if (tax && Number(tax) > 0) {
        putTotal('Tax', money(tax), currentOffset);
        currentOffset += 20;
      }

      // Total Line with background
      const totalY = totalsY + currentOffset - 5;
      doc.rect(totalsBox.x, totalY, totalsBox.w, 30).fill(COLOR_TABLE_HEADER_BG);
      doc.font(FONT_BOLD).fontSize(12).fillColor(COLOR_BRAND);
      doc.text('Total Paid', totalsBox.x + 15, totalY + 9);
      doc.text(money(total), totalsBox.x + 15, totalY + 9, { width: totalsBox.w - 30, align: 'right' });

      // Payment Details (Left side)
      const paymentY = totalsY + 15;
      doc.font(FONT_BOLD).fontSize(10).fillColor(COLOR_SECONDARY_TEXT).text('PAYMENT DETAILS', MARGIN.X, paymentY);
      doc.font(FONT_REG).fontSize(10).fillColor(COLOR_PRIMARY_TEXT)
        .text(`Method: ${paymentMethod ?? '-'}`, MARGIN.X, paymentY + 18)
        .text(`Payment ID: ${paymentId ?? '-'}`, MARGIN.X, paymentY + 32)
        .text(`Order ID: ${orderId ?? '-'}`, MARGIN.X, paymentY + 46);

      // Final thank you note
      doc.font(FONT_REG).fontSize(9).fillColor(COLOR_SECONDARY_TEXT)
        .text('Thank you for your purchase!', MARGIN.X, PAGE.H - MARGIN.Y - 10, {
          width: CONTENT.W,
          align: 'center'
        });
    };

    // ===== RENDER PIPELINE =====
    const maxRowsPerPage = Math.floor((PAGE.H - tableY - MARGIN.Y - 140) / table.rowH);
    let currentPage = 1;
    let subjectIndex = 0;

    const renderPage = (isFirstPage) => {
      drawHeader();
      if (isFirstPage) {
        drawBilledToAndMeta();
      }
      
      let y = tableY;
      // On subsequent pages, table starts higher up
      if (!isFirstPage) {
        y = MARGIN.Y + 100;
      }
      
      drawTableHeader(y);
      y += table.headerH;
      
      let rowsOnThisPage = 0;
      const pageSubjects = subjects.slice(subjectIndex, subjectIndex + maxRowsPerPage);

      pageSubjects.forEach((subject, i) => {
        drawTableRow(subject, y, i % 2 !== 0);
        y += table.rowH;
        rowsOnThisPage++;
      });
      
      subjectIndex += rowsOnThisPage;
      return y; // Return the final Y position on this page
    };

    // Render first page
    let finalY = renderPage(true);

    // Render subsequent pages if necessary
    while (subjectIndex < (subjects?.length || 0)) {
      doc.addPage({ size: 'A4', margin: 0 });
      currentPage++;
      finalY = renderPage(false);
    }

    // Draw footer only on the last page
    drawTotalsAndFooter(finalY);
    
    doc.end();
  });
}



async function sendInvoiceEmails({
  student,
  course,
  subjects,
  currency = 'USD',
  subtotal,
  discount = 0,
  tax = 0,
  total,
  paymentMethod,
  paymentId,
  orderId,
}) {
  const invoiceNumber = buildInvoiceNumber(paymentId || orderId || Date.now());
  const invoiceDate = dayjs().format('MMM DD, YYYY');

  const pdfBuffer = await generateInvoicePdf({
    invoiceNumber,
    invoiceDate,
    student,
    course,
    subjects,
    currency,
    subtotal,
    discount,
    tax,
    total,
    paymentMethod,
    paymentId,
    orderId,
  });

  const subject = `Invoice ${invoiceNumber} – ${course.name}`;
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222">
      <p>Hi ${student.firstname},</p>
      <p>Thank you for your purchase on <b>${invoiceDate}</b>.</p>
      <p><b>Course:</b> ${course.name}<br/>
         <b>Topics:</b> ${subjects.map(s => s.name).join(', ')}<br/>
         <b>Total Paid:</b> ${formatCurrency(total, currency)}<br/>
         <b>Payment Method:</b> ${paymentMethod}<br/>
         <b>Payment ID:</b> ${paymentId}
      </p>
      <p>Your PDF invoice is attached for your records.</p>
      <p>— Team Edumocks</p>
    </div>
  `;

  const mailOptions = {
    from: process.env.GMAIL_USER, // make sure this matches transporter auth
    to: [student.email, 'support@edumocks.com'],
    subject,
    html,
    attachments: [
      {
        filename: `${invoiceNumber}.pdf`,
        content: pdfBuffer,
      }
    ],
  };

  await transporter.sendMail(mailOptions);
}


// Sends invoice PDF to student + support after successful payment
router.post('/send-invoice', authMiddleware, async (req, res) => {
  try {
    const {
      studentId,
      courseId,
      subjects,          // array of { _id, name, price } OR array of IDs
      currency = 'USD',  // 'USD' or 'INR'
      subtotal,          // number
      discount = 0,      // number
      tax = 0,           // number
      total,             // number
      paymentMethod,     // 'Stripe' | 'Razorpay' | 'Free Coupon'
      paymentId,         // string
      orderId,           // string | optional
    } = req.body;

    if (!studentId || !courseId || !Array.isArray(subjects) || total === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const student = await Student.findById(studentId).lean();
    const course = await Course.findById(courseId).populate('subjects').lean();
    if (!student) return res.status(404).json({ error: 'Student not found' });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Normalize subjects list
    let fullSubjects = [];
    if (subjects.length && typeof subjects[0] === 'string') {
      const map = new Map((course.subjects || []).map(s => [String(s._id), s]));
      fullSubjects = subjects.map(id => {
        const found = map.get(String(id));
        return found ? { _id: found._id, name: found.name, price: Number(found.price || 0) } : { _id: id, name: String(id), price: 0 };
      });
    } else {
      fullSubjects = subjects.map(s => ({ _id: s._id, name: s.name, price: Number(s.price || 0) }));
    }

    await sendInvoiceEmails({
      student,
      course,
      subjects: fullSubjects,
      currency,
      subtotal: Number(subtotal ?? fullSubjects.reduce((a, b) => a + (Number(b.price) || 0), 0)),
      discount: Number(discount || 0),
      tax: Number(tax || 0),
      total: Number(total),
      paymentMethod,
      paymentId,
      orderId,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error('send-invoice error:', err);
    return res.status(500).json({ success: false, error: 'Failed to send invoice' });
  }
});


module.exports = router;
