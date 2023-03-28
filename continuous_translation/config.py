import os


class ConfigurationError(Exception):
    pass


def load_config():
    config = {
        "GIT_REPO_URL": os.environ.get("INPUT_GIT_REPO_URL", ""),
        "SOURCE_LANGUAGE": os.environ.get("INPUT_SOURCE_LANGUAGE", "en"),
        "TARGET_LANGUAGE": os.environ.get("INPUT_TARGET_LANGUAGE", "zh"),
        "API_KEY": os.environ.get("INPUT_API_KEY", ""),
        "ADDITIONAL_PROMPT": os.environ.get("INPUT_ADDITIONAL_PROMPT", ""),
    }

    missing_keys = [key for key, value in config.items() if not value]

    if missing_keys:
        raise ConfigurationError(
            f"Missing required environment variables: {', '.join(missing_keys)}")

    return config
