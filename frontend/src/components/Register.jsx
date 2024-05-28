import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import axios from 'axios'
import { TEInput, TERipple } from "tw-elements-react";

export default function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({});
    const [usernameExist, setUsernameExist] = useState('')

    const navigate = useNavigate()


    const validateUsername = (username) => {
        if (username.length < 4 || username.length > 15) {
          return 'Username must be between 4 and 15 characters long.';
        }
        return '';
      };
    
      const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
        if (!passwordRegex.test(password)) {
          return 'Password must be 8-20 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.';
        }
        return '';
      };

      const validateConfirmPassword = (password, confirmPassword) => {
        if (password !== confirmPassword) {
          return 'Passwords do not match.';
        }
        return '';
      };

    const handleRegister = async (e)=>{
        e.preventDefault()

        const usernameError = validateUsername(username);
        const passwordError = validatePassword(password);
        const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
    
        if (usernameError || passwordError || confirmPasswordError) {
          setErrors({ username: usernameError, password: passwordError, confirmPassword: confirmPasswordError });
          return;
        }
    
        setErrors({}); // Clear errors if validation passes

        try{
           const response = await axios.post('http://localhost:5555/register', {username, password})
            .then((res)=>{
                console.log(res.data)

                if (res.status === 201) {
                    console.log('Registration successful');
                    navigate('/')
                  } else {
                    console.log('Error registering user');
                  }
            })
            }catch(err){
                console.log('error message:', err.response.data)
                if(err.response.data === 'Username is not available'){
                    setUsernameExist('Username is not available')
                }
        }
    }

  return (
    <section className="h-screen">
      <div className="h-full">
        {/* <!-- Left column container with background--> */}
        <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
          <div className="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
            <img
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="w-full"
              alt="Sample image"
            />
          </div>

          {/* <!-- Right column container --> */}
          <div className="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
            <form onSubmit={handleRegister}>
              {/* <!-- Email input --> */}
              <TEInput
                required
                type="text"
                label="Create username"
                size="lg"
                className={`${!errors.username ? "mb-6" : "mb-0"}`}
                value = {username}
                onChange={(e)=>setUsername(e.target.value)}
              ></TEInput>
               {errors.password && <p className='text-sm p-0 mb-6' style={{color: "rgb(220 38 38 / var(--tw-text-opacity))"}}>{errors.username}</p>}
               {usernameExist && <p className='text-sm p-0 mb-6' style={{color: "rgb(220 38 38 / var(--tw-text-opacity))"}}>{usernameExist}</p>}

              {/* <!--Password input--> */}
              <TEInput
                required
                type="password"
                label="Create password"
                value = {password}
                className={`${!errors.confirmPassword ? "mb-6" : "mb-0"}`}
                onChange={(e)=>setPassword(e.target.value)}
                size="lg"
              ></TEInput>
               {errors.password && <p  className='text-sm p-0 mb-6' style={{color: "rgb(220 38 38 / var(--tw-text-opacity))"}}>{errors.password}</p>}

              {/* <!--Confirm Password--> */}
               <TEInput
                required
                type="password"
                label="Confirm password"
                value = {confirmPassword}
                className={`${!errors.password ? "mb-6" : "mb-0"}`}
                onChange={(e)=>setConfirmPassword(e.target.value)}
                size="lg"
              ></TEInput>
               {errors.password && <p  className='text-sm p-0 mb-6' style={{color: "rgb(220 38 38 / var(--tw-text-opacity))"}}>{errors.confirmPassword}</p>}

              {/* <!-- Login button --> */}
              <div className="text-center lg:text-left">
                <TERipple rippleColor="light">
                  <button
                    type="submit"
                    className="inline-block rounded bg-primary px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                    
                  >
                    Register
                  </button>
                </TERipple>

                {/* <!-- Register link --> */}
                <p className="mb-0 mt-2 pt-1 text-sm font-semibold">
                  Have an account?{" "}
                  <NavLink to="/"className="text-danger transition duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600 active:text-danger-700">                
                    Login
                  </NavLink>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}