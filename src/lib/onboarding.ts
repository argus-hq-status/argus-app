export type AccountType = "individual" | "team";
export type UseCase = "personal" | "work";

export type OnboardingData = {
  accountType: AccountType | null;
  role: string;
  useCase: UseCase | null;
  teamSize: string;
  industry: string;
  workspaceName: string;
  inviteEmails: string[];
  monitorName: string;
  monitorUrl: string;
};

export const emptyOnboardingData: OnboardingData = {
  accountType: null,
  role: "",
  useCase: null,
  teamSize: "",
  industry: "",
  workspaceName: "",
  inviteEmails: [],
  monitorName: "",
  monitorUrl: "",
};

export const roleOptions = [
  "Software engineer",
  "DevOps / SRE",
  "Engineering manager",
  "Founder / CEO",
  "Product manager",
  "IT / Systems admin",
  "Student / Hobbyist",
  "Other",
];

export const teamSizeOptions = [
  { value: "2-10", label: "2–10 people" },
  { value: "11-50", label: "11–50 people" },
  { value: "51-200", label: "51–200 people" },
  { value: "201-500", label: "201–500 people" },
  { value: "500+", label: "500+ people" },
];

export const industryOptions = [
  "Software / SaaS",
  "Fintech",
  "E-commerce",
  "Healthcare",
  "Education",
  "Media",
  "Agency / Consultancy",
  "Government / Non-profit",
  "Other",
];

/**
 * Steps are derived from answers, so the progress indicator and navigation stay
 * in sync when someone changes an earlier choice.
 */
export type StepId =
  | "accountType"
  | "role"
  | "useCase"
  | "teamSize"
  | "industry"
  | "workspace"
  | "invite"
  | "firstMonitor";

export function getSteps(data: OnboardingData): StepId[] {
  const isTeam = data.accountType === "team";
  const isWork = data.useCase === "work" || isTeam;

  return [
    "accountType",
    "role",
    "useCase",
    ...(isTeam ? (["teamSize"] as const) : []),
    ...(isWork ? (["industry"] as const) : []),
    "workspace",
    ...(isTeam ? (["invite"] as const) : []),
    "firstMonitor",
  ];
}

export function isStepComplete(step: StepId, data: OnboardingData): boolean {
  switch (step) {
    case "accountType":
      return data.accountType !== null;
    case "role":
      return data.role.trim().length > 0;
    case "useCase":
      return data.useCase !== null;
    case "teamSize":
      return data.teamSize.length > 0;
    case "industry":
      return data.industry.length > 0;
    case "workspace":
      return data.workspaceName.trim().length > 0;
    // Invites and the first monitor are optional.
    case "invite":
    case "firstMonitor":
      return true;
  }
}

export function suggestWorkspaceName(
  accountType: AccountType | null,
  firstName: string | null | undefined,
): string {
  if (accountType === "individual" && firstName) {
    return `${firstName}'s Workspace`;
  }
  return "";
}
