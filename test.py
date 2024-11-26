import requests
import json

# API key của bạn từ OpenAI
api_key = "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"

# URL của API ChatGPT
url = "https://api.openai.com/v1/chat/completions"

# Dữ liệu gửi tới API
def get_chatgpt_response(user_question):
    data = {
        "model": "gpt-3.5-turbo",  # Hoặc bạn có thể sử dụng gpt-4
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": user_question}
        ],
        "max_tokens": 100,  # Số lượng token tối đa bạn muốn nhận từ API
        "temperature": 0.7  # Điều chỉnh độ sáng tạo của mô hình (0.0 đến 1.0)
    }

    # Header với API Key
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    # Gửi yêu cầu POST đến OpenAI API
    response = requests.post(url, headers=headers, data=json.dumps(data))

    # Kiểm tra nếu có lỗi xảy ra
    if response.status_code == 200:
        response_data = response.json()
        # Trích xuất câu trả lời từ ChatGPT
        chat_gpt_reply = response_data['choices'][0]['message']['content']
        return chat_gpt_reply
    else:
        return f"Error: {response.status_code}\n{response.text}"

def main():
    print("Chào mừng bạn đến với ChatGPT!")
    while True:
        # Nhận câu hỏi từ người dùng
        user_question = input("Bạn: ")

        # Nếu người dùng gõ "exit", thoát khỏi vòng lặp
        if user_question.lower() == "exit":
            print("Cảm ơn bạn đã sử dụng ChatGPT. Tạm biệt!")
            break

        # Gọi API ChatGPT để lấy câu trả lời
        response = get_chatgpt_response(user_question)

        # In ra câu trả lời của ChatGPT
        print("ChatGPT:", response)

if __name__ == "__main__":
    main()
