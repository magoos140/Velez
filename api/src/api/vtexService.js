const axios = require('axios');

const ACCOUNT_NAME = process.env.ACCOUNT_NAME;

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'VtexIdclientAutCookie': process.env.VTEX_ID_CLIENT_AUT_COOKIE,
};

async function getInvoices() {
    const url = `https://${ACCOUNT_NAME}.vtexcommercestable.com.br/api/oms/pvt/orders?per_page=100&f_invoicedDate=invoicedDate%3A%5B2024-01-01T00%3A00%3A00.000Z%20TO%202024-01-31T23%3A59%3A59.999Z%5D&f_status=invoiced`;
    const response = await axios.get(url, { headers });
    return response.data.list;
}

async function getOrderById(orderId) {
    const url = `https://${ACCOUNT_NAME}.vtexcommercestable.com.br/api/oms/pvt/orders/${orderId}`;
    const response = await axios.get(url, { headers });
    return response.data;
}

module.exports = {
  getInvoices,
  getOrderById
};