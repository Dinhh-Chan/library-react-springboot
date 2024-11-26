// services/openaiService.js
import axios from 'axios';

const API_KEY = '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'
const API_URL = 'https://api.openai.com/v1/completions';

export const fetchChatGPTResponse = async (message) => {
    try {
        const response = await axios.post(
            API_URL,
            {
                model: 'gpt-3.5-turbo',  // Cập nhật phiên bản của mô hình
                messages: [{ role: 'user', content: message }],
                max_tokens: 150,
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error fetching ChatGPT response:', error);
        throw error;
    }
};
