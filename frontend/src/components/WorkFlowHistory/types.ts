export type WorkFlowHistoryProps = {
  workflowHistory: History[];
};

export interface History {
  approvedBy: string;
  createdAt: number;
  departmentName: string;
  status: string;
  workflowName?: string;
  department?: string;
  comments?: string | undefined;
  behalfApprover?: string | undefined;
}
