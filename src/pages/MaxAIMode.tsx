import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Host-app wrapper that imports MaxMode from the widget package.
 * This demonstrates how a consuming app integrates the widget.
 *
 * For external consumers the import would be:
 *   import { MaxModeWidget } from '@anthropic/max-mode-widget';
 *   import '@anthropic/max-mode-widget/styles.css';
 *
 * Here we use the local package path for monorepo development.
 */
import MaxMode from "./demos/MaxMode";

const MaxAIMode = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    navigate("/demos/ai-fabric-framework");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <MaxMode isOpen={isOpen} onClose={handleClose} />
    </div>
  );
};

export default MaxAIMode;
