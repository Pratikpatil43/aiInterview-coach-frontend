import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LuPinOff } from "react-icons/lu";
import { MdOutlinePushPin } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { toast } from "sonner";

const AiQuestions = ({ sessionId }) => {
  const queryClient = useQueryClient();

  // Fetch Questions
  const getQuestions = async () => {
    const res = await axios.get(
      `https://ai-interview-coach-backend-581l.onrender.com/api/v1/question/getQuestions/${sessionId}`,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return res.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["questions", sessionId],
    queryFn: getQuestions,
  });

  // Toggle pin mutation
  const togglePinApi = async (id) => {
    const res = await axios.post(
      `https://ai-interview-coach-backend-581l.onrender.com/api/v1/question/toggleQuestion/${id}`,
      {},
      { withCredentials: true }
    );
    return res.data;
  };

  const mutation = useMutation({
    mutationFn: togglePinApi,
    onSuccess: () => {
      toast.success("Question pin status changed");
      queryClient.invalidateQueries({ queryKey: ["questions", sessionId] });
    },
  });

  const togglePin = (id) => {
    mutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="text-center text-light py-5">
        <h5>Loading AI Questions...</h5>
      </div>
    );
  }

  const questions = data?.questions || [];

  return (
    <LayoutGroup>
      <div className="d-flex flex-column align-items-center gap-4 w-100">
        {questions.length === 0 ? (
          <p className="text-light text-center opacity-75">
            No AI questions yet. Click “Generate AI Questions” above.
          </p>
        ) : (
          <AnimatePresence>
            {questions.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="w-100"
              >
                <Accordion type="single" collapsible>
                  <AccordionItem value={item._id}>
                    <AccordionTrigger
                      className="bg-gradient-to-r from-[#1f2a4d] to-[#2a3e78] text-light p-3 rounded-3xl d-flex align-items-center shadow-sm"
                      style={{ cursor: "pointer" }}
                    >
                      <span className="flex-grow-1 fw-medium">
                        {item.question}
                      </span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(item._id);
                        }}
                      >
                        {item.isPinned ? (
                          <MdOutlinePushPin className="text-info fs-5" />
                        ) : (
                          <LuPinOff className="text-secondary fs-5" />
                        )}
                      </span>
                    </AccordionTrigger>

                    {/* ✅ Clear readable answer box */}
                    <AccordionContent
                      className="bg-white text-dark rounded-3xl mt-2 p-4 border"
                      style={{
                        fontSize: "1rem",
                        lineHeight: "1.6",
                        fontWeight: 500,
                      }}
                    >
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </LayoutGroup>
  );
};

export default AiQuestions;
