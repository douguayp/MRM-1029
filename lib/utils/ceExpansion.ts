import { Transition } from '@/lib/types';

export interface ExpandedTransition extends Transition {
  CE_tier: 'N' | 'L' | 'H';
  CE_value: number;
}

export function expandThreePointCE(
  transitions: Transition[],
  delta: number = 4
): ExpandedTransition[] {
  const result: ExpandedTransition[] = [];

  for (const t of transitions) {
    const ceLow = t.CE_low ?? (t.CE_nominal - delta);
    const ceHigh = t.CE_high ?? (t.CE_nominal + delta);

    result.push({
      ...t,
      CE_tier: 'N',
      CE_value: t.CE_nominal
    });

    result.push({
      ...t,
      CE_tier: 'L',
      CE_value: ceLow
    });

    result.push({
      ...t,
      CE_tier: 'H',
      CE_value: ceHigh
    });
  }

  return result;
}
