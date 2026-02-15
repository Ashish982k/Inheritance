# AI-Powered Health Prediction System

An intelligent full-stack web application that helps users identify potential health conditions based on symptom descriptions and medical images. The system combines multiple AI models including machine learning classifiers to provide accurate disease predictions with medical guidance.

## Features

### Core Capabilities
- **Text-Based Symptom Analysis**: Natural language processing to predict diseases from symptom descriptions
- **Image-Based Disease Detection**: CNN model for identifying skin conditions from images
- **Smart AI Assistant**: Gemini-powered chatbot with multi-language support and intelligent response generation
- **Medical History Tracking**: MongoDB-backed storage of prediction history and patterns
- **Secure Authentication**: OAuth2 integration with Google, GitHub, and Facebook
- **Multi-Language Support**: Automatic language detection and localized responses

### Key Highlights
- Fast AI predictions with confidence scores
- Privacy-first approach with secure data handling
- Human-friendly medical explanations and precautions
- Modern, accessible UI with voice recognition
- PDF export for medical records
- Real-time chat interface with glass-morphism design

## Tech Stack

### Frontend
- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript/JavaScript** - Programming language
- **Tailwind CSS 4** - Utility-first styling
- **NextAuth 5** - Authentication
- **Mongoose 9.1.0** - MongoDB ODM
- **Google Generative AI** - Gemini API integration
- **GSAP 3.14.2** - Animation library

### Backend
- **FastAPI** - Python web framework
- **PyTorch & TorchVision** - Deep learning framework
- **Scikit-learn** - Machine learning library
- **NumPy** - Numerical computing
- **Uvicorn** - ASGI server

### Database
- **MongoDB** - NoSQL database for user data and chat history

## Project Structure

```
Inheritance/
├── my-app/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   │   ├── api/       # API routes
│   │   │   ├── chatbot/   # Chatbot interface
│   │   │   ├── contact/   # Contact page
│   │   │   └── login/     # Authentication page
│   │   ├── database/      # MongoDB models and connections
│   │   └── auth.ts        # NextAuth configuration
│   ├── package.json
│   └── tailwind.config.mjs
│
├── ML/                    # FastAPI backend and ML models
│   ├── main.py           # FastAPI server
│   ├── train_img_model.py # Image model training script
│   ├── disease_model.pkl  # Text-based classifier
│   ├── vectorizer.pkl     # TF-IDF vectorizer
│   ├── img_model.pt       # ResNet18 model weights
│   ├── img_classes.json   # Disease class labels
│   ├── dataset.csv        # Training data
│   └── requirements.txt   # Python dependencies
│
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.8+
- MongoDB instance
- Google Gemini API key
- OAuth credentials (Google, GitHub, Facebook)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd my-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_connection_string
AUTH_SECRET=your_auth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the ML directory:
```bash
cd ML
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the FastAPI server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## Usage

### Text-Based Prediction
1. Navigate to the chatbot page
2. Describe your symptoms in natural language
3. The system will analyze and provide top 3 disease predictions with confidence scores
4. View detailed precautions and medical guidance

### Image-Based Prediction
1. Click the image upload button in the chatbot
2. Select a medical/dermatological image
3. The ResNet18 model will classify the condition
4. Results include disease name and confidence level

### Voice Input
1. Click the microphone icon in the chatbot
2. Speak your symptoms
3. The system converts speech to text and processes the prediction

## API Endpoints

### ML Backend (FastAPI)
- `POST /predict` - Text-based symptom prediction
  ```json
  {
    "symptoms": "fever, cough, headache"
  }
  ```

- `POST /predict-image` - Image-based disease classification
  - Accepts multipart form data with image file

### Frontend API Routes
- `POST /api/chatbot` - Main chatbot interface with Gemini integration
- `POST /api/image-predict` - Proxy for image predictions
- `GET /api/history` - Retrieve user prediction history
- Authentication routes via NextAuth

## ML Models

### Text-Based Model
- **Algorithm**: Scikit-learn classifier with TF-IDF vectorization
- **Features**: Symptom importance weighting and normalization
- **Output**: Top 3 disease predictions with confidence scores

### Image-Based Model
- **Architecture**: ResNet18 (PyTorch)
- **Classes**: 9 skin disease categories
  - Melanoma
  - Actinic Keratosis
  - Basal Cell Carcinoma
  - Dermatofibroma
  - Melanocytic Nevi
  - Benign Keratosis
  - Vascular Lesions
  - And more
- **Input**: Image files (automatically resized)
- **Output**: Disease class with confidence score

## Development

### Running Tests
```bash
# Frontend
cd my-app
npm test

# Backend
cd ML
pytest
```

### Building for Production
```bash
# Frontend
cd my-app
npm run build
npm start

# Backend
cd ML
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security & Privacy

- All medical data is handled securely
- User authentication through trusted OAuth providers
- Chat history stored with user consent
- No sharing of personal health information
- HIPAA-aware design principles

## Disclaimer

This application is for educational and informational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini AI for intelligent response generation
- FastAPI for the robust backend framework
- Next.js team for the excellent frontend framework
- Open-source ML community for model architectures

## Support

For support, please visit the contact page or open an issue in the repository.
