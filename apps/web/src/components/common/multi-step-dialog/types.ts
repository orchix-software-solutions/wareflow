export interface MultiStepDialogStep {
  title: string;
  description: string;
  footer: React.ReactNode;
}

export interface MultiStepDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  steps: MultiStepDialogStep[];
  currentStep: number;
  children: React.ReactNode;
  className?: string;
  /** Override dot count with internal sub-step count (e.g. a multi-step form inside a single dialog step) */
  subSteps?: number;
  /** Zero-based index of the current sub-step */
  currentSubStep?: number;
}
