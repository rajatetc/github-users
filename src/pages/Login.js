import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import styled from 'styled-components'
import loginImg from '../images/login-img.svg'
const Login = () => {
  const { loginWithRedirect } = useAuth0()
  return (
    <Wrapper>
      <div className='container'>
        <img src={loginImg} alt='github user' />
        <h1>github user</h1>
        <button className='btn' onClick={loginWithRedirect}>
          login / sign up
        </button>
        <div className='demo'>
          <h4> Demo Account Credentials: </h4>
          <h5> Email: test@test.com & Password: Testing123</h5>
        </div>
      </div>
    </Wrapper>
  )
}
const Wrapper = styled.section`
  min-height: 100vh;
  display: grid;
  place-items: center;
  .container {
    width: 90vw;
    max-width: 600px;
    text-align: center;
  }

  img {
    margin-bottom: 2rem;
  }
  h1 {
    margin-bottom: 1.5rem;
  }

  .demo {
    margin-top: 1rem;
    padding-top: 1rem;
    display: grid;
    grid-template-rows: 1fr 1fr;
    background-color: hsl(184, 84%, 87%);
  }
`
export default Login
