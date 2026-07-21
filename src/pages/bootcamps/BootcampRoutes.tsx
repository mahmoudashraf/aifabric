import { Route, Routes } from "react-router-dom";

import { CourseAuthProvider } from "@/pages/course/hooks/CourseAuthContext";

import BootcampDetailPage from "./BootcampDetailPage";
import BootcampHubPage from "./BootcampHubPage";

const BootcampRoutes = () => (
  <CourseAuthProvider>
    <Routes>
      <Route index element={<BootcampHubPage />} />
      <Route path=":slug" element={<BootcampDetailPage />} />
    </Routes>
  </CourseAuthProvider>
);

export default BootcampRoutes;
