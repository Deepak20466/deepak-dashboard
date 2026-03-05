import { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, useTheme, IconButton } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const Form = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  
  // --- STATE ---
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null); // Tracks ID of user being edited

  // Load users from LocalStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("teamData") || "[]");
    setUsers(saved);
  }, []);

  // --- CRUD FUNCTIONS ---

  // Handle Create & Update
  const handleFormSubmit = (values, { resetForm }) => {
    let updatedUsers;
    
    if (editId) {
      // UPDATE: Find the existing user and swap their data
      updatedUsers = users.map((u) => 
        u.id === editId 
        ? { ...u, ...values, name: `${values.firstName} ${values.lastName}` } 
        : u
      );
      setEditId(null);
    } else {
      // CREATE: Create a brand new user object
      const newUser = {
        ...values,
        id: Date.now(),
        name: `${values.firstName} ${values.lastName}`,
        age: 25,
        access: "user",
      };
      updatedUsers = [...users, newUser];
    }

    setUsers(updatedUsers);
    localStorage.setItem("teamData", JSON.stringify(updatedUsers));
    resetForm();
    alert(editId ? "User updated successfully!" : "User created successfully!");
  };

  // Handle Delete
  const handleDelete = (id) => {
    const filteredUsers = users.filter((u) => u.id !== id);
    setUsers(filteredUsers);
    localStorage.setItem("teamData", JSON.stringify(filteredUsers));
  };

  // Handle Edit (Pre-fills the form)
  const handleEdit = (user, setValues) => {
    setEditId(user.id);
    setValues({
      firstName: user.firstName || user.name.split(" ")[0],
      lastName: user.lastName || user.name.split(" ")[1],
      email: user.email,
      contact: user.contact || user.phone,
      address1: user.address1 || user.address,
      address2: user.address2 || "",
    });
  };

  return (
    <Box m="0 20px">
      <Header 
        title="USER MANAGEMENT" 
        subtitle={editId ? `Editing User: ${editId}` : "Create a New User Profile"} 
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setValues, resetForm }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="15px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4" } }}
            >
              <TextField fullWidth variant="filled" type="text" label="First Name" onBlur={handleBlur} onChange={handleChange} value={values.firstName} name="firstName" error={!!touched.firstName && !!errors.firstName} helperText={touched.firstName && errors.firstName} sx={{ gridColumn: "span 2" }} />
              <TextField fullWidth variant="filled" type="text" label="Last Name" onBlur={handleBlur} onChange={handleChange} value={values.lastName} name="lastName" error={!!touched.lastName && !!errors.lastName} helperText={touched.lastName && errors.lastName} sx={{ gridColumn: "span 2" }} />
              <TextField fullWidth variant="filled" type="text" label="Email" onBlur={handleBlur} onChange={handleChange} value={values.email} name="email" error={!!touched.email && !!errors.email} helperText={touched.email && errors.email} sx={{ gridColumn: "span 4" }} />
              <TextField fullWidth variant="filled" type="text" label="Contact Number" onBlur={handleBlur} onChange={handleChange} value={values.contact} name="contact" error={!!touched.contact && !!errors.contact} helperText={touched.contact && errors.contact} sx={{ gridColumn: "span 4" }} />
              <TextField fullWidth variant="filled" type="text" label="Address 1" onBlur={handleBlur} onChange={handleChange} value={values.address1} name="address1" error={!!touched.address1 && !!errors.address1} helperText={touched.address1 && errors.address1} sx={{ gridColumn: "span 4" }} />
              <TextField fullWidth variant="filled" type="text" label="Address 2" onBlur={handleBlur} onChange={handleChange} value={values.address2} name="address2" error={!!touched.address2 && !!errors.address2} helperText={touched.address2 && errors.address2} sx={{ gridColumn: "span 4" }} />
            </Box>
            
            <Box display="flex" justifyContent="end" mt="20px" gap="10px">
              {editId && (
                <Button color="error" variant="contained" onClick={() => { setEditId(null); resetForm(); }}>
                  Cancel Edit
                </Button>
              )}
              <Button type="submit" color="secondary" variant="contained">
                {editId ? "Update User" : "Create New User"}
              </Button>
            </Box>

            {/* --- LIST SECTION --- */}
            <Box mt="40px">
              <Typography variant="h4" color={colors.grey[100]} mb="20px">
                Current Users
              </Typography>
              {users.length === 0 ? (
                <Typography color={colors.grey[400]}>No users found in LocalStorage.</Typography>
              ) : (
                users.map((user) => (
                  <Box 
                    key={user.id} 
                    display="flex" 
                    justifyContent="space-between" 
                    alignItems="center" 
                    p="15px" 
                    mb="10px" 
                    backgroundColor={colors.primary[400]} 
                    borderRadius="4px"
                  >
                    <Box>
                      <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="bold">
                        {user.name}
                      </Typography>
                      <Typography color={colors.grey[100]}>
                        {user.email} | {user.phone || user.contact}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton onClick={() => handleEdit(user, setValues)}>
                        <EditIcon sx={{ color: colors.blueAccent[500] }} />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(user.id)}>
                        <DeleteIcon sx={{ color: colors.redAccent[500] }} />
                      </IconButton>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

// --- VALIDATION & INITIAL VALUES ---
const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  contact: yup.string().matches(phoneRegExp, "Phone number is not valid").required("required"),
  address1: yup.string().required("required"),
  address2: yup.string().required("required"),
});

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  address1: "",
  address2: "",
};

export default Form;