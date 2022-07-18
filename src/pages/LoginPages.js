import React, { useState } from "react";
import { FormProvider, FTextField } from "../components/form";
import {Alert,Link, Button, Stack, Typography, IconButton, InputAdornment } from "@mui/material";
import * as yup from "yup";
import useAuth from "../hooks/useAuth";
import { useLocation, useNavigate, Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from '@mui/icons-material';


const LoginSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.number().required("Password is required")
});
const defaultValues = {
  username: "",
  password: "",
};


function LoginPages() {
  const [showPassword, setShowPassword] = useState(false)

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(LoginSchema),
  });
  const { handleSubmit } = methods;

  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = (data) => {
    let {username, password} = data
    const getUsername = window.localStorage.getItem("username")
    const getPassword= window.localStorage.getItem("password")
    if(username == getUsername && password == getPassword ){
      auth.login(data.username, () => {
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      });
    }else{
      auth.loginError(()=> {
        navigate('/login')
      })
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ width: { md: "350px", xs: "200px" } }}>
        <Typography variant="h4" textAlign="center">
          Login
        </Typography>
        { auth.error && ( <Alert severity="error">{auth.error}</Alert>)}
        <Alert severity="info">
            Don’t have an account?{" "}
            <Link variant="subtitle2" component={RouterLink} to="/register">
              Get started
            </Link>
        </Alert>
        <FTextField name="username" label="Username" />
        <FTextField
         name="password" 
         label="Password" 
         type= {showPassword ? "text" : "password"}
          InputProps={{
          endAdornment:(
            <InputAdornment position="end">
              <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)} 
              onMouseDown={(e)=> e.preventDefault()}
              edge="end"
              >
                {showPassword ? <Visibility/> : <VisibilityOff/>}
              </IconButton>
            </InputAdornment>
          )
        }}
        />
        <Button type="submit" variant="contained">
          Login
        </Button>
      </Stack>
    </FormProvider>
  )
}

export default LoginPages