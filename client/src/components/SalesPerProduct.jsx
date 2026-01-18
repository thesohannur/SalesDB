import { useEffect, useState } from "react";
import axios from "axios";

function QuantitySold() {
  const [data, setData] = useState([]);

  const loadData = async (view = "product") => {
    const res = await axios.get(
      `/api/quantity-sold?view=${view}`
    );
    setData(res.data);
  };

  useEffect(() => {
    loadData(); 
  }, []);

  return (
    <>
      <div>
        <button onClick={() => loadData("product")}>
          Per Product
        </button>

        <button onClick={() => loadData("year")}>
          Per Year
        </button>

        <button onClick={() => loadData("category")}>
          Per Category
        </button>

        <button onClick={() => loadData("category_year")}>
          Category per Year
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name / Year</th>
            <th>Quantity Sold</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>
                {row.product_name ||
                 row.category_name ||
                 row.sales_year}
              </td>
              <td>{row.total_quantity_sold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default QuantitySold;
