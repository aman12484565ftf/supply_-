const express = require('express');
const fs = require('fs');
const path = require('path');
const Invoice = require('../models/Invoice'); // Import Invoice model
const generateInvoice = require('../utils/generateInvoice'); // Import invoice generator

const router = express.Router();

// Route to generate and download an invoice PDF
router.get('/:id/download', async (req, res) => {
    try {
        const invoiceId = req.params.id;
        
        // Fetch invoice data from MongoDB
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        // Define a temporary file path
        const filePath = path.join(__dirname, `invoice_${invoiceId}.pdf`);
        
        // Generate the PDF
        await generateInvoice(invoice, filePath);
        
        // Stream the PDF file to the response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice_${invoiceId}.pdf`);
        
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        // Delete the file after streaming
        fileStream.on('end', () => {
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        });
    } catch (error) {
        console.error('Error generating invoice:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
