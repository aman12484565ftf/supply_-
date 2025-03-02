const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = (order, filePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // ✅ Company Branding
    // doc
    //   .image("path/to/logo.png", 50, 45, { width: 100 }) // Change to your logo path
    //   .fillColor("#444444")
    //   .fontSize(20)
    //   .text("Your Company Name", 150, 50, { align: "right" })
    //   .fontSize(10)
    //   .text("123 Business Road, Suite 200", 150, 70, { align: "right" })
    //   .text("City, State, ZIP", 150, 85, { align: "right" })
    //   .text("support@company.com", 150, 100, { align: "right" })
    //   .moveDown();

    // doc.moveDown(2);

    // ✅ Invoice Title
    doc
      .fontSize(18)
      .text("INVOICE", { align: "center", underline: true })
      .moveDown();

    // ✅ Invoice Details
    doc
      .fontSize(12)
      .text(`Invoice No: ${order._id}`)
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`)
      .text(`Customer: ${order.customer.name}`)
      .text(`Email: ${order.customer.email}`)
      .moveDown();

    // ✅ Table Headers
    const tableTop = doc.y + 10;
    const columnWidths = [200, 100, 100, 100];
    const columnPositions = [50, 250, 350, 450];

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Item", columnPositions[0], tableTop)
      .text("Quantity", columnPositions[1], tableTop)
      .text("Price", columnPositions[2], tableTop)
      .text("Total", columnPositions[3], tableTop);

    // ✅ Draw a Border Under Table Headers
    doc
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();

    let position = tableTop + 25;
    doc.font("Helvetica").fontSize(12);

    // ✅ Order Items - Properly Aligned
    order.items.forEach((item) => {
      doc
        .text(item.product.name, columnPositions[0], position)
        .text(item.quantity.toString(), columnPositions[1], position)
        .text(`₹${item.product.price.toFixed(2)}`, columnPositions[2], position)
        .text(`₹${(item.product.price * item.quantity).toFixed(2)}`, columnPositions[3], position);

      position += 20;
    });

    // ✅ Total Amount
    doc
      .moveTo(50, position + 5)
      .lineTo(550, position + 5)
      .stroke();

    doc
      .font("Helvetica-Bold")
      .text("Total Amount:", columnPositions[2], position + 10)
      .text(`₹${order.totalAmount.toFixed(2)}`, columnPositions[3], position + 10);

    // ✅ Payment Details
    doc.moveDown();
    doc
      .fontSize(12)
      .text(`Payment Mode: ${order.paymentMode || "N/A"}`)
      .text(`Payment Status: ${order.paymentStatus || "Unpaid"}`);

    // ✅ Footer - Company Note
    doc
      .moveDown()
      .fontSize(10)
      .fillColor("#888888")
      .text(
        "Thank you for your business! If you have any questions about this invoice, please contact us.",
        { align: "center" }
      );

    doc.end();
    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};

module.exports = generateInvoice;
