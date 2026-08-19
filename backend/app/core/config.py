from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    DATABASE_URL: str

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    NVIDIA_API_KEY: str
    NVIDIA_MODEL: str = "openai/gpt-oss-20b"
    NVIDIA_BASE_URL: str = "https://integrate.api.nvidia.com/v1"

    class Config:
        env_file = ".env"


settings = Settings()