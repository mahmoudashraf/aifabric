import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MaxModeWidget } from "../../packages/max-mode-widget/dist/max-mode-widget.esm.js";
import "../../packages/max-mode-widget/dist/style.css";

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
      <MaxModeWidget
        isOpen={isOpen}
        onClose={handleClose}
        apiConfig={{
          chatBaseUrl: "https://rest-connector-dep-1bf14c33-dev.up.railway.app/api",
          crudBaseUrl: "https://ai-fabric-framework-production-a247.up.railway.app/api",
          headers: { "X-AIFABRIC-API-KEY": "test" },
        }}
        features={{
          cart: true,
          debug: true,
          conversations: true,
          quickActions: true,
        }}
      />
    </div>
  );
};

export default MaxAIMode;
