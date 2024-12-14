from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import getpass
import os
import pandas as pd
from langchain_community.utilities import SQLDatabase
from sqlalchemy import create_engine
from typing_extensions import TypedDict
from langchain_openai import ChatOpenAI
from langchain_community.agent_toolkits import SQLDatabaseToolkit
from langchain import hub
from langchain_core.messages import HumanMessage
from langgraph.prebuilt import create_react_agent
# Initialize FastAPI app
app = FastAPI()

os.environ["OPENAI_API_KEY"] = 'xx'

df = pd.read_csv("./data_modified.csv")
print(df.shape)
print(df.columns.tolist())

engine = create_engine("sqlite:///library.db")
df.to_sql("library", engine, index=False,  if_exists="replace")


class State(TypedDict):
    question: str
    query: str
    result: str
    answer: str

llm = ChatOpenAI(model="gpt-4o-mini")
db = SQLDatabase.from_uri("sqlite:///library.db")  
toolkit = SQLDatabaseToolkit(db=db,llm=llm)
tools = toolkit.get_tools()
tools

prompt_template = hub.pull("langchain-ai/sql-agent-system-prompt")
assert len(prompt_template.messages) == 1
prompt_template.messages[0].pretty_print()
system_message = prompt_template.format(dialect="SQLite", top_k=1)
agent_executor = create_react_agent(llm, tools, state_modifier=system_message)
# Define input and output models
class QuestionInput(BaseModel):
    question: str
class ResponseOutput(BaseModel):
    response: str

# Initialize ChatOpenAI model
chat = ChatOpenAI(model="gpt-4o-mini")

@app.post("/generate-response", response_model=ResponseOutput)
async def generate_response(input_data: QuestionInput):
    try:
        
        original_question = input_data.question

        translation_prompt = """
        Translate the question below into English for querying an SQLite database with columns: 
        ['title', 'authors', 'categories', 'description', 'published_years'].

            "{text_to_translate}"

        If already in English, return it as is.
        """

       
        translation_llm_chain = LLMChain(
            prompt=PromptTemplate(
                input_variables=["text_to_translate"],
                template=translation_prompt,
            ),
            llm=chat,  
        )

        
        translated_question = translation_llm_chain.run({"text_to_translate": original_question})

        
        question = translated_question

        
        messages_list = []
        for step in agent_executor.stream(
            {"messages": [{"role": "user", "content": question}]},
            stream_mode="values",
        ):
            messages_list.append(step["messages"][-1])

        
        messages_string = "\n".join([message.content for message in messages_list])

        prompt_template = """
        Bạn là trợ lý thư viện thân thiện bằng tiếng Việt.Khi trả lời, hãy đảm bảo câu trả lời của bạn là một câu hoàn chỉnh không có kí tự đặc biệt chỉ là văn bản đơn thuần, rõ ràng và đáp ứng yêu cầu của người hỏi.Tôi sẽ chia thành 2 trường hợp có thể xảy ra:
        1.Trường hợp 1: Nếu câu hỏi liên quan đến các thông tin về sách có trong thư viện, hãy sử dụng dữ liệu sau: Người dùng hỏi: {question}; Dữ liệu từ cơ sở dữ liệu:{messages}. 
        2. Trường hợp 2: nếu câu hỏi nằm ngoài phạm vi thư viện thì đây là câu hỏi từ người dùng {original_question} hãy trả lời dựa trên kiến thức vốn có. 
        Lưu ý: Khi kết thúc câu trả lời, đừng quên hỏi xem họ có cần giúp gì thêm không nhé!  
        """
        final_prompt = prompt_template.format(question=question, messages=messages_string,original_question=original_question)
        llm_chain = LLMChain(
            prompt=PromptTemplate(input_variables=["question", "messages","original_question"], template=prompt_template),
            llm=chat
        )

        response = llm_chain.run({"question": question, "messages": messages_string, "original_question":original_question})


        return {"response": response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
