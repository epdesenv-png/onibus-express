FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY OnibusExpress.sln ./
COPY OnibusExpress.Domain/OnibusExpress.Domain.csproj OnibusExpress.Domain/
COPY OnibusExpress.Application/OnibusExpress.Application.csproj OnibusExpress.Application/
COPY OnibusExpress.Infrastructure/OnibusExpress.Infrastructure.csproj OnibusExpress.Infrastructure/
COPY OnibusExpress.Api/OnibusExpress.Api.csproj OnibusExpress.Api/

RUN dotnet restore OnibusExpress.Api/OnibusExpress.Api.csproj

COPY . .
RUN dotnet publish OnibusExpress.Api/OnibusExpress.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "OnibusExpress.Api.dll"]
