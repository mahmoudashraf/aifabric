import { useContext } from "react";

import { CourseAuthContext } from "./courseAuthState";

export const useCourseAuth = () => {
  const context = useContext(CourseAuthContext);
  if (!context) throw new Error("useCourseAuth must be used inside CourseAuthProvider");
  return context;
};
