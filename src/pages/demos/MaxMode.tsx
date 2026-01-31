import type { MaxModeProps } from "./max-mode/types";
import { MaxModePage } from "./max-mode/MaxModePage";

export default function MaxMode(props: MaxModeProps) {
  return <MaxModePage {...props} />;
}
