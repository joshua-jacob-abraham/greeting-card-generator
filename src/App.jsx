import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import Envelope from "./Envelope";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Envelope />} />
        <Route path="/:name1/:name2" element={<Envelope />} />
      </Routes>
    </Router>
  );
}

export default App;