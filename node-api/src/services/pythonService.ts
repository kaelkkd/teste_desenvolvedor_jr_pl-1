import axios from "axios";

//Requisicoes para a api externa do python
export const getSummaryPython = {
  async getSummary(text: string, language: string): Promise<string> {
    const response = await axios.post("http://localhost:5000/summarize", {
      text,
      language,
    });

    return response.data.summary;
  },
};
