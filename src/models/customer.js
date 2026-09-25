// FAKE DATA ONLY. These customers are made up for demo purposes.
// No real names, CNICs, phone numbers, emails or addresses.
const customers = [
  {
    id: 1,
    name: "Ayesha Khan",
    email: "ayesha@example.com",
    phone: "0300-1234567",
    cnic: "42101-1234567-1",
    address: "Block 5, Clifton, Karachi",
  },
  {
    id: 2,
    name: "Bilal Ahmed",
    email: "bilal@example.com",
    phone: "0321-7654321",
    cnic: "42201-7654321-3",
    address: "PECHS, Karachi",
  },
];

function findCustomer(id) {
  return customers.find((c) => c.id === Number(id)) || null;
}

module.exports = { findCustomer };
