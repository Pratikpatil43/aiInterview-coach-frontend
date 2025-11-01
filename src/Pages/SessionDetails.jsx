import AiQuestions from "@/utils/AiQuestions";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import "bootstrap/dist/css/bootstrap.min.css";

const SessionDetails = () => {
  const param = useParams();
  const queryClient = useQueryClient();

  // Fetch session details
  const getSessionDetail = async () => {
    const res = await axios.get(
      `https://ai-interview-coach-backend-581l.onrender.com/api/v1/session/getMySessionById/${param.id}`,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return res.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["sessionDetail", param.id],
    queryFn: getSessionDetail,
  });

  // Generate AI Questions mutation
  const GenerateAiQuestionApi = async (payload) => {
    const res = await axios.post(
      "https://ai-interview-coach-backend-581l.onrender.com/api/v1/question/addQuestion",
      payload,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return res.data;
  };

  const mutation = useMutation({
    mutationFn: GenerateAiQuestionApi,
    onSuccess: () => {
      toast.success("AI Questions Generated ✅");
      // refetch questions specifically
      queryClient.invalidateQueries({ queryKey: ["questions", param.id] });
    },
    onError: (error) => {
      console.error("Error generating questions:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleGenerateQuestions = () => {
    const payload = {
      role: data?.session?.role,
      experience: data?.session?.experience,
      topicsToFocus: data?.session?.topicsToFocus,
      sessionId: param?.id,
    };
    mutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h4 className="text-light">Loading Session...</h4>
      </div>
    );
  }

  const session = data?.session;

  return (
    <div className="container py-5 text-light">
      {/* Session Info Card */}
      <div className="card bg-dark text-light border-0 shadow-lg rounded-4 mb-5 p-4">
        <h3 className="fw-bold text-primary mb-3">Session Details</h3>
        <div className="row gy-3">
          <div className="col-md-4">
            <h6 className="text-info">Role</h6>
            <p className="fw-semibold">{session?.role}</p>
          </div>
          <div className="col-md-4">
            <h6 className="text-info">Topics to Focus</h6>
            <p className="fw-semibold">{session?.topicsToFocus}</p>
          </div>
          <div className="col-md-4">
            <h6 className="text-info">Experience</h6>
            <p className="fw-semibold">{session?.experience} years</p>
          </div>
        </div>
      </div>

      {/* AI Questions Section */}
      <div className="mb-5">
        <AiQuestions sessionId={param.id} />
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <Button
          onClick={handleGenerateQuestions}
          disabled={mutation.isPending}
          className="btn btn-primary fw-semibold px-5 py-2 rounded-pill shadow"
        >
          {mutation.isPending ? "Generating..." : "Generate AI Questions"}
        </Button>
      </div>
    </div>
  );
};

export default SessionDetails;
