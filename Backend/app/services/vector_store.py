from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import PGVector
from app.core.config import settings

class VectorStoreService:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings(
            api_key=settings.OPENAI_API_KEY.get_secret_value() if settings.OPENAI_API_KEY else None
        )
        self.connection_string = PGVector.connection_string_from_db_params(
            driver="psycopg2",
            host=settings.POSTGRES_SERVER,
            port=settings.POSTGRES_PORT,
            database=settings.POSTGRES_DB,
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
        )

    def get_vector_store(self, collection_name: str = "lendwise_docs"):
        return PGVector(
            connection_string=self.connection_string,
            embedding_function=self.embeddings,
            collection_name=collection_name,
        )

    async def add_documents(self, texts: list[str], metadatas: list[dict]):
        vector_store = self.get_vector_store()
        vector_store.add_texts(texts, metadatas=metadatas)

    async def similarity_search(self, query: str, filter: dict = None):
        vector_store = self.get_vector_store()
        return vector_store.similarity_search(query, k=5, filter=filter)

vector_service = VectorStoreService()
