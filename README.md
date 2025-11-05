# 🍽️ Restaurant Management System

A modern, full-stack restaurant management system built with **Spring Boot microservices** and **React**. This project demonstrates enterprise-level architecture, clean code principles, and modern development practices.

## 🎯 **Project Overview**

This system provides a complete solution for restaurant management, including user authentication, menu management, table management, order processing, and administrative operations. Built with microservices architecture for scalability and maintainability.

### **Key Features**

- 🔐 **JWT-based Authentication** with role-based access control
- 🍽️ **Menu Management** with categories and menu items
- 🪑 **Table Management** with status tracking (Available, Occupied, Reserved, Cleaning)
- 📋 **Order System** with real-time order tracking
- 📊 **Floor Plan View** for visual table management
- 🔄 **Real-time Status Updates** (SSE ready for implementation)
- 👥 **User Management** with admin capabilities
- 🎨 **Modern React Frontend** with responsive design
- 🏗️ **Microservices Architecture** for scalability
- 🐳 **Docker Support** for containerization
- ☸️ **Kubernetes Ready** for orchestration

## 🏗️ **Architecture**

### **Microservices Structure**

```
┌─────────────────────────────────────────────────────────────┐
│                    Restaurant System                        │
├─────────────────────────────────────────────────────────────┤
│  🌐 API Gateway Service                                     │
│  ├── Request Routing                                        │
│  ├── JWT Validation                                         │
│  └── Load Balancing                                         │
├─────────────────────────────────────────────────────────────┤
│  🔐 Auth Service                                            │
│  ├── User Authentication                                    │
│  ├── JWT Token Management                                   │
│  ├── User Registration/Login                                │
│  └── Admin Operations                                       │
├─────────────────────────────────────────────────────────────┤
│  🍽️ Menu Service                                            │
│  ├── Menu Management                                        │
│  ├── Category Management                                    │
│  ├── Menu Item Management                                   │
│  └── Kitchen Station Management                             │
├─────────────────────────────────────────────────────────────┤
│  🪑 Table Order Service                                      │
│  ├── Table Management                                       │
│  ├── Table Status Management                                │
│  ├── Order Creation & Management                            │
│  ├── Order Item Management                                  │
│  └── Real-time Updates (SSE)                                │
├─────────────────────────────────────────────────────────────┤
│  🔧 Common Service                                          │
│  ├── Shared Utilities                                       │
│  ├── HTTP Communication                                     │
│  ├── Exception Handling                                     │
│  └── Security Components                                    │
└─────────────────────────────────────────────────────────────┘
```

### **Technology Stack**

#### **Backend**

- **Java 17** - Modern Java features
- **Spring Boot 3.x** - Microservices framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Data persistence
- **JWT** - Token-based authentication
- **Maven** - Dependency management
- **H2 Database** - In-memory database for development

#### **Frontend**

- **React 18** - Modern UI library
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

#### **DevOps & Deployment**

- **Docker** - Containerization
- **Kubernetes** - Container orchestration
- **Maven Wrapper** - Consistent builds

## 🚀 **Getting Started**

### **Prerequisites**

- **Java 17** or higher
- **Node.js 16** or higher
- **Maven 3.6** or higher
- **Docker** (optional)
- **Git**

### **Quick Start**

#### **1. Clone the Repository**

```bash
git clone https://github.com/regev123/springboot-microservices-restaurant.git
cd springboot-microservices-restaurant
```

#### **2. Backend Setup**

**Start all microservices:**

```bash
# Start Auth Service
cd auth-service
./mvnw spring-boot:run

# Start Menu Service (in new terminal)
cd menu-service
./mvnw spring-boot:run

# Start API Gateway (in new terminal)
cd api-gateway-service
./mvnw spring-boot:run

# Start Table Order Service (in new terminal)
cd table-order-service
./mvnw spring-boot:run
```

**Or start all services with Maven:**

```bash
# From root directory
./mvnw clean install
./mvnw spring-boot:run -pl auth-service
./mvnw spring-boot:run -pl menu-service
./mvnw spring-boot:run -pl table-order-service
./mvnw spring-boot:run -pl api-gateway-service
```

#### **3. Frontend Setup**

```bash
cd RestaurantFrontend
npm install
npm start
```

#### **4. Access the Application**

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Auth Service**: http://localhost:8081
- **Menu Service**: http://localhost:8082
- **Table Order Service**: http://localhost:8083

### **Default Credentials**

```
Admin User:
Email: admin@restaurant.com
Password: admin123

Regular User:
Email: user@restaurant.com
Password: user123
```

## 📁 **Project Structure**

```
springboot-microservices-restaurant/
├── 📁 api-gateway-service/          # API Gateway microservice
│   ├── src/main/java/
│   │   └── com/restaurant/apiGateway/
│   │       ├── config/              # Configuration classes
│   │       ├── dto/                 # Data Transfer Objects
│   │       ├── exception/           # Exception handling
│   │       ├── service/             # Business logic
│   │       └── util/                # Utility classes
│   └── src/main/resources/
│       └── application.yml          # Service configuration
├── 📁 auth-service/                 # Authentication microservice
│   ├── src/main/java/
│   │   └── com/restaurant/auth/
│   │       ├── config/              # Security configuration
│   │       ├── controller/          # REST controllers
│   │       ├── dto/                 # Request/Response DTOs
│   │       ├── entity/              # JPA entities
│   │       ├── exceptions/          # Custom exceptions
│   │       ├── mapper/              # Entity-DTO mappers
│   │       ├── repository/          # Data access layer
│   │       └── service/             # Business logic
│   └── src/main/resources/
│       └── application.properties   # Service configuration
├── 📁 menu-service/                 # Menu management microservice
│   ├── src/main/java/
│   │   └── com/restaurant/menu/
│   │       ├── config/              # Configuration classes
│   │       ├── controller/          # REST controllers
│   │       ├── dto/                 # Request/Response DTOs
│   │       ├── entity/              # JPA entities
│   │       ├── exceptions/          # Custom exceptions
│   │       ├── mapper/              # Entity-DTO mappers
│   │       ├── repository/          # Data access layer
│   │       └── service/             # Business logic
│   └── src/main/resources/
│       └── application.yml          # Service configuration
├── 📁 table-order-service/          # Table and order management microservice
│   ├── src/main/java/
│   │   └── com/restaurant/tableorder/
│   │       ├── config/              # Configuration classes
│   │       ├── controller/          # REST controllers
│   │       ├── dto/                 # Request/Response DTOs
│   │       ├── entity/              # JPA entities (Table, Order, OrderItem)
│   │       ├── exceptions/          # Custom exceptions
│   │       ├── mapper/              # Entity-DTO mappers
│   │       ├── repository/          # Data access layer
│   │       └── service/             # Business logic
│   └── src/main/resources/
│       └── application.yml          # Service configuration
├── 📁 common-service/               # Shared utilities
│   ├── src/main/java/
│   │   └── com/restaurant/common/
│   │       ├── annotation/          # Custom annotations
│   │       ├── config/              # Shared configuration
│   │       ├── exception/           # Common exceptions
│   │       ├── mapper/              # Shared mappers
│   │       ├── security/            # Security utilities
│   │       └── service/             # Shared services
│   └── pom.xml                      # Maven configuration
├── 📁 RestaurantFrontend/           # React frontend application
│   ├── src/
│   │   ├── api/                     # API service layer
│   │   ├── components/              # Reusable components
│   │   ├── features/                # Feature-based modules
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── pages/                   # Page components
│   │   ├── routes/                  # Routing configuration
│   │   ├── store/                   # Redux store
│   │   └── styles/                  # Global styles
│   ├── package.json                 # Node.js dependencies
│   └── tailwind.config.js           # Tailwind configuration
├── 📁 k8s/                         # Kubernetes manifests
│   ├── namespace.yaml               # Kubernetes namespace
│   ├── auth-service-deployment.yaml # Auth service deployment
│   ├── menu-service-deployment.yaml # Menu service deployment
│   └── api-gateway-deployment.yaml  # API Gateway deployment
├── 📄 pom.xml                      # Root Maven configuration
├── 📄 .gitignore                   # Git ignore rules
└── 📄 README.md                    # This file
```

## 🔧 **API Documentation**

### **Authentication Endpoints**

```
POST /api/auth/register              # User registration (Admin)
POST /api/auth/login                 # User login
POST /api/auth/validate-token        # Token validation
GET  /api/auth/users                 # Get all users (Admin)
PUT  /api/auth/users/{id}            # Update user (Admin)
DELETE /api/auth/users/{id}          # Delete user (Admin)
```

### **Menu Management Endpoints**

```
GET    /api/menu/categories          # Get all categories (Admin)
POST   /api/menu/categories          # Create category (Admin)
PUT    /api/menu/categories/{id}     # Update category (Admin)
DELETE /api/menu/categories/{id}     # Delete category (Admin)
POST   /api/menu/categories/order    # Update category order (Admin)

GET    /api/menu/items               # Get all menu items (Admin)
POST   /api/menu/items               # Create menu item (Admin)
PUT    /api/menu/items/{id}          # Update menu item (Admin)
DELETE /api/menu/items/{id}         # Delete menu item (Admin)

GET    /api/menu/menus               # Get all menus (Admin)
POST   /api/menu/menus               # Create menu (Admin)
PUT    /api/menu/menus/{id}          # Update menu (Admin)
DELETE /api/menu/menus/{id}          # Delete menu (Admin) 
POST   /api/menu/menus/{id}/activate # Activate menu (Admin)

GET    /api/menu/active              # Get active menu (Public)
```

### **Table Management Endpoints**

```
GET    /api/tables/all               # Get all active tables (User/Waitress)
GET    /api/tables/{tableId}         # Get table by ID (User/Waitress)
GET    /api/tables/{tableId}/with-orders  # Get table with orders (User/Waitress)
PUT    /api/tables/change-status     # Change table status (User/Waitress)

GET    /api/tables/admin/all        # Get all tables (Admin)
POST   /api/tables/admin/create     # Create table (Admin)
PUT    /api/tables/admin/update     # Update table (Admin)
DELETE /api/tables/admin/delete/{id} # Delete table (Admin)
```

### **Order Management Endpoints**

```
POST   /api/orders                  # Create order (User/Waitress)
GET    /api/orders/table/{tableId}  # Get orders by table (User/Waitress)
GET    /api/orders/{orderId}        # Get order by ID (User/Waitress)
PUT    /api/orders/{orderId}/cancel # Cancel order (User/Waitress)
```

## 🎨 **Frontend Features**

### **User Interface**

- **🎨 Modern Design** - Clean, responsive interface with Tailwind CSS
- **📱 Mobile Responsive** - Works on all device sizes
- **🌙 Dark/Light Theme** - User preference support
- **⚡ Fast Loading** - Optimized performance

### **Components**

- **🔐 Authentication** - Login, registration, password management
- **👥 User Management** - Admin panel for user operations
- **🍽️ Menu Management** - Create, edit, and organize menus
- **🪑 Table Management** - Table CRUD operations and floor plan view
- **📋 Order Management** - Create and manage orders for tables
- **📊 Dashboard** - Overview of system status
- **🔔 Notifications** - Toast notifications for user feedback
- **⏱️ Real-time Updates** - Live order elapsed time tracking

### **State Management**

- **Redux Toolkit** - Predictable state management
- **Async Thunks** - Efficient data fetching and caching
- **Custom Hooks** - Reusable logic extraction (useTableDetailForm, useTablesForm)
- **Form Validation** - Client-side validation with error handling
- **Modular Components** - Feature-based component organization

## 🏗️ **Design Patterns & Principles**

### **SOLID Principles**

- **S** - Single Responsibility Principle
- **O** - Open/Closed Principle
- **L** - Liskov Substitution Principle
- **I** - Interface Segregation Principle
- **D** - Dependency Inversion Principle

### **Design Patterns Implemented**

- **Repository Pattern** - Data access abstraction
- **Service Layer Pattern** - Business logic encapsulation
- **DTO Pattern** - Data transfer objects
- **Builder Pattern** - Object construction
- **Factory Pattern** - Object creation
- **Observer Pattern** - Event handling

### **Clean Code Practices**

- **Constants Extraction** - No hardcoded values
- **Comprehensive Documentation** - JavaDoc for all public methods
- **Error Handling** - Custom exceptions with user-friendly messages
- **Input Validation** - Jakarta Validation annotations
- **Logging** - Structured logging throughout the application

## 🧪 **Testing**

### **Backend Testing**

```bash
# Run all tests
./mvnw test

# Run specific service tests
./mvnw test -pl auth-service
./mvnw test -pl menu-service
```

### **Frontend Testing**

```bash
cd RestaurantFrontend
npm test
```

## 🐳 **Docker Support**

### **Build Docker Images**

```bash
# Build all services
docker build -t restaurant/auth-service ./auth-service
docker build -t restaurant/menu-service ./menu-service
docker build -t restaurant/api-gateway ./api-gateway-service
```

### **Run with Docker Compose**

```bash
# Create docker-compose.yml and run
docker-compose up -d
```

## ☸️ **Kubernetes Deployment**

### **Deploy to Kubernetes**

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/auth-service-deployment.yaml
kubectl apply -f k8s/menu-service-deployment.yaml
kubectl apply -f k8s/api-gateway-deployment.yaml
```

## 🔒 **Security Features**

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Admin and user roles
- **Password Encryption** - BCrypt password hashing
- **Input Validation** - Server-side validation
- **CORS Configuration** - Cross-origin request handling
- **Exception Handling** - Secure error messages

## 📊 **Performance Optimizations**

- **Mathematical Validation** - Efficient algorithms for data validation
- **Database Optimization** - Optimized queries and indexing
- **Frontend Optimization** - Code splitting and lazy loading
- **Caching Strategy** - Ready for Redis integration
- **Connection Pooling** - Database connection optimization

## 🔄 **Real-time Features**

### **Server-Sent Events (SSE) - Ready for Implementation**

The system is prepared for real-time table status synchronization:
- **Event Broadcasting** - When any table status changes, all connected clients receive updates
- **Automatic State Updates** - Redux state updates automatically without page refresh
- **Multi-client Support** - Multiple users/devices stay synchronized in real-time

### **Current Real-time Features**

- **Live Order Tracking** - Elapsed time updates every second for active orders
- **Status Management** - Table status changes propagate immediately (SSE ready)

## 🚀 **Deployment**

### **Production Deployment**

1. **Configure Environment Variables**
2. **Set up Database** (PostgreSQL/MySQL)
3. **Configure JWT Secrets**
4. **Set up SSE Endpoint** for real-time updates
5. **Deploy to Cloud Platform** (AWS, GCP, Azure)
6. **Set up Monitoring** (Prometheus, Grafana)

### **Environment Configuration**

```yaml
# application-prod.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/restaurant
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
```

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Development Guidelines**

- Follow **SOLID principles**
- Write **comprehensive tests**
- Add **JavaDoc documentation**
- Use **meaningful commit messages**
- Follow **conventional commits** format

## 📝 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 **Author**

**Regev** - [GitHub Profile](https://github.com/regev123)

## 🙏 **Acknowledgments**

- **Spring Boot** - Amazing microservices framework
- **React** - Powerful frontend library
- **Tailwind CSS** - Utility-first CSS framework
- **Open Source Community** - For inspiration and tools

## 📞 **Support**

If you have any questions or need help with the project:

- **Create an Issue** - [GitHub Issues](https://github.com/regev123/springboot-microservices-restaurant/issues)
- **Email** - [Your Email]
- **LinkedIn** - [Your LinkedIn Profile]

---

⭐ **Star this repository** if you found it helpful!

🍽️ **Happy Coding!** 🚀
