import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
const PORT = process.env.PORT || 3001;

dotenv.config();
constapp=express();

app.use(cors());
app.use(express.json());

app.post("/chat",async (req,res) => {
constuserMessage=req.body.message;

try {
constresponse=awaitaxios.post(
"https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct",
      {
        inputs:`
<|begin_of_text|>
<|start_header_id|>system<|end_header_id|>
You are a helpful Indonesian-speaking assistant.
<|eot_id|>
<|start_header_id|>user<|end_header_id|>
${userMessage}
<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>
        `
      },
      {
        headers: {
          Authorization:`Bearer${process.env.HF_API_KEY}`
        }
      }
    );

constreply=response.data[0].generated_text;
res.json({ reply });

  }catch (error) {
console.error(error);
res.status(500).json({ error:"Error generating response" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});