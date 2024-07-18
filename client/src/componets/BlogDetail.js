import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, CircularProgress, InputLabel, Snackbar, TextField, Typography } from "@mui/material";
import { Alert } from "@mui/lab";
import axios from "axios";
import config from "../config";

const labelStyles = { mb: 1, mt: 2, fontSize: "24px", fontWeight: "bold" };

const BlogDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [inputs, setInputs] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`${config.BASE_URL}/api/blogs/${id}`);
        setBlog(res.data.blog);
        setInputs({ title: res.data.blog.title, description: res.data.blog.description });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const sendRequest = async () => {
    try {
      const res = await axios.put(`${config.BASE_URL}/api/blogs/update/${id}`, {
        title: inputs.title,
        description: inputs.description,
      });
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputs.title || !inputs.description) {
      setMessage("All fields are required.");
      setSeverity("error");
      setOpen(true);
      return;
    }
    sendRequest()
      .then((data) => {
        setMessage("Blog updated successfully!");
        setSeverity("success");
        setOpen(true);
        setTimeout(() => navigate("/myBlogs/"), 2000);
      })
      .catch((err) => {
        setMessage("Failed to update the blog.");
        setSeverity("error");
        setOpen(true);
      });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <Box
            border={3}
            borderColor="linear-gradient(90deg, rgba(58,75,180,1) 2%, rgba(116,49,110,1) 36%, rgba(2,0,161,1) 73%, rgba(69,92,252,1) 100%)"
            borderRadius={10}
            boxShadow="10px 10px 20px #ccc"
            padding={3}
            margin={"auto"}
            marginTop={3}
            display="flex"
            flexDirection={"column"}
            width={"80%"}
          >
            <Typography fontWeight={"bold"} padding={3} color="grey" variant="h2" textAlign={"center"}>
              Post Your Blog
            </Typography>
            <InputLabel sx={labelStyles}>Title</InputLabel>
            <TextField
              name="title"
              onChange={handleChange}
              value={inputs.title}
              margin="auto"
              variant="outlined"
              error={!inputs.title}
              helperText={!inputs.title ? "Title is required" : ""}
            />
            <InputLabel sx={labelStyles}>Description</InputLabel>
            <TextField
              name="description"
              onChange={handleChange}
              value={inputs.description}
              margin="auto"
              variant="outlined"
              multiline
              rows={4}
              error={!inputs.description}
              helperText={!inputs.description ? "Description is required" : ""}
            />
            <Button sx={{ mt: 2, borderRadius: 4 }} variant="contained" color="warning" type="submit">
              Submit
            </Button>
          </Box>
        </form>
      )}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BlogDetail;
