import { Route, Routes } from "react-router-dom";

import { CourseAuthProvider } from "./hooks/CourseAuthContext";
import CourseHubPage from "./CourseHubPage";
import CourseLessonPage from "./CourseLessonPage";
import CourseProgressPage from "./CourseProgressPage";
import CourseUnavailablePage from "./CourseUnavailablePage";

const CourseRoutes = () => (
  <CourseAuthProvider>
    <Routes>
      <Route index element={<CourseHubPage />} />
      <Route path="quickstart" element={<CourseLessonPage />} />
      <Route path=":trackId/:slug" element={<CourseLessonPage />} />
      <Route path="progress" element={<CourseProgressPage />} />
      <Route path="*" element={<CourseUnavailablePage />} />
    </Routes>
  </CourseAuthProvider>
);

export default CourseRoutes;
