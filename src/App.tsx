import type { Component } from "solid-js";
import { Room } from "./components/Room";

const App: Component = () => {
  return (
    <div>
      <Room roomId="test" />
    </div>
  );
};

export default App;
