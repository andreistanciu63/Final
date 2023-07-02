const express = require("express");
const router = express.Router();
const path = require("path");
const PDFDocument = require("pdfkit");
const fs = require("fs");

router.get("/downloadpdf", async function(req, res, next) {
  try {
    // Retrieve the necessary data from the session
    const { currentFilm, currentBroadcast, seats, fee } = req.session.ticketData;

    // Create a new PDF document
    const doc = new PDFDocument();

    // Add content to the PDF, using the retrieved data
    doc.text("Biletul dumneavoastră este: ");
    doc.text(`Cinema: ${currentBroadcast.houseName}`);
    doc.text(`Loc: ${seats.join(", ")}`);
    doc.text(`Film: ${currentFilm.filmName}`);
    doc.text(`Categorie: ${currentFilm.category}`);
    doc.text(`Ziua & ora: ${currentBroadcast.date} ${currentBroadcast.time} (${currentBroadcast.day})`);

    // Set the path for the PDF file
    const filePath = path.join(__dirname, "../public/pdfs/ticket.pdf");

    // Pipe the PDF document to a writable stream
    const stream = doc.pipe(fs.createWriteStream(filePath));

    // Finalize the PDF document
    doc.end();

    // Wait for the PDF to finish writing, then send the file in the response
    stream.on("finish", function() {
      res.sendFile(filePath);
    });
  } catch (error) {
    next(error);
  }
});




module.exports = router;