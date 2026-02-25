const TransactionTable = ({ transactions }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Transaction History</h2>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Stock</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.map((t, index) => (
            <tr key={index} className="border-b">
              <td className="py-2">{t.stock}</td>
              <td>{t.type}</td>
              <td>{t.quantity}</td>
              <td>₹ {t.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;