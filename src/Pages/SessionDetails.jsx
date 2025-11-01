import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Pin } from "lucide-react";

const AiQuestions = ({ sessionId }) => {
  const [openIndex, setOpenIndex] = useState(null);

  // Fetch all questions for the session
  const getQuestions = async () => {
    const res = await axios.get(
      `https://ai-interview-coach-backend-581l.onrender.com/api/v1/question/getQuestions/${sessionId}`,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return res.data.questions;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["questions", sessionId],
    queryFn: getQuestions,
  });

  if (isLoading) {
    return <p className="text-center text-muted">Loading questions...</p>;
  }

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {data?.length > 0 ? (
        data.map((q, index) => (
          <div
            key={q._id}
            className="rounded-3 overflow-hidden shadow-lg border border-gray-700"
          >
            {/* Question Header */}
            <div
              onClick={() => toggleAnswer(index)}
              className="cursor-pointer bg-[#1E2A78] hover:bg-[#24328A] p-3 d-flex justify-content-between align-items-center"
            >
              <h5 className="m-0 text-light fw-semibold">{q.question}</h5>
              {openIndex === index ? (
                <ChevronUp className="text-light" />
              ) : (
                <ChevronDown className="text-light" />
              )}
            </div>

            {/* Answer Section */}
            {openIndex === index && (
              <div className="bg-[#E2E8F0] text-dark p-3">
                <p className="mb-0">{q.answer}</p>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-muted">No questions yet. Generate some!</p>
      )}
    </div>
  );
};

export default AiQuestions;
