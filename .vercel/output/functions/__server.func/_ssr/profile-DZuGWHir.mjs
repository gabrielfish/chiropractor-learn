import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { M as MemberNav, A as Avatar, a as AvatarImage, b as AvatarFallback } from "./MemberNav-C9W_HKgq.mjs";
import { B as Button, c as cn } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { F as FileDropzone, u as uploadAvatar, T as Textarea } from "./storage-BcoHSXhA.mjs";
import { S as Switch } from "./switch-DDHih_sy.mjs";
import { S as Select$1, a as SelectValue$1, b as SelectTrigger$1, c as SelectIcon, d as SelectPortal, e as SelectContent$1, f as SelectViewport, g as SelectItem$1, h as SelectItemIndicator, i as SelectItemText, j as SelectScrollUpButton$1, k as SelectScrollDownButton$1, l as SelectLabel$1, m as SelectSeparator$1 } from "../_libs/radix-ui__react-select.mjs";
import { c as createSsrRpc } from "./createSsrRpc-Bc62EJ78.mjs";
import { a as createServerFn } from "./server-BomfFVcN.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-dN1VnyDc.mjs";
import { a as getMyCertificates } from "./certificates.functions-DY-Kix5X.mjs";
import { c as Route$b } from "./router-BgAMxlwC.mjs";
import "../_libs/seroval.mjs";
import { L as LoaderCircle, a as Award, g as ExternalLink, C as ChevronDown, h as Check, i as ChevronUp } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType, b as booleanType, e as enumType } from "../_libs/zod.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./client-IF66mSk9.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const Select = Select$1;
const SelectValue = SelectValue$1;
const SelectTrigger = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SelectTrigger$1,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectIcon, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectTrigger$1.displayName;
const SelectScrollUpButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectScrollUpButton$1,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
const SelectScrollDownButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectScrollDownButton$1,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
const SelectContent = reactExports.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectPortal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SelectContent$1,
  {
    ref,
    className: cn(
      "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SelectViewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectContent$1.displayName;
const SelectLabel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectLabel$1,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectLabel$1.displayName;
const SelectItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SelectItem$1,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItemIndicator, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectItem$1.displayName;
const SelectSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectSeparator$1,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectSeparator$1.displayName;
const profileSchema = objectType({
  full_name: stringType().trim().max(120).optional().nullable(),
  phone: stringType().trim().max(40).optional().nullable(),
  practice_name: stringType().trim().max(160).optional().nullable(),
  avatar_url: stringType().trim().max(500).optional().nullable()
});
const getMyProfile = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("5dbf46616266e7bfe81c82694a91090a42de6200b3efc1b9d156faf41ac3a479"));
const updateMyProfile = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => profileSchema.parse(d)).handler(createSsrRpc("af00eb763dce352dc2f42ef901ef426a138feb40fdc7f79166552837a77fae5f"));
const notifSchema = objectType({
  email_notifications: booleanType()
});
const updateNotifications = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => notifSchema.parse(d)).handler(createSsrRpc("2a2a85018ac6471b99dbfe8748a9a15f3c193c941d51323d2869d2f60dd40f13"));
const supportSchema = objectType({
  category: enumType(["Technical Issue", "Content Question", "Account Help", "Other"]),
  subject: stringType().trim().min(1).max(200),
  message: stringType().trim().min(1).max(5e3)
});
const submitSupportRequest = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => supportSchema.parse(d)).handler(createSsrRpc("1782e9f811ec1dcea017745f63e3ca1e92463df1980385c794916a3e92f57f2c"));
const sendPasswordReset = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("564db20e34473e00382e57191a7750414f29e434be0ce0d9b62d87a074dd8ac3"));
function Section({
  title,
  description,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-xl bg-card border border-border shadow-card p-6 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: title }),
    description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: description }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 space-y-4", children })
  ] });
}
function ProfilePage() {
  const {
    user
  } = Route$b.useRouteContext();
  const fetchProfile = useServerFn(getMyProfile);
  const saveProfile = useServerFn(updateMyProfile);
  const saveNotifs = useServerFn(updateNotifications);
  const submitSupport = useServerFn(submitSupportRequest);
  const resetPassword = useServerFn(sendPasswordReset);
  const fetchCertificates = useServerFn(getMyCertificates);
  const profileQ = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => fetchProfile()
  });
  const certsQ = useQuery({
    queryKey: ["my-certificates"],
    queryFn: () => fetchCertificates()
  });
  const [fullName, setFullName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [practiceName, setPracticeName] = reactExports.useState("");
  const [avatarUrl, setAvatarUrl] = reactExports.useState("");
  const [savingProfile, setSavingProfile] = reactExports.useState(false);
  const [emailNotif, setEmailNotif] = reactExports.useState(true);
  const [category, setCategory] = reactExports.useState("Technical Issue");
  const [subject, setSubject] = reactExports.useState("");
  const [message, setMessage] = reactExports.useState("");
  const [submittingSupport, setSubmittingSupport] = reactExports.useState(false);
  const [sendingReset, setSendingReset] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const p = profileQ.data?.profile;
    if (!p) return;
    setFullName(p.full_name ?? "");
    setPhone(p.phone ?? "");
    setPracticeName(p.practice_name ?? "");
    setAvatarUrl(p.avatar_url ?? "");
    setEmailNotif(p.email_notifications ?? true);
  }, [profileQ.data]);
  const onSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await saveProfile({
        data: {
          full_name: fullName || null,
          phone: phone || null,
          practice_name: practiceName || null,
          avatar_url: avatarUrl || null
        }
      });
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSavingProfile(false);
    }
  };
  const onResetPassword = async () => {
    setSendingReset(true);
    try {
      await resetPassword();
      toast.success("Password reset email sent — check your inbox");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send reset email");
    } finally {
      setSendingReset(false);
    }
  };
  const onToggleEmail = async (v) => {
    setEmailNotif(v);
    try {
      await saveNotifs({
        data: {
          email_notifications: v
        }
      });
    } catch {
      setEmailNotif(!v);
      toast.error("Failed to update preference");
    }
  };
  const onSubmitSupport = async (e) => {
    e.preventDefault();
    setSubmittingSupport(true);
    try {
      await submitSupport({
        data: {
          category,
          subject,
          message
        }
      });
      toast.success("Your message has been received — we'll get back to you shortly.");
      setSubject("");
      setMessage("");
      setCategory("Technical Issue");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmittingSupport(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(MemberNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl md:text-4xl font-extrabold text-foreground", children: "Profile & Account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: "Manage your personal info, security, and preferences." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit: onSaveProfile, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Edit Profile", description: "Update your personal information.", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "full_name", children: "Full Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "full_name", value: fullName, onChange: (e) => setFullName(e.target.value), maxLength: 120 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", children: "Phone Number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "phone", value: phone, onChange: (e) => setPhone(e.target.value), maxLength: 40 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 sm:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "practice_name", children: "Practice Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "practice_name", value: practiceName, onChange: (e) => setPracticeName(e.target.value), maxLength: 160 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 sm:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Profile Photo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-20 w-20 shrink-0", children: [
                avatarUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: avatarUrl, alt: "Avatar" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary text-primary-foreground text-lg", children: (fullName || "U").slice(0, 1).toUpperCase() })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileDropzone, { label: "Upload profile photo", accept: "image/*", uploaded: !!avatarUrl, hint: "JPG or PNG, square works best", onFile: async (file) => {
                try {
                  const url = await uploadAvatar(user.id, file);
                  setAvatarUrl(url);
                  await saveProfile({
                    data: {
                      full_name: fullName || null,
                      phone: phone || null,
                      practice_name: practiceName || null,
                      avatar_url: url
                    }
                  });
                  toast.success("Profile photo updated");
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Upload failed");
                }
              } }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: savingProfile, className: "inline-flex items-center gap-2", children: [
          savingProfile && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          savingProfile ? "Saving…" : "Save Changes"
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Reset Password", description: "We'll email you a secure link to set a new password.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: onResetPassword, disabled: sendingReset, className: "inline-flex items-center gap-2", children: [
        sendingReset && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
        sendingReset ? "Sending…" : "Send Reset Email"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Notifications", description: "Choose how you want to hear from us.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground", children: "Email Notifications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "New content, announcements, and account updates." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: emailNotif, onCheckedChange: onToggleEmail })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit: onSubmitSupport, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Support", description: "Tell us what's going on and we'll get back to you.", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "category", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: category, onValueChange: setCategory, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "category", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Technical Issue", children: "Technical Issue" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Content Question", children: "Content Question" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Account Help", children: "Account Help" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Other", children: "Other" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "subject", children: "Subject" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "subject", required: true, maxLength: 200, value: subject, onChange: (e) => setSubject(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "message", children: "Message" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "message", required: true, maxLength: 5e3, rows: 6, value: message, onChange: (e) => setMessage(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: submittingSupport || !subject.trim() || !message.trim(), className: "inline-flex items-center gap-2", children: [
          submittingSupport && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          submittingSupport ? "Sending…" : "Submit"
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "My Certificates", description: "Certificates you have earned by completing courses and categories.", children: [
        certsQ.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          " Loading certificates…"
        ] }),
        !certsQ.isLoading && (!certsQ.data || certsQ.data.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 py-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-10 w-10 text-gold/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No certificates yet. Complete a course or category to earn one." })
        ] }),
        certsQ.data && certsQ.data.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: certsQ.data.map((cert) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-lg border border-gold/20 bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-6 w-6 shrink-0 text-gold mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: cert.reference_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              cert.type === "course" ? "Course" : "Category",
              " · ",
              new Date(cert.issued_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", variant: "outline", className: "h-7 text-xs border-gold/40 text-gold hover:bg-gold/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `/certificate/${cert.id}`, target: "_blank", rel: "noopener noreferrer", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3 mr-1" }),
                " View"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", variant: "outline", className: "h-7 text-xs border-border text-muted-foreground hover:bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `/certificate/${cert.id}`, target: "_blank", rel: "noopener noreferrer", onClick: (e) => {
                e.preventDefault();
                const win = window.open(`/certificate/${cert.id}`, "_blank");
                win?.addEventListener("load", () => win.print());
              }, children: "Download PDF" }) })
            ] })
          ] })
        ] }, cert.id)) })
      ] }) })
    ] })
  ] });
}
export {
  ProfilePage as component
};
