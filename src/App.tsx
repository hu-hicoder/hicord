import React from 'react'
import { Room } from './components/Room.tsx'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>Hello</div>
        <Room roomId="test" />
      </header>
    </div>
  )
}

export default App
