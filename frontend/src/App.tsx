import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { MalwareAnalysis } from "./pages/MalwareAnalysis";
import NotFound from "./pages/NotFound";

function App() {
  return (
    // This is the key change. We are adding a class to the main container
    // to ensure it takes up exactly the full height of the screen and no more,
    // which will prevent any overflow that causes a scrollbar.
    <div className="h-screen overflow-hidden">
      <Routes>
        <Route path="/" element={<Navigate to="/scan" replace />} />
        <Route path="/scan" element={<MalwareAnalysis />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;