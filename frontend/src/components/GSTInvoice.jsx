import React, { useState, useEffect } from 'react';
import { FaDownload, FaPrint, FaFileInvoice } from 'react-icons/fa';
import api from '../api/api';
import toast from 'react-hot-toast';

const GSTInvoice = ({ orderId, onClose }) => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchInvoice();
    }
  }, [orderId]);

  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/order/invoice/${orderId}`);
      if (response.data.success) {
        setInvoice(response.data.invoice);
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInvoice = async () => {
    setGenerating(true);
    try {
      const response = await api.post('/order/generate-invoice', { orderId });
      if (response.data.success) {
        setInvoice(response.data.invoice);
        toast.success('GST Invoice generated successfully!');
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Failed to generate invoice');
    } finally {
      setGenerating(false);
    }
  };

  const downloadInvoice = () => {
    if (invoice?.pdfUrl) {
      const link = document.createElement('a');
      link.href = invoice.pdfUrl;
      link.download = `GST_Invoice_${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const printInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Loading invoice...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <FaFileInvoice className="text-2xl text-primary" />
            <h2 className="text-2xl font-bold text-gray-800">GST Invoice</h2>
          </div>
          <div className="flex gap-2">
            {invoice && (
              <>
                <button
                  onClick={downloadInvoice}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <FaDownload />
                  Download PDF
                </button>
                <button
                  onClick={printInvoice}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <FaPrint />
                  Print
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {invoice ? (
            <div className="space-y-6">
              {/* Invoice Header */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">SG Finserv</h3>
                  <p className="text-gray-600">Financial Services Provider</p>
                  <p className="text-gray-600">GSTIN: 27AABCU9603R1ZX</p>
                  <p className="text-gray-600">Address: Mumbai, Maharashtra</p>
                </div>
                <div className="text-right">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Invoice Details</h3>
                  <p className="text-gray-600">Invoice No: {invoice.invoiceNumber}</p>
                  <p className="text-gray-600">Date: {new Date(invoice.date).toLocaleDateString()}</p>
                  <p className="text-gray-600">Order ID: {invoice.orderId}</p>
                </div>
              </div>

              {/* Buyer Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Bill To:</h4>
                <p className="text-gray-600">{invoice.buyerName}</p>
                <p className="text-gray-600">{invoice.buyerAddress}</p>
                <p className="text-gray-600">GSTIN: {invoice.buyerGSTIN || 'N/A'}</p>
              </div>

              {/* Items */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-3 text-left">Item</th>
                      <th className="border border-gray-300 p-3 text-left">Description</th>
                      <th className="border border-gray-300 p-3 text-center">Qty</th>
                      <th className="border border-gray-300 p-3 text-right">Rate</th>
                      <th className="border border-gray-300 p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-3">{item.name}</td>
                        <td className="border border-gray-300 p-3">{item.description}</td>
                        <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                        <td className="border border-gray-300 p-3 text-right">₹{item.rate}</td>
                        <td className="border border-gray-300 p-3 text-right">₹{item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-80">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold">₹{invoice.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">CGST (9%):</span>
                      <span className="font-semibold">₹{invoice.cgst}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">SGST (9%):</span>
                      <span className="font-semibold">₹{invoice.sgst}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-lg font-bold text-gray-800">Total:</span>
                      <span className="text-lg font-bold text-gray-800">₹{invoice.total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Payment Information</h4>
                <p className="text-gray-600">Payment Method: Credit Limit</p>
                <p className="text-gray-600">Payment Status: Paid</p>
                <p className="text-gray-600">Payment Date: {new Date(invoice.paymentDate).toLocaleDateString()}</p>
              </div>

              {/* Terms */}
              <div className="text-sm text-gray-600">
                <h4 className="font-bold text-gray-800 mb-2">Terms & Conditions:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>This is a computer-generated invoice and does not require signature.</li>
                  <li>Goods once sold will not be taken back.</li>
                  <li>Interest-free credit period as per SG Finserv terms.</li>
                  <li>For any queries, contact SG Finserv support.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FaFileInvoice className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Invoice Found</h3>
              <p className="text-gray-600 mb-6">Generate a GST invoice for this order</p>
              <button
                onClick={generateInvoice}
                disabled={generating}
                className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? 'Generating...' : 'Generate Invoice'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GSTInvoice;
