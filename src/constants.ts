export type TrigFunction = 'sin' | 'cos' | 'tan' | 'cosec' | 'sec' | 'cot';
export type Angle = 0 | 30 | 45 | 60 | 90;

export interface TrigRatio {
  func: TrigFunction;
  angle: Angle;
  value: string;
  displayValue: string;
}

export const ANGLES: Angle[] = [0, 30, 45, 60, 90];
export const FUNCTIONS: TrigFunction[] = ['sin', 'cos', 'tan', 'cosec', 'sec', 'cot'];

export const TRIG_TABLE: Record<TrigFunction, Record<Angle, string>> = {
  sin: {
    0: "0",
    30: "1/2",
    45: "1/√2",
    60: "√3/2",
    90: "1"
  },
  cos: {
    0: "1",
    30: "√3/2",
    45: "1/√2",
    60: "1/2",
    90: "0"
  },
  tan: {
    0: "0",
    30: "1/√3",
    45: "1",
    60: "√3",
    90: "Not defined"
  },
  cosec: {
    0: "Not defined",
    30: "2",
    45: "√2",
    60: "2/√3",
    90: "1"
  },
  sec: {
    0: "1",
    30: "2/√3",
    45: "√2",
    60: "2",
    90: "Not defined"
  },
  cot: {
    0: "Not defined",
    30: "√3",
    45: "1",
    60: "1/√3",
    90: "0"
  }
};

export const ALL_QUESTIONS: TrigRatio[] = FUNCTIONS.flatMap(func => 
  ANGLES.map(angle => ({
    func,
    angle,
    value: TRIG_TABLE[func][angle],
    displayValue: TRIG_TABLE[func][angle]
  }))
);

export const UNIQUE_VALUES = Array.from(new Set(ALL_QUESTIONS.map(q => q.value))).sort((a, b) => {
    if (a === "Not defined") return 1;
    if (b === "Not defined") return -1;
    return a.localeCompare(b);
});
