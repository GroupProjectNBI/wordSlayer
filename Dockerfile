# Stage 1: Build the React frontend
# Vite's outDir is configured to ../Server/wwwroot, so the output lands there automatically
FROM node:22-alpine AS frontend-builder 
WORKDIR /src
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# Stage 2: Build the .NET backend and bundle with the frontend output
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-builder
WORKDIR /src
COPY backend/*.csproj ./Backend/
RUN cd backend && dotnet restore 
COPY backend/ ./backend/
# Copy the frontend build output (from stage 1) into wwwroot
COPY --from=frontend-builder /src/backend/wwwroot/ ./backend/wwwroot/
RUN cd backend && dotnet publish -c Release -o /app/publish --no-restore

# Stage 3: Minimal runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=backend-builder /app/publish .

# Render sets PORT dynamically at runtime; ASPNETCORE_UTLS picks it up.
# SQLite DB is ephemeral - it restets on every restart/redeploy (intentional).
CMD ["sh", "-c", "ASPNETCORE_URLS=hhtp://+:${PORT:-10000} dotnet Wordslayer.dll"]