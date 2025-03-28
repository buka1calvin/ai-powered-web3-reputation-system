import { DeveloperInfo, RecruiterInfo } from "../types/types";

// Validation functions for role-specific information
function validateDeveloperInfo(developerInfo: DeveloperInfo) {
  return (
    Array.isArray(developerInfo.skills) &&
    developerInfo.skills.length > 0 &&
    typeof developerInfo.experience === "number" &&
    developerInfo.experience >= 0 &&
    typeof developerInfo.reputationScore === "number"
  );
}

function validateRecruiterInfo(recruiterInfo: RecruiterInfo) {
  return (
    recruiterInfo.company &&
    recruiterInfo.position &&
    typeof recruiterInfo.reputationScore === "number"
  );
}

export { validateDeveloperInfo, validateRecruiterInfo };
