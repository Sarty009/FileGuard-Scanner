import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { MalwareAnalysis } from "./pages/MalwareAnalysis";
// Correct the import statement to use a default import
import NotFound from "./pages/NotFound";

// We no longer need to import or use IndexPage

function App() {
  return (
    <>
      <Routes>
        {/* This is the key change. 
          We are now declaratively redirecting the root path "/" to "/scan".
          This is more stable than using a useEffect hook for navigation.
        */}
        <Route path="/" element={<Navigate to="/scan" replace />} />
        
        <Route path="/scan" element={<MalwareAnalysis />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
