import React, { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, Monitor, AlertTriangle, Badge } from "lucide-react";

import {
  evaluateAssessment,
  generateAssessment,
  analyzeAttention,
  generateTechnologies,
} from "../../../api/ai/generate";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../components/ui/card";

import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Button } from "../../../components/ui/button";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../components/ui/alert";

import { Textarea } from "../../../components/ui/textarea";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";

import { Label } from "../../../components/ui/label";
import { Progress } from "../../../components/ui/progress";
import { EvaluationResult } from "../../../types/types";
import { SOFTWARE_TITLES } from "../../../constants/softwareTitles";

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
}

interface UserAnswer {
  questionId: string;
  answer: string;
}

type AssessmentStep =
  | "title"
  | "category"
  | "technologies"
  | "instructions"
  | "assessment"
  | "results";
export interface AttentionAnalysisResult {
  isAttentive: boolean;
  confidenceScore: number;
  reasons?: string[];
}

interface AssessmentProps {
  setProfile: React.Dispatch<React.SetStateAction<boolean>>;
  setEvaluationResult: React.Dispatch<
    React.SetStateAction<EvaluationResult | null>
  >;
}
export interface Technology {
  value: string;
  label: string;
}

const storeAssessmentResults = (results: EvaluationResult) => {
  localStorage.setItem("assessmentResults", JSON.stringify(results));
};

export const ProgrammingAssessment: React.FC<AssessmentProps> = ({
  setProfile,
  setEvaluationResult,
}) => {
  const [step, setStep] = useState<AssessmentStep>("title");
  const [category, setCategory] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(
    []
  );
  const [loadingTechnologies, setLoadingTechnologies] =
    useState<boolean>(false);
  const [assessmentData, setAssessmentData] = useState<Assessment | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [screenShareActive, setScreenShareActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [results, setResults] = useState<EvaluationResult | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [cheatingDetected, setCheatingDetected] = useState<boolean>(false);
  const [windowFocusLossCount, setWindowFocusLossCount] = useState<number>(0);

  const [aiAttentionLossCount, setAiAttentionLossCount] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const detectionIntervalRef = useRef<number | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const captureFrame = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImages((prev) => {
        const updatedImages = [...prev, imageSrc].slice(-4);
        return updatedImages;
      });
    }
  }, [webcamRef]);
  useEffect(() => {
    if (title && step === "technologies") {
      loadTechnologies();
    }
  }, [title, step]);

  const loadTechnologies = async () => {
    if (!title) return;

    setLoadingTechnologies(true);
    setError("");

    try {
      const techData = await generateTechnologies(title);
      setTechnologies(techData);
    } catch (err) {
      setError("Failed to load technologies. Please try again.");
      console.error("Error loading technologies:", err);
    } finally {
      setLoadingTechnologies(false);
    }
  };

  const handleTechnologyChange = (tech: string) => {
    setSelectedTechnologies((prev) => {
      if (prev.includes(tech)) {
        return prev.filter((t) => t !== tech);
      } else {
        return [...prev, tech];
      }
    });
  };

  const initCamera = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      setError("Camera access denied. Cannot proceed with assessment.");
      console.error("Error accessing camera:", err);
    }
  };

  // Initialize screen sharing
  const initScreenShare = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      screenStreamRef.current = stream;
      setScreenShareActive(true);

      // Listen for when user stops sharing
      stream.getVideoTracks()[0].onended = () => {
        setScreenShareActive(false);
        handleCheatingDetected("Screen sharing stopped during assessment");
      };
    } catch (err) {
      setError("Screen sharing access denied. Cannot proceed with assessment.");
      console.error("Error sharing screen:", err);
    }
  };

  // Handle cheating detection
  const handleCheatingDetected = (reason: string): void => {
    setCheatingDetected(true);
    setError(`Cheating detected: ${reason}`);
  };

  // Generate assessment using Gemini API
  const generateAssessmentData = async (): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      // Include selected technologies in the assessment generation
      const data = await generateAssessment(
        category,
        title,
        selectedTechnologies
      );
      setAssessmentData(data);
      setTimeLeft(data.timeLimit * 60);
      setStep("instructions");
    } catch (err) {
      setError("Failed to generate assessment. Please try again.");
      console.error("Error generating assessment:", err);
    } finally {
      setLoading(false);
    }
  };

  // Start the assessment
  const startAssessment = async (): Promise<void> => {
    try {
      await Promise.all([initCamera(), initScreenShare()]);
      setStep("assessment");
      const timer = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timer) {
              clearInterval(timer);
            }
            submitAssessment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const frameCaptureInterval = window.setInterval(() => {
        captureFrame();
      }, 10000);

      timerIntervalRef.current = timer;
      detectionIntervalRef.current = frameCaptureInterval;

      timerIntervalRef.current = timer;
    } catch (err) {
      setError(
        "Failed to initialize monitoring. Cannot proceed with assessment."
      );
    }
  };

  // Clean up timers and media streams
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (
        videoRef.current &&
        videoRef.current.srcObject instanceof MediaStream
      ) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const submitAssessment = async (
    forcedSubmission: boolean = false
  ): Promise<void> => {
    setLoading(true);

    try {
      // Stop recording
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (
        videoRef.current &&
        videoRef.current.srcObject instanceof MediaStream
      ) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach((track) => track.stop());
      }

      if (!assessmentData) {
        throw new Error("Assessment data is missing");
      }

      // Analyze captured images for attention
      let aiAttentionLossDetected = false;
      let attentionAnalysisResults: AttentionAnalysisResult[] = [];

      for (const imageSrc of capturedImages) {
        try {
          // Convert base64 image to blob
          const blob = await (await fetch(imageSrc)).blob();

          const analysisResult = await analyzeAttention(blob);
          attentionAnalysisResults.push(analysisResult);

          if (!analysisResult.isAttentive) {
            aiAttentionLossDetected = true;
            setAiAttentionLossCount((prev) => prev + 1);
            break;
          }
        } catch (error) {
          console.error("Individual image analysis failed", error);
        }
      }

      const answers: UserAnswer[] = Object.entries(userAnswers).map(
        ([questionId, answer]) => ({
          questionId,
          answer,
        })
      );

      const isCheatingDetected =
        cheatingDetected ||
        aiAttentionLossCount >= 3 ||
        windowFocusLossCount >= 2;

      const results = await evaluateAssessment(
        category,
        title,
        assessmentData.id,
        answers,
        isCheatingDetected,
        selectedTechnologies
      );

      setEvaluationResult(results);

      if (isCheatingDetected) {
        setError("Assessment invalidated due to suspected cheating.");
        results.cheatingDetected = true;
      }

      setResults(results);
      setStep("results");
    } catch (err) {
      setError("Failed to evaluate assessment. Please try again.");
      console.error("Error evaluating assessment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string): void => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answer,
    });
  };

  const formatTimeLeft = (): string => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const renderTitleStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Select Your Software Position</CardTitle>
        <CardDescription>
          Choose the software title that best describes your career focus
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={title}
          onValueChange={setTitle}
          className="space-y-4 max-h-96 overflow-y-auto"
        >
          {SOFTWARE_TITLES.map((titleOption) => (
            <div
              key={titleOption.value}
              className="flex items-center space-x-2"
            >
              <RadioGroupItem
                value={titleOption.value}
                id={titleOption.value}
              />
              <Label htmlFor={titleOption.value} className="cursor-pointer">
                {titleOption.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={() => setStep("technologies")} disabled={!title}>
          Continue
        </Button>
      </CardFooter>
    </Card>
  );

  const renderTechnologiesStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Select Your Technologies</CardTitle>
        <CardDescription>
          Choose the technologies you're comfortable with as a {title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loadingTechnologies ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {technologies.map((tech) => (
              <div key={tech.value} className="flex items-center space-x-2">
                {/* Custom checkbox implementation */}
                <div
                  className={`w-5 h-5 border rounded cursor-pointer flex items-center justify-center ${
                    selectedTechnologies.includes(tech.value)
                      ? "bg-primary border-primary"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleTechnologyChange(tech.value)}
                >
                  {selectedTechnologies.includes(tech.value) && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <label
                  htmlFor={tech.value}
                  className="cursor-pointer"
                  onClick={() => handleTechnologyChange(tech.value)}
                >
                  {tech.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setStep("title")}>
          Back
        </Button>
        <Button
          onClick={() => setStep("category")}
          disabled={loadingTechnologies || selectedTechnologies.length === 0}
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
  const renderCategoryStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Programming Assessment</CardTitle>
        <CardDescription>
          Select your programming skill level to begin the assessment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={category}
          onValueChange={setCategory}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="beginner" id="beginner" />
            <Label htmlFor="beginner" className="cursor-pointer">
              Beginner
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="intermediate" id="intermediate" />
            <Label htmlFor="intermediate" className="cursor-pointer">
              Intermediate
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pro" id="pro" />
            <Label htmlFor="pro" className="cursor-pointer">
              Pro
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={generateAssessmentData}
          disabled={!category || loading}
        >
          {loading ? "Questions loading..." : "Continue"}
        </Button>
      </CardFooter>
    </Card>
  );

  const renderInstructionsStep = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Assessment Instructions</CardTitle>
        <CardDescription>
          {title && SOFTWARE_TITLES.find((t) => t.value === title)?.label} -
          {category.charAt(0).toUpperCase() + category.slice(1)} level
          programming assessment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Before You Begin:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              This assessment contains {assessmentData?.questions.length}{" "}
              questions
            </li>
            <li>
              You will have {assessmentData?.timeLimit} minutes to complete it
            </li>
            <li>
              We'll need access to your camera and screen to ensure assessment
              integrity
            </li>
            <li>
              Closing the browser tab, switching applications, or leaving the
              view of the camera will be flagged as potential cheating
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Grading Criteria:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Pro level requires 100% score</li>
            <li>Intermediate level requires 80% or higher</li>
            <li>Below 80% will require further practice</li>
          </ul>
        </div>

        <div className="flex items-center space-x-2 bg-yellow-50 p-3 rounded">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <p className="text-sm text-yellow-800">
            Please ensure you're in a quiet environment with good lighting and a
            stable internet connection.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setStep("category")}>
          Back
        </Button>
        <Button onClick={startAssessment}>Start Assessment</Button>
      </CardFooter>
    </Card>
  );

  const renderAssessmentStep = () => (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex justify-between items-center"></div>
        <div className="flex space-x-2">
          <Badge
            className={`${
              cameraActive ? "success" : "destructive"
            } flex items-center space-x-1`}
          >
            <Camera className="h-3 w-3" />
            <span>{cameraActive ? "Camera Active" : "Camera Inactive"}</span>
          </Badge>
          <Badge
            className={` ${
              screenShareActive ? "success" : "destructive"
            } flex items-center space-x-1`}
          >
            <Monitor className="h-3 w-3" />
            <span>
              {screenShareActive
                ? "Screen Sharing Active"
                : "Screen Sharing Inactive"}
            </span>
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-mono font-bold">{formatTimeLeft()}</span>
          <Badge>{category.toUpperCase()}</Badge>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-1">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-sm">AI Monitoring</CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-2">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  width: 640,
                  height: 480,
                  facingMode: "user",
                }}
                className="w-full h-64 rounded object-cover"
              />
              {/* Optional: Display captured image for debugging */}
              {imgSrc && (
                <img
                  src={imgSrc}
                  alt="Captured"
                  className="w-full h-32 object-cover rounded mt-2"
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Programming Assessment</CardTitle>
              <CardDescription>
                Answer all questions to the best of your ability.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {assessmentData?.questions.map((question, index) => (
                <div key={question.id} className="space-y-3">
                  <h3 className="font-medium">
                    Question {index + 1}: {question.text}
                  </h3>
                  {question.codeSnippet && (
                    <pre className="p-4 bg-slate-900 text-slate-50 overflow-x-auto rounded text-sm">
                      <code>{question.codeSnippet}</code>
                    </pre>
                  )}
                  <Textarea
                    placeholder="Enter your answer here..."
                    value={userAnswers[question.id] || ""}
                    onChange={(e: any) =>
                      handleAnswerChange(question.id, e.target.value)
                    }
                    rows={6}
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={submitAssessment} disabled={loading}>
                {loading ? "evaluating..." : "Submit Assessment"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );

  // Results step
  const renderResultsStep = () => {
    console.log("results===", results);
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Assessment Results</CardTitle>
          <CardDescription>
            {title && SOFTWARE_TITLES.find((t) => t.value === title)?.label} -
            {category.charAt(0).toUpperCase() + category.slice(1)} level
            assessment completed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {results?.cheatingDetected ? (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Assessment Invalidated</AlertTitle>
              <AlertDescription>
                Cheating was detected during your assessment. Please retake the
                assessment under proper conditions.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Your Score:</span>
                  <span className="font-bold text-lg">{results?.score}%</span>
                </div>
                <Progress
                  value={results?.score}
                  className="h-3 rounded-full"
                  style={{
                    background: "linear-gradient(to right, #f3f4f6, #e5e7eb)",
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
                  }}
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {!results?.passed && results?.assignedLevel !== "Failed" && (
                <Alert className="mb-4 bg-blue-50 border-blue-200 text-blue-800">
                  <AlertTitle className="text-blue-800">
                    Assessment Result
                  </AlertTitle>
                  <AlertDescription>
                    You've demonstrated skills at the {results?.assignedLevel}{" "}
                    level, but your current score of {results?.score}% doesn't
                    meet the requirements for your selected {category} level
                    assessment.
                    {category === "pro"
                      ? " Pro level requires a score of 90% or higher."
                      : category === "intermediate"
                      ? " Intermediate level requires a score of 80% or higher."
                      : ""}
                  </AlertDescription>
                </Alert>
              )}

              {!results?.passed && results?.assignedLevel === "Beginner" && (
                <Alert className="mb-4 bg-blue-50 border-blue-200 text-blue-800">
                  <AlertTitle className="text-blue-800">
                    Assessment Result
                  </AlertTitle>
                  <AlertDescription>
                    You've been classified as a Beginner. You can either
                    continue with your profile or retake the assessment to
                    achieve a higher skill level.
                  </AlertDescription>
                </Alert>
              )}

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold">Final Assessment:</h3>
                  <Badge
                    className={`${
                      results?.passed
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    } ml-2 px-3 py-1`}
                  >
                    {results?.assignedLevel}
                  </Badge>
                  {!results?.passed && results?.assignedLevel !== "Failed" && (
                    <span className="text-sm text-slate-500">
                      (Not sufficient for {category} level)
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600">{results?.feedback}</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Selected Technologies:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTechnologies.map((tech) => (
                    <Badge key={tech} className="px-3 py-1">
                      {technologies.find((t) => t.value === tech)?.label ||
                        tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Detailed Feedback:</h3>
                <Tabs defaultValue="strengths">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="strengths">Strengths</TabsTrigger>
                    <TabsTrigger value="weaknesses">
                      Areas to Improve
                    </TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                  </TabsList>
                  <TabsContent value="strengths" className="space-y-2 pt-2">
                    <ul className="list-disc pl-5 space-y-1">
                      {results?.strengths.map((item, i) => (
                        <li key={i} className="text-sm">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                  <TabsContent value="weaknesses" className="space-y-2 pt-2">
                    <ul className="list-disc pl-5 space-y-1">
                      {results?.weaknesses.map((item, i) => (
                        <li key={i} className="text-sm">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                  <TabsContent value="resources" className="space-y-2 pt-2">
                    <ul className="list-disc pl-5 space-y-1">
                      {results?.resources.map((item, i) => (
                        <li key={i} className="text-sm">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {item.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setStep("title");
              setCategory("");
              setAssessmentData(null);
              setUserAnswers({});
              setCameraActive(false);
              setScreenShareActive(false);
              setResults(null);
              setCheatingDetected(false);
              setError("");
              setSelectedTechnologies([]);
            }}
          >
            Start New Assessment
          </Button>

          {results?.passed ? (
            <Button variant="default" onClick={() => setProfile(true)}>
              Continue to Profile
            </Button>
          ) : results?.assignedLevel === "Beginner" ? (
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setStep("category");
                  setUserAnswers({});
                }}
              >
                Retake Assessment
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  storeAssessmentResults(results);
                  setProfile(true);
                }}
              >
                Continue as Beginner
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              onClick={() => {
                setStep("category");
                setUserAnswers({});
              }}
            >
              Retake Assessment
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  const renderStep = () => {
    switch (step) {
      case "title":
        return renderTitleStep();
      case "technologies":
        return renderTechnologiesStep();
      case "category":
        return renderCategoryStep();
      case "instructions":
        return renderInstructionsStep();
      case "assessment":
        return renderAssessmentStep();
      case "results":
        return renderResultsStep();
      default:
        return renderCategoryStep();
    }
  };

  return (
    <div className="container py-10 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">
          Programming Skill Assessment
        </h1>
        <p className="text-slate-500">
          Powered by AI, verify your programming skills with our adaptive
          assessment
        </p>
      </div>

      {renderStep()}
    </div>
  );
};
