const fontStack =
  '"Switzer", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';

const sharedVariables = {
  fontFamily: fontStack,
  fontFamilyButtons: fontStack,
  fontSize: "0.8125rem",
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  colorPrimary: "#0a0a0a",
  colorText: "#171717",
  colorTextSecondary: "#6b7280",
  colorInputBackground: "#ffffff",
  colorInputText: "#171717",
  colorBackground: "#ffffff",
  borderRadius: "0.4375rem",
  spacingUnit: "0.75rem",
} as const;

const sharedElements = {
  rootBox: "w-full",
  cardBox:
    "w-full overflow-hidden rounded-xl border-0 bg-white shadow-[0_10px_36px_rgba(15,23,42,0.14)]",
  card: "w-full gap-0 rounded-none border-0 bg-transparent p-0 shadow-none",
  pageScrollBox: "p-0",
  header: "flex flex-col items-center gap-0.5 px-6 pb-4 pt-[1.375rem] text-center",
  headerTitle: "text-base font-semibold leading-[1.375rem] tracking-tight text-gray-950",
  headerSubtitle: "mx-auto max-w-[19rem] text-[0.8125rem] font-normal leading-5 text-gray-500",
  main: "gap-3 px-6 pb-5",
  socialButtons: "gap-2",
  socialButtonsBlockButton:
    "h-8 rounded-[0.4375rem] border border-gray-200 bg-white text-xs font-medium text-gray-900 shadow-none transition-colors hover:bg-gray-50",
  socialButtonsBlockButtonText: "text-[0.8125rem] font-medium",
  socialButtonsIconButton:
    "h-8 min-w-0 flex-1 rounded-[0.4375rem] border border-gray-200 bg-white shadow-none transition-colors hover:bg-gray-50",
  socialButtonsProviderIcon: "size-4",
  dividerRow: "my-0.5",
  dividerLine: "bg-gray-200",
  dividerText: "px-3 text-xs font-normal text-gray-400",
  form: "gap-3.5",
  formFields: "gap-3.5",
  formFieldRow: "gap-2.5",
  formFieldLabel: "text-[0.8125rem] font-medium text-gray-800",
  formFieldLabelRow: "mb-[0.3125rem] flex items-center justify-between gap-2",
  formFieldOptionalLabel: "text-xs font-normal text-gray-400",
  formFieldInput:
    "h-8 min-h-8 rounded-[0.4375rem] border-gray-200 px-2.5 text-xs font-normal shadow-none placeholder:text-gray-400 focus:border-gray-300 focus:ring-2 focus:ring-gray-100",
  formFieldInputShowPasswordButton: "text-gray-400 hover:text-gray-600",
  formButtonPrimary:
    "mt-0.5 h-8 min-h-8 rounded-[0.4375rem] bg-gray-600 text-xs font-semibold normal-case tracking-normal text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_1px_2px_rgba(0,0,0,0.2)] transition-colors hover:bg-gray-500",
  formButtonReset: "hidden",
  footer: "border-t border-gray-100 bg-[#fafafa] px-6 py-3",
  footerAction: "mx-auto justify-center py-0",
  footerActionText: "text-[0.8125rem] font-normal text-gray-600",
  footerActionLink: "text-[0.8125rem] font-semibold text-gray-950 hover:text-gray-700",
  identityPreview: "rounded-[0.4375rem] border-gray-200",
  otpCodeFieldInput: "h-8 rounded-[0.4375rem]",
  formResendCodeLink: "text-[0.8125rem] font-medium",
  alert: "rounded-[0.4375rem] text-[0.8125rem]",
  formFieldSuccessText: "text-xs",
  formFieldErrorText: "text-xs",
} as const;

// `options` is the current appearance API; `layout` is kept for older Clerk builds.
const signInOptions = {
  socialButtonsPlacement: "top",
  socialButtonsVariant: "blockButton",
  shimmer: false,
} as const;

const signUpOptions = {
  socialButtonsPlacement: "top",
  socialButtonsVariant: "blockButton",
  showOptionalFields: true,
  shimmer: false,
} as const;

export const clerkSignInAppearance = {
  variables: sharedVariables,
  elements: sharedElements,
  options: signInOptions,
  layout: signInOptions,
} as const;

export const clerkSignUpAppearance = {
  variables: sharedVariables,
  elements: sharedElements,
  options: signUpOptions,
  layout: signUpOptions,
} as const;
