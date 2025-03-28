import { GoogleGenerativeAI } from "@google/generative-ai";
import { AttentionAnalysisResult } from "../../appUi/components/ai/Ai";

const API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY;
export const genAI = new GoogleGenerativeAI(API_KEY);

interface Question {
  id: string;
  text: string;
  codeSnippet: string | null;
  expectedAnswer: string;
}

interface Assessment {
  id: string;
  level: string;
  timeLimit: number;
  questions: Question[];
  title: string;
}

interface UserAnswer {
  questionId: string;
  answer: string;
}

interface Resource {
  title: string;
  url: string;
}

interface EvaluationResult {
  score: number;
  passed: boolean;
  assignedLevel: string;
  cheatingDetected?: boolean;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  resources: Resource[];
  timestamp?: string;
  title: string;
}

export const generateAssessment = async (
  category: string,
  title: string
): Promise<Assessment> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Create a programming assessment ${title} for a ${category} level programmer.
     
    The assessment should include:
    1. 5 programming questions appropriate ${title} for ${category} level
    2. Each question should have a unique id
    3. Some questions should include code snippets to analyze
    4. The assessment should be challenging but fair
    
    Format the response as a JSON object with this structure:
    {
      "id": "unique-assessment-id",
      "level": "${category}",
      "title": "${title},
      "timeLimit": 30, // time in minutes
      "questions": [
        {
          "id": "q1",
          "text": "Question text here",
          "codeSnippet": "// Code snippet if applicable, otherwise null",
          "expectedAnswer": "The expected answer or key points to look for"
        }
      ]
    }`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const jsonMatch =
      text.match(/```json\n([\s\S]*?)\n```/) ||
      text.match(/```\n([\s\S]*?)\n```/) ||
      text.match(/{[\s\S]*}/);

    let assessmentData: Assessment;
    if (jsonMatch) {
      try {
        assessmentData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        throw new Error("Failed to parse assessment data");
      }
    } else {
      throw new Error("Failed to generate assessment");
    }

    return assessmentData;
  } catch (error) {
    console.error("Error generating assessment:", error);
    throw error;
  }
};

export const evaluateAssessment = async (
  category: string,
  title: string,
  assessmentId: string,
  answers: UserAnswer[],
  cheatingDetected: boolean
): Promise<EvaluationResult> => {
  try {
    if (cheatingDetected) {
      return {
        score: 0,
        title,
        passed: false,
        assignedLevel: "Failed",
        cheatingDetected: true,
        feedback: "Assessment invalidated due to detected cheating behavior.",
        strengths: [],
        weaknesses: ["Academic integrity violation"],
        resources: [
          {
            title: "Academic Integrity Guidelines",
            url: "https://example.com/academic-integrity",
          },
        ],
      };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `You are evaluating a programming assessment ${title} for a ${category} level programmer.
    
    Assessment ID: ${assessmentId}
    
    Here are the user's answers:
    ${JSON.stringify(answers, null, 2)}
    
    Please evaluate the answers and return a JSON response with:
    1. A score percentage (0-100)
    2. Whether they passed based on these criteria:
       - Pro level requires 90% score
       - Intermediate level requires 80% or higher
       - Below 80% is a fail which totally beginner
    3. Their assigned level based on their performance, ${title} and the chosen category (${category})
    4. Brief overall feedback
    5. Strengths (list of 3-5 points)
    6. Weaknesses (list of 3-5 points)
    7. Learning resources (list of 3-5 relevant resources with titles and URLs)
    8. If score did not reach to the score we described in order to pass status of passed should be false
    Format the response as a JSON object with this structure:
    {
      "score": 85,
      "passed": true,
      "title": "software developer"
      "assignedLevel": "Intermediate", 
      "feedback": "Good understanding of core concepts but needs improvement in...",
      "strengths": ["Strength 1", "Strength 2", ...],
      "weaknesses": ["Weakness 1", "Weakness 2", ...],
      "resources": [
        {
          "title": "Resource title",
          "url": "https://example.com/resource"
        }
      ]
    }`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const jsonMatch =
      text.match(/```json\n([\s\S]*?)\n```/) ||
      text.match(/```\n([\s\S]*?)\n```/) ||
      text.match(/{[\s\S]*}/);

    let evaluationData: EvaluationResult;
    if (jsonMatch) {
      try {
        evaluationData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        throw new Error("Failed to evaluate assessment");
      }
    } else {
      throw new Error("Failed to evaluate assessment");
    }

    if (category === "pro") {
      if (evaluationData.score >= 90) {
        evaluationData.assignedLevel = "Pro";
        evaluationData.passed = true;
      } else if (evaluationData.score >= 80) {
        evaluationData.assignedLevel = "Intermediate";
        evaluationData.passed = false;
      } else {
        evaluationData.assignedLevel = "Beginner";
        evaluationData.passed = false;
      }
    } else if (category === "intermediate") {
      if (evaluationData.score >= 80) {
        evaluationData.assignedLevel = "Intermediate";
        evaluationData.passed = true;
      } else {
        evaluationData.assignedLevel = "Beginner";
        evaluationData.passed = false;
      }
    } else {
      evaluationData.assignedLevel = "Beginner";
      evaluationData.passed = true;
    }
    evaluationData.title = title;

    return evaluationData;
  } catch (error) {
    console.error("Error evaluating assessment:", error);
    throw error as Error;
  }
};

export const analyzeAttention = async (
  imageBlob: Blob
): Promise<AttentionAnalysisResult> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.4,
      },
    });

    const reader = new FileReader();
    const base64Image = await new Promise<string>((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(imageBlob);
    });

    const prompt = `Analyze this image for signs of user attentiveness. 
    Look for:
    - Eye contact with screen
    - Head position and orientation
    - Facial engagement indicators
    - Presence of distractions

    Provide a confidence score from 0-100 indicating how attentive the person appears to be.
    Return JSON with:
    {
      "isAttentive": boolean,
      "confidenceScore": number,
      "reasons": string[]
    }`;

    // Send image and prompt to Gemini
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: imageBlob.type,
                data: base64Image.split(",")[1],
              },
            },
          ],
        },
      ],
    });

    const response = result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch =
      text.match(/\n([\s\S]*?)\n/) ||
      text.match(/\n([\s\S]*?)\n/) ||
      text.match(/{[\s\S]*}/);

    let analysisResult: AttentionAnalysisResult;
    if (jsonMatch) {
      try {
        analysisResult = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        return {
          isAttentive: true,
          confidenceScore: 80,
          reasons: ["Unable to fully analyze image"],
        };
      }
    } else {
      return {
        isAttentive: true,
        confidenceScore: 80,
        reasons: ["Unable to fully analyze image"],
      };
    }

    return analysisResult;
  } catch (error) {
    console.error("Gemini AI attention analysis error:", error);
    return {
      isAttentive: true,
      confidenceScore: 100,
      reasons: [],
    };
  }
};
