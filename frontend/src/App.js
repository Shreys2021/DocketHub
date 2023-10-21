import DocketForm from "./component/DocketForm";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import DocketList from "./component/DocketList";

function App() {

  const [excelData, setExcelData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [poNumberMapping, setPoNumberMapping] = useState({});

  useEffect(() => {
    const fileURL = 'https://cc7f306eef219b562546a6c765f5960d.cdn.bubble.io/f1697415553805x314024720575284000/export29913.xlsx';

    const fetchExcelData = async () => {
      try {
        const response = await fetch(fileURL);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const data = new Uint8Array(arrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          setExcelData(sheetData);
          const supplierColumnIndex = 11; // Column index for "Supplier"
          const poNumberColumnIndex = 1;
          const suppliers = sheetData.slice(1).map(row => row[supplierColumnIndex]);
          const poNumbers = sheetData.slice(1).map(row => row[poNumberColumnIndex]);

          const cleanedSuppliers = [];
          const poNumberMapping = {};
          let previousSupplier = null;

          for (let i = 0; i < suppliers.length; i++) {
            const supplier = suppliers[i];
            const poNumber = poNumbers[i];

            if (supplier && supplier.trim() !== "") {
              cleanedSuppliers.push(supplier);
              previousSupplier = supplier;

              if (poNumber) {
                poNumberMapping[supplier] = poNumber;
              }
            } else if (previousSupplier && poNumber) {
              cleanedSuppliers.push(previousSupplier);
              poNumberMapping[previousSupplier] = poNumber;
            }
          }

          setSuppliers(cleanedSuppliers);
          setPoNumberMapping(poNumberMapping);
        } else {
          console.error('Failed to download the Excel file');
        }
      } catch (error) {
        console.error('Error reading Excel file:', error);
      }
    };

    fetchExcelData();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DocketForm suppliers={suppliers} poNumberMapping={poNumberMapping} excelData={excelData} />} />
        <Route path="/docketList" element={<DocketList />} />
      </Routes>
    </Router>
  );
}

export default App;
