from flask_appbuilder.security.manager import AUTH_DB

ENABLE_CORS = True
CORS_OPTIONS = {
    'origins': ['http:localhost:3000'],  # Replace with your React app's URL
    'supports_credentials': True
}
