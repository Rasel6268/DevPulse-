import type { IssueStatus, IssueType } from "./issue.type";

export interface Issue {
  id: number;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
}