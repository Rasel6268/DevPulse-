import type { IssueStatus, IssueType } from "./issue.type";

export interface UpdateIssue {
  title?: string;
  description?: string;
  type?: IssueType;
  status?: IssueStatus;
}