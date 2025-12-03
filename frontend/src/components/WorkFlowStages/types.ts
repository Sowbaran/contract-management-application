export type WorkFlowStagesProps = {
  steps: Step[];
  status?: string;
};

export interface Step {
  level?: string;
  name?: string;
  status?: string;
}