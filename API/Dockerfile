FROM microsoft/dotnet:2.1-aspnetcore-runtime AS base
WORKDIR /app

FROM microsoft/dotnet:2.1-sdk-nanoserver-1803 AS build
WORKDIR /src
COPY ["mijnHuishoudenAPI.csproj", "API/"]
RUN dotnet restore "API/mijnHuishoudenAPI.csproj"
WORKDIR "/src/API"
COPY . .
RUN dotnet build "mijnHuishoudenAPI.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "mijnHuishoudenAPI.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "mijnHuishoudenAPI.dll"]