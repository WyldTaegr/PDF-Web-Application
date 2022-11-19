import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Homepage from "./components/Homepage";
import "antd/dist/antd.css";
 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Homepage />}>
          
        </Route>
        <Route path="/dashboard" element={<Dashboard />}>
      
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
 
export default App;
