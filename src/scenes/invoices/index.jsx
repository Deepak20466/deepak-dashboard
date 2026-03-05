import { useState, useEffect } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridRowModes } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { mockDataInvoices } from "../../data/mockData";
import Header from "../../components/Header";

const Invoices = () => {
  const [rows, setRows] = useState(() => {
    const saved = localStorage.getItem("invoicesData");
    return saved ? JSON.parse(saved) : mockDataInvoices;
  });
  
  const [rowModesModel, setRowModesModel] = useState({});

  useEffect(() => {
    localStorage.setItem("invoicesData", JSON.stringify(rows));
  }, [rows]);

  const handleAddRow = () => {
    const id = rows.length > 0 ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
    const newRow = { id, name: "", email: "", cost: 0, phone: "", date: "" };
    setRows((prev) => [...prev, newRow]);
    setRowModesModel((oldModel) => ({ ...oldModel, [id]: { mode: GridRowModes.Edit } }));
  };

  const handleReset = () => {
    localStorage.removeItem("invoicesData");
    window.location.reload();
  };

  const processRowUpdate = (newRow) => {
    const cleanRow = { ...newRow, cost: parseFloat(newRow.cost) || 0 };
    setRows((prev) => prev.map((row) => (row.id === cleanRow.id ? cleanRow : row)));
    return cleanRow;
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", flex: 1, editable: true },
    { field: "phone", headerName: "Phone", flex: 1, editable: true },
    { field: "email", headerName: "Email", flex: 1, editable: true },
    { 
      field: "cost", 
      headerName: "Cost", 
      flex: 1, 
      editable: true,
      renderCell: (params) => <Typography>Rs {params.value}</Typography>
    },
    { field: "date", headerName: "Date", flex: 1, editable: true },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        return isInEditMode 
          ? [
              <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={() => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })} />, 
              <GridActionsCellItem icon={<CancelIcon />} label="Cancel" onClick={() => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View, ignoreModifications: true } })} />
            ]
          : [
              <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })} />, 
              <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => setRows((prev) => prev.filter((row) => row.id !== id))} />
            ];
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="INVOICES" subtitle="Manage Invoice Records" />
      
      {/* Styled Button Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button 
          variant="contained" 
          color="secondary"
          startIcon={<AddIcon />} 
          onClick={handleAddRow}
          sx={{
            padding: "10px 20px",
            fontWeight: "bold",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 8px rgba(0,0,0,0.15)" }
          }}
        >
          Create New Invoice
        </Button>
        <IconButton onClick={handleReset} title="Reset Data">
          <RefreshIcon />
        </IconButton>
      </Box>

      <Box height="75vh" sx={{ "& .MuiDataGrid-root": { border: "none" } }}>
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
          processRowUpdate={processRowUpdate}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    </Box>
  );
};

export default Invoices;