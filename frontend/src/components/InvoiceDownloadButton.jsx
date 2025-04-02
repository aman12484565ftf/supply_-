import React from "react";

const InvoiceDownloadButton = ({ invoiceId }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(`https://supplychainpro.onrender.com/api/invoice/${invoiceId}/download`, {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download invoice");
      }

      // Create a blob from the response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice_${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading invoice:", error);
    }
  };

  return (
    <button onClick={handleDownload} className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
      Download Invoice
    </button>
  );
};

export default InvoiceDownloadButton;
