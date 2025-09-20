# AI Voice Bot Management System

A comprehensive system for managing AI voice bots using OpenMic AI, with visitor tracking and call management capabilities.


## Frontend Structure

### Pages

#### 1. **Home Page** (`/app/page.tsx`)
- **Purpose**: Main dashboard for bot management
- **Features**:
  - View all bots with pagination (10 bots per page)
  - Create new bots with form validation
  - Edit existing bots inline
  - Delete bots with confirmation
  - Navigate to call history for each bot
- **Key Components**:
  - Bot creation form with fields: name, prompt, first_message, summary_prompt
  - Bot list with truncated prompt display
  - Pagination controls
  - Real-time bot updates

#### 2. **Bot Calls Page** (`/app/bot/[id]/calls/page.tsx`)
- **Purpose**: View call history and transcripts for a specific bot
- **Features**:
  - Display call logs with pagination
  - Show call status, duration, phone numbers
  - Expandable call transcripts with chat-like interface
  - Call summaries from AI analysis
- **Key Components**:
  - Call list with status indicators (ended/failed/in-progress)
  - Transcript viewer with user/assistant message distinction
  - Duration formatting and call metadata display

## Backend Structure

### API Routes

#### 1. **Bot Routes** (`/api/bot/*`)

**Base Path**: `/api/bot`

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/create` | POST | Create new bot | Body: `{name, prompt, first_message, summary_prompt}` |
| `/update/:uid` | PATCH | Update existing bot | Params: `uid`, Body: `{name, prompt, first_message, summary_prompt}` |
| `/delete/:uid` | DELETE | Delete bot | Params: `uid` |
| `/list` | GET | List bots with pagination | Query: `page` (optional, default: 1) |

#### 2. **Call Routes** (`/api/call/*`)

**Base Path**: `/api/call`

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/logs/:botID` | GET | Get call logs for bot | Params: `botID`, Query: `page` (optional) |
| `/history/:callID` | GET | Get call transcript | Params: `callID` |

### Webhook Routes (`/webhook/*`)

**Base Path**: `/webhook`

#### 1. **Pre-Call Hook** (`/precall`)
- **Method**: POST
- **Purpose**: Provide dynamic data before call starts
- **Functionality**:
  - Retrieves visitor information from database
  - Fetches last call summary for context
  - Returns dynamic variables for bot personalization

#### 2. **In-Call Data Hook** (`/getData`)
- **Method**: POST
- **Purpose**: Provide real-time data during calls
- **Functionality**:
  - Searches employee database by name
  - Returns employee location and department
  - Handles partial name matches

#### 3. **Post-Call Hook** (`/postcall`)
- **Method**: POST
- **Purpose**: Store call summary after completion
- **Functionality**:
  - Saves call summary to database
  - Links summary to visitor record
  - Maintains call history for future reference


##  Database Schema

### Tables

#### 1. **Visitor**
```sql
model Visitor {
  id    Int     @id @default(autoincrement())
  name  String
  phone String  @unique
  calls Call[]
}
```

#### 2. **Employee**
```sql
model Employee {
  id         Int    @id @default(autoincrement())
  name       String
  department String
  location   String
}
```

#### 3. **Call**
```sql
model Call {
  id          Int      @id @default(autoincrement())
  summary     String
  arrivalTime DateTime
  createdAt   DateTime @default(now())
  visitor     Visitor  @relation(fields: [visitorId], references: [id])
  visitorId   Int
}
```

### Seed Data

The system includes predefined data:
- **1 Visitor**: Shashwat Singh (phone: "web_call")
- **5 Employees**: Rohan Sharma, Priya Iyer, Amit Verma, Neha Gupta, Arjun Reddy
- **Departments**: Engineering, Marketing, Sales, HR, Finance
- **Locations**: Multiple office towers across Indian cities

##  External API Integration

### OpenMic AI Integration

The system integrates with OpenMic AI for voice bot management:

- **Base URL**: `https://api.openmic.ai/v1`
- **Authentication**: Bearer token via `OPENMIC_API_KEY`
- **Endpoints Used**:
  - `POST /bots` - Create bots
  - `PATCH /bots/:id` - Update bots  
  - `DELETE /bots/:id` - Delete bots
  - `GET /bots` - List bots
  - `GET /calls` - Get call logs
  - `GET /call/:id` - Get call details

## Setup Instructions

### Backend Setup

1. **Install Dependencies**
```bash
cd backend
npm install
npm run build
```

2. **Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your values:
# OPENMIC_API_KEY=your_openmic_api_key
# DATABASE_URL=your_postgresql_connection_string
```

3. **Database Setup**
```bash
npx prisma migrate dev
npx prisma generate
npm run seed
```

4. **Start Server**
```bash
npm run dev
```

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Environment Configuration**
```bash
# Create .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```


1. **Start Development Server**
```bash
npm run dev
```
