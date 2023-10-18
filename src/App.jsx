import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MainContent from './componant/MainContent';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div style={{
        // background:'green',
        display: 'flex',
        justifyContent: 'center',
        width: '100vw',
      }}>
      <Container maxWidth="xl">
        <MainContent />
      </Container>
      
      </div>
   
    </>
  )
}

export default App
