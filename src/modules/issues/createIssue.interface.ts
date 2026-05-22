import type { IssueType } from "./issue.type";

export interface CreateIssue {
  title: string;
  description: string;
  type: IssueType;
}