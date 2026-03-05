import { useState, useEffect } from "react";
import { Box, useTheme, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [contactsData, setContactsData] = useState([]);

  useEffect(() => {
    const savedContacts = localStorage.getItem("contactsData");
    if (savedContacts) {
      setContactsData(JSON.parse(savedContacts));
    } else {
      setContactsData(mockDataContacts);
      localStorage.setItem("contactsData", JSON.stringify(mockDataContacts));
    }
  }, []);

  const handleDelete = (id) => {
    const updatedData = contactsData.filter((row) => row.id !== id);
    setContactsData(updatedData);
    localStorage.setItem("contactsData", JSON.stringify(updatedData));
  };

  const processRowUpdate = (newRow) => {
    const updatedData = contactsData.map((row) => (row.id === newRow.id ? newRow : row));
    setContactsData(updatedData);
    localStorage.setItem("contactsData", JSON.stringify(updatedData));
    return newRow;
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "registrarId", headerName: "Registrar ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
      editable: true,
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
      editable: true,
    },
    { field: "phone", headerName: "Phone Number", flex: 1, editable: true },
    { field: "email", headerName: "Email", flex: 1, editable: true },
    { field: "address", headerName: "Address", flex: 1, editable: true },
    { field: "city", headerName: "City", flex: 1, editable: true },
    { field: "zipCode", headerName: "Zip Code", flex: 1, editable: true },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton onClick={() => alert("Double click any cell to edit!")}>
              <EditIcon sx={{ color: colors.blueAccent[500] }} />
            </IconButton>
            <IconButton onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon sx={{ color: colors.redAccent[500] }} />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="0 20px">
      <Header
        title="CONTACTS"
        subtitle="List of Contacts for Future Reference"
      />
      <Box
        m="15px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={contactsData}
          columns={columns}
          // This line brings back Columns, Filters, Density, and Export
          components={{ Toolbar: GridToolbar }}
          processRowUpdate={processRowUpdate}
          experimentalFeatures={{ newEditingApi: true }}
          // This ensures that clicking an icon doesn't select the whole row
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default Contacts;