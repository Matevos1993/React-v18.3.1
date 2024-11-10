import FilterInterface from "./Components/FilterInterface/FilterInterface";
import PhotoUpload from "./Components/PhotoUpload/PhotoUpload";

import "./App.scss";

function App() {
  return (
    <div className="App">
      <PhotoUpload />
      <FilterInterface />
    </div>
  );
}

export default App;
