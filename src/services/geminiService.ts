
import { GoogleGenAI } from "@google/genai";
import { type QuizQuestion, Difficulty } from '../types';

const ai = new GoogleGenAI({ apiKey: "xcv" });

export const generateQuizQuestions = async (topic: string, difficulty: Difficulty): Promise<QuizQuestion[]> => {
  const prompt = `
    Tạo một bộ câu đố gồm chính xác 5 câu hỏi trắc nghiệm về chủ đề '${topic}' với độ khó là '${difficulty}'.
    Mỗi câu hỏi phải có chính xác 4 lựa chọn trả lời.
    Phải có một và chỉ một câu trả lời đúng.
    Trả về kết quả dưới dạng một mảng JSON hợp lệ.
    Mỗi đối tượng trong mảng phải có các khóa sau: "question" (string), "options" (một mảng gồm 4 chuỗi) và "correctAnswer" (chuỗi chứa câu trả lời đúng chính xác như trong mảng options).

    Ví dụ về định dạng đầu ra:
    [
      {
        "question": "Thủ đô của Việt Nam là gì?",
        "options": ["Hà Nội", "Đà Nẵng", "TP. Hồ Chí Minh", "Hải Phòng"],
        "correctAnswer": "Hà Nội"
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        }
    });

    if (!response.text) {
      throw new Error("Phản hồi từ AI không chứa dữ liệu văn bản.");
    }
    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    const parsedData = JSON.parse(jsonStr);

    if (!Array.isArray(parsedData) || parsedData.some(q => !q.question || !q.options || !q.correctAnswer)) {
        throw new Error("Dữ liệu trả về từ AI không đúng định dạng.");
    }
    
    // Đảm bảo chỉ có 5 câu hỏi
    return parsedData.slice(0, 5);

  } catch (error) {
    console.error("Lỗi khi gọi API Gemini:", error);
    if (error instanceof Error && error.message.includes('SAFETY')) {
        throw new Error("Chủ đề này vi phạm chính sách an toàn. Vui lòng chọn một chủ đề khác.");
    }
    throw new Error("Không thể tạo câu hỏi từ AI. Vui lòng thử lại.");
  }
};
