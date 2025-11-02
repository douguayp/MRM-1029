import { AlkanePoint, CalibrationModel, MappedCompound } from '@/lib/types';

const ALKANE_RI: Record<string, number> = {
  'C7': 700, 'C8': 800, 'C9': 900, 'C10': 1000,
  'C11': 1100, 'C12': 1200, 'C13': 1300, 'C14': 1400,
  'C15': 1500, 'C16': 1600, 'C17': 1700, 'C18': 1800,
  'C19': 1900, 'C20': 2000, 'C21': 2100, 'C22': 2200,
  'C23': 2300, 'C24': 2400, 'C25': 2500, 'C26': 2600,
  'C27': 2700, 'C28': 2800, 'C29': 2900, 'C30': 3000,
  'C31': 3100, 'C32': 3200, 'C33': 3300, 'C34': 3400, 'C35': 3500
};

export function validateAlkanes(alkanes: AlkanePoint[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (alkanes.length < 6) {
    errors.push('At least 6 alkane points are required');
  }

  const enriched = alkanes.map(a => ({
    ...a,
    ri: a.ri || ALKANE_RI[a.name] || 0
  }));

  for (let i = 1; i < enriched.length; i++) {
    if (enriched[i].rt <= enriched[i - 1].rt) {
      errors.push(`RT must be monotonically increasing (${enriched[i - 1].name} -> ${enriched[i].name})`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function buildCalibrationModel(alkanes: AlkanePoint[]): CalibrationModel {
  const enriched = alkanes
    .map(a => ({
      ...a,
      ri: a.ri || ALKANE_RI[a.name] || 0
    }))
    .sort((a, b) => a.rt - b.rt);

  const rtRange: [number, number] = [
    enriched[0].rt,
    enriched[enriched.length - 1].rt
  ];

  return {
    type: 'piecewise_linear_monotone',
    points: enriched.length,
    rangeRT: rtRange,
    alkanes: enriched
  };
}

export function riToRt(ri: number, model: CalibrationModel): { rt: number; warning?: string } {
  const { alkanes, rangeRT } = model;

  if (alkanes.length < 2) {
    return { rt: 0, warning: 'Insufficient calibration points' };
  }

  let warning: string | undefined;
  const firstRI = alkanes[0].ri ?? 0;
  const lastRI = alkanes[alkanes.length - 1].ri ?? 0;

  if (ri < firstRI) {
    warning = `RI ${ri} is below calibration range (${firstRI})`;
    return { rt: alkanes[0].rt, warning };
  }

  if (ri > lastRI) {
    warning = `RI ${ri} is above calibration range (${lastRI})`;
    return { rt: alkanes[alkanes.length - 1].rt, warning };
  }

  for (let i = 0; i < alkanes.length - 1; i++) {
    const a1 = alkanes[i];
    const a2 = alkanes[i + 1];
    const a1RI = a1.ri ?? 0;
    const a2RI = a2.ri ?? 0;

    if (ri >= a1RI && ri <= a2RI) {
      const slope = (a2.rt - a1.rt) / (a2RI - a1RI);
      const rt = a1.rt + slope * (ri - a1RI);
      return { rt: parseFloat(rt.toFixed(3)) };
    }
  }

  return { rt: alkanes[0].rt, warning: 'Interpolation failed' };
}

export function parseRtWindowText(text: string | undefined): [number, number] | null {
  if (!text) return null;

  const plusMinusMatch = text.match(/[±]\s*([\d.]+)/);
  if (plusMinusMatch) {
    const delta = parseFloat(plusMinusMatch[1]);
    return [-delta, delta];
  }

  const rangeMatch = text.match(/([\d.]+)\s*[-–—]\s*([\d.]+)/);
  if (rangeMatch) {
    const lower = parseFloat(rangeMatch[1]);
    const upper = parseFloat(rangeMatch[2]);
    return [lower, upper];
  }

  return null;
}

export function mapCompoundsToRT(
  compounds: Array<{ compoundId: string; RI_ref: number; RT_window?: string }>,
  model: CalibrationModel,
  defaultWindow: number
): MappedCompound[] {
  return compounds.map(c => {
    const { rt, warning } = riToRt(c.RI_ref, model);

    let rtWindow: [number, number];
    const parsed = parseRtWindowText(c.RT_window);

    if (parsed) {
      rtWindow = parsed;
    } else {
      rtWindow = [-defaultWindow, defaultWindow];
    }

    return {
      compoundId: c.compoundId,
      RT_pred: rt,
      RT_window: rtWindow,
      warning
    };
  });
}
