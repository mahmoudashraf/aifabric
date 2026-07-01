import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MaxModeWidget } from "@/lib/max-mode-widget/max-mode-widget.esm.js";
import "@/lib/max-mode-widget/style.css";
import { API_AUTH_HEADERS, API_BASE_URL, CRUD_API_BASE_URL } from "@/pages/demos/AIFabricFramework/constants";

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
          chatBaseUrl: API_BASE_URL,
          crudBaseUrl: CRUD_API_BASE_URL,
          headers: API_AUTH_HEADERS,
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
