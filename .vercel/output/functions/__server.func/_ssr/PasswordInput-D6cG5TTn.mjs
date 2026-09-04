import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { E as EyeOff, b as Eye } from "../_libs/lucide-react.mjs";
const PasswordInput = reactExports.forwardRef(
  (props, ref) => {
    const [visible, setVisible] = reactExports.useState(false);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          ...props,
          ref,
          type: visible ? "text" : "password",
          className: `pr-10 ${props.className ?? ""}`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setVisible((v) => !v),
          className: "absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors",
          tabIndex: -1,
          "aria-label": visible ? "Hide password" : "Show password",
          children: visible ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
        }
      )
    ] });
  }
);
PasswordInput.displayName = "PasswordInput";
export {
  PasswordInput as P
};
