# EduN7 RAG Chatbot - Commit Guide

This document outlines the changes made to the project in a commit-friendly format.

## Commit 1: Project Structure Refactoring

```
refactor: Complete project restructuring with Spring Boot and React

- Replace JavaFX with React-based frontend
- Implement Spring Boot backend with RESTful API
- Reorganize package structure for better separation of concerns
- Set up Docker and Docker Compose for containerization
```

## Commit 2: Backend Implementation

```
feat: Implement Spring Boot backend services

- Create document handling service for PDF processing
- Implement ChromaDB vector database service
- Add Groq LLM integration service with RAG capabilities
- Set up RESTful API controllers for document and chat operations
```

## Commit 3: Frontend Implementation

```
feat: Create React-based frontend

- Implement document upload and management UI
- Create chat interface with message history
- Add document list component
- Set up responsive layout with Material UI
- Implement API services for backend communication
```

## Commit 4: Docker Configuration

```
feat: Configure Docker environment

- Create Dockerfile for Spring Boot server
- Create Dockerfile for React client with Nginx
- Set up docker-compose.yml for multi-container orchestration
- Configure environment variables for Groq API
```

## Commit 5: Documentation and Final Touches

```
docs: Add documentation and final configurations

- Create comprehensive README with setup instructions
- Add .gitignore file
- Update configuration files with appropriate settings
- Optimize RAG prompt engineering for better results
```

## How to Run the Project

1. **Set environment variables**
   ```bash
   export GROQ_API_KEY="your-groq-api-key"
   ```

2. **Build and start the containers**
   ```bash
   cd /home/boo/codeProjects/EduN7_ChatBot/new-structure
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api
   - ChromaDB: http://localhost:8000
