// List of toxic and harmful words for content analysis
export const toxicWords = [
  { word: 'hate', severity: 0.7 },
  { word: 'kill', severity: 0.9 },
  { word: 'stupid', severity: 0.5 },
  { word: 'idiot', severity: 0.5 },
  { word: 'dumb', severity: 0.4 },
  { word: 'worthless', severity: 0.6 },
  { word: 'loser', severity: 0.5 },
  { word: 'die', severity: 0.8 },
  { word: 'terrible', severity: 0.3 },
  { word: 'awful', severity: 0.3 },
  { word: 'horrible', severity: 0.4 },
  { word: 'useless', severity: 0.5 },
  { word: 'pathetic', severity: 0.6 },
  { word: 'failure', severity: 0.5 },
  { word: 'garbage', severity: 0.4 },
];

export interface AnalysisResult {
  safetyScore: number;
  issues: string[];
  processingTime: number;
}

export function analyzeContent(text: string): AnalysisResult {
  const startTime = performance.now();
  const words = text.toLowerCase().split(/\s+/);
  
  if (words.length === 0 || (words.length === 1 && words[0] === '')) {
    return {
      safetyScore: 100,
      issues: [],
      processingTime: 0
    };
  }

  let totalSeverity = 0;
  const foundIssues: string[] = [];
  
  words.forEach(word => {
    const toxicWord = toxicWords.find(tw => tw.word === word);
    if (toxicWord) {
      totalSeverity += toxicWord.severity;
      foundIssues.push(`Found toxic word "${word}" (severity: ${toxicWord.severity * 100}%)`);
    }
  });

  // Calculate safety score based on cumulative severity and word count
  const averageSeverity = totalSeverity / words.length;
  const safetyScore = Math.max(1, Math.min(100, Math.round((1 - averageSeverity) * 100)));
  
  const processingTime = (performance.now() - startTime) / 1000;

  return {
    safetyScore,
    issues: foundIssues,
    processingTime
  };
}

export async function analyzeImage(file: File): Promise<AnalysisResult> {
  const startTime = performance.now();
  
  // Simulate image analysis with random safety score and processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const randomSafetyScore = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
  const issues = [];
  
  if (randomSafetyScore < 80) {
    issues.push("Potential inappropriate content detected");
  }
  if (randomSafetyScore < 70) {
    issues.push("Image may contain sensitive material");
  }
  
  const processingTime = (performance.now() - startTime) / 1000;
  
  return {
    safetyScore: randomSafetyScore,
    issues,
    processingTime
  };
}