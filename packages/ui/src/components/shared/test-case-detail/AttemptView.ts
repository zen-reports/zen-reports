import type { Attachment, TestCase, TestError, TestStep } from '@zen-reports/zen-core';

export interface AttemptView {
  status: 'passed' | 'failed' | 'skipped' | 'timedOut' | 'interrupted';
  duration: number;
  error: TestError | null;
  steps?: TestStep[];
  stdout?: string[];
  stderr?: string[];
  attachments?: Attachment[];
}

export const statusConfig = {
  passed: {
    bg: 'bg-success-100 text-success-700 ring-1 ring-success-200 dark:bg-success-500/20 dark:text-success-400 dark:ring-1 dark:ring-success-500/30',
    text: 'text-success-600 dark:text-success-400',
    dot: 'bg-success-500',
  },
  failed: {
    bg: 'bg-red-50 text-red-700 ring-1 ring-red-600/20 dark:bg-red-500/20 dark:text-red-400 dark:ring-1 dark:ring-red-500/40',
    text: 'text-red-700 dark:text-red-400',
    dot: 'bg-red-500',
  },
  skipped: {
    bg: 'bg-slate-200/80 text-slate-800 ring-1 ring-slate-300 dark:bg-slate-700/60 dark:text-slate-200 dark:ring-1 dark:ring-slate-600',
    text: 'text-text-muted dark:text-text-muted',
    dot: 'bg-surface-300',
  },
  timedOut: {
    bg: 'bg-rose-50 text-rose-800 ring-1 ring-rose-900/20 dark:bg-rose-500/20 dark:text-rose-300 dark:ring-1 dark:ring-rose-500/40',
    text: 'text-rose-800 dark:text-rose-300',
    dot: 'bg-rose-400',
  },
  interrupted: {
    bg: 'bg-orange-50 text-orange-800 ring-1 ring-orange-600/20 dark:bg-orange-500/20 dark:text-orange-300 dark:ring-1 dark:ring-orange-500/40',
    text: 'text-orange-800 dark:text-orange-300',
    dot: 'bg-orange-500',
  },
};

/** Collect top-level and step-level attachments for a single attempt, deduplicated. */
export function collectAttemptAttachments(attempt: AttemptView): Attachment[] {
  const topLevel = attempt.attachments || [];
  const stepList: Attachment[] = [];
  const collectFromSteps = (steps?: TestStep[]) => {
    if (!steps) return;
    for (const step of steps) {
      if (step.attachments && step.attachments.length > 0) {
        stepList.push(...step.attachments);
      }
      if (step.subSteps && step.subSteps.length > 0) {
        collectFromSteps(step.subSteps);
      }
    }
  };
  collectFromSteps(attempt.steps);

  const result: Attachment[] = topLevel.map((att) => ({ ...att }));

  for (const stepAtt of stepList) {
    const existing = result.find(
      (a) =>
        a.name === stepAtt.name &&
        (a.contentType === stepAtt.contentType || !a.contentType || !stepAtt.contentType)
    );
    if (existing) {
      if (!existing.body && stepAtt.body) {
        existing.body = stepAtt.body;
      }
    } else {
      result.push({ ...stepAtt });
    }
  }

  return result;
}

/** Calculate total duration of an attempt, summing step durations if steps are present. */
export function getAttemptDuration(attempt: AttemptView): number {
  if (attempt.steps && attempt.steps.length > 0) {
    const stepSum = attempt.steps.reduce((acc, step) => acc + (step.duration || 0), 0);
    if (stepSum > 0) return stepSum;
  }
  return attempt.duration;
}

export function buildAttempts(testCase: TestCase): AttemptView[] {
  const finalAttempt: AttemptView = {
    status: testCase.status,
    duration:
      testCase.steps && testCase.steps.length > 0
        ? testCase.steps.reduce((acc, step) => acc + (step.duration || 0), 0)
        : testCase.duration,
    error: testCase.errors && testCase.errors.length > 0 ? testCase.errors[0] : null,
    steps: testCase.steps,
    stdout: testCase.stdout,
    stderr: testCase.stderr,
    attachments: testCase.attachments,
  };
  const failedAttempts = testCase.failedAttempts || [];
  return testCase.status === 'failed' ||
    testCase.status === 'timedOut' ||
    testCase.status === 'interrupted'
    ? failedAttempts.length > 0
      ? failedAttempts
      : [finalAttempt]
    : [...failedAttempts, finalAttempt];
}
