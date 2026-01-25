import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MaxMode from "./demos/MaxMode";

const MaxAIMode = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-open MAX Mode when component mounts
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Navigate back to demos page when MAX Mode is closed
    navigate('/demos/ai-fabric-framework');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <MaxMode isOpen={isOpen} onClose={handleClose} />
    </div>
  );
};

export default MaxAIMode;
