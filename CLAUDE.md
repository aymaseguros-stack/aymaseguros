# CLAUDE.md - Ayma Advisors Codebase Guide

> **For AI Assistants**: This document provides comprehensive context about the Ayma Advisors insurance landing page and CRM system to help you understand the codebase structure, development workflows, and key conventions.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Codebase Structure](#codebase-structure)
3. [Architecture & Technology Stack](#architecture--technology-stack)
4. [Key Features](#key-features)
5. [Data Flow & Storage](#data-flow--storage)
6. [Development Workflow](#development-workflow)
7. [Code Conventions](#code-conventions)
8. [Security Considerations](#security-considerations)
9. [Common Tasks](#common-tasks)
10. [Testing & Debugging](#testing--debugging)
11. [Deployment](#deployment)

---

## Project Overview

**Ayma Advisors** is a web-based insurance quotation and CRM system for a Rosario, Argentina-based insurance broker established in 2008. The application consists of:

- **Customer-facing landing page** with interactive quotation chatbot
- **Admin CRM panel** for managing leads, quotes, and follow-ups
- **WhatsApp integration** for customer communication
- **Google Sheets backup** (configured but currently inactive)

**Business Context:**
- Location: Rosario, Santa Fe, Argentina
- Contact: +54 9 341 695-2259
- Service: Auto insurance comparison and brokerage
- Partners: Nación Seguros, San Cristóbal, Mapfre, SMG Seguros

---

## Codebase Structure

```
aymaseguros/
├── index.html          # Main landing page with quote chatbot
├── admin.html          # Admin CRM panel
├── README.md           # Basic project description
└── .git/               # Git repository
```

### File Descriptions

#### `index.html` (697 lines)
- **Purpose**: Customer-facing landing page with lead generation
- **Key Components**:
  - Landing page with value propositions
  - Interactive quote chatbot (React-based)
  - A/B testing for headlines
  - WhatsApp integration
  - Testimonials and social proof
  - Lead capture and storage

#### `admin.html` (609 lines)
- **Purpose**: Internal CRM and quote management system
- **Key Components**:
  - Authentication system
  - Dashboard with KPI metrics
  - Quote management (status tracking)
  - Calendar/reminder system
  - Contact history tracking
  - Google Sheets backup integration

---

## Architecture & Technology Stack

### Technology Stack

**Frontend Framework:**
- React 18 (CDN via unpkg.com)
- React DOM 18
- Babel Standalone (for JSX compilation)

**CSS Framework:**
- Tailwind CSS 3 (CDN via cdn.tailwindcss.com)

**Charting Library:**
- Chart.js 4.4.0 (admin panel only)

**Data Storage:**
- LocalStorage for persistent quote data
- Google Sheets API integration (prepared, not active)

**Integrations:**
- WhatsApp Business API (via wa.me links)
- Google Apps Script (for Sheets backup)

### Architecture Pattern

**Single Page Applications (SPAs)**:
- Both `index.html` and `admin.html` are standalone SPAs
- No build process required (all dependencies via CDN)
- Client-side rendering with React
- State management using React hooks

**Data Architecture:**
```
User Input → React State → LocalStorage → Google Sheets (optional)
                              ↓
                      Admin Panel Access
```

### Custom Tailwind Configuration

```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                'ayma-blue': '#1e40af',
                'ayma-blue-dark': '#1e3a8a',
                'ayma-blue-light': '#3b82f6',
            }
        }
    }
}
```

---

## Key Features

### Landing Page (index.html)

#### 1. **A/B Testing System**
- Location: `index.html:156-168`
- Two headline variants tested randomly
- Conversion tracking via `headlineVersion` field

#### 2. **Interactive Quote Chatbot**
- Multi-step form disguised as conversation
- Steps: name → postal code → brand → model → year → coverage
- Input validation (e.g., year must be 1980-2026)
- Real-time typing indicators

#### 3. **Lead Capture Flow**
```
Step 1: Name
Step 2: Postal Code
Step 3: Vehicle Brand
Step 4: Vehicle Model
Step 5: Vehicle Year (validated)
Step 6: Coverage Type
→ Save to LocalStorage
→ Send to Google Sheets
→ Auto-notify admin via WhatsApp
→ Present WhatsApp CTA to user
```

#### 4. **WhatsApp Integration**
- Customer CTA: Sends quote details to +54 9 341 695-2259
- Admin notification: Auto-opens WhatsApp with new lead notification
- Template message formatting

#### 5. **Social Proof Elements**
- Customer testimonials with ratings
- "2,500+ clients" trust badge
- 4.9/5 star rating
- Insurance partner logos

### Admin Panel (admin.html)

#### 1. **Authentication System**
- Location: `admin.html:101-109`
- Credentials:
  - Username: `ayma`
  - Password: `Mimamamemima14`
- No backend authentication (client-side only)

#### 2. **Dashboard KPIs**
- Total quotes
- New quotes count
- Quoted count
- Sold count
- Conversion rate percentage
- Pending reminders count

#### 3. **Quote Management**
- Status workflow: `nueva` → `cotizada` → `vendida` / `perdida`
- Contact history logging
- Note-taking functionality
- Reminder/task scheduling

#### 4. **Calendar & Reminder System**
- Reminder types: llamada, email, whatsapp, reunion, cotizacion, seguimiento
- Date/time scheduling
- Overdue reminder notifications
- Today's reminder view
- Completion tracking

#### 5. **Data Backup**
- Auto-sync to Google Sheets (prepared but inactive)
- Google Apps Script URL: `admin.html:81`
- Backup on every data change

---

## Data Flow & Storage

### Quote Data Structure

```javascript
{
  id: 1637251234567,                    // Timestamp-based unique ID
  nombre: "María González",             // Customer name
  codigoPostal: "2000",                 // Postal code
  marca: "Honda",                       // Vehicle brand
  modelo: "Civic",                      // Vehicle model
  anio: "2019",                         // Vehicle year
  cobertura: "Todo Riesgo",            // Coverage type
  status: "nueva",                      // Quote status
  createdAt: "2024-11-18T10:30:00Z",   // ISO timestamp
  headlineVersion: "A",                 // A/B test variant
  notes: "",                            // Admin notes
  contactHistory: [                     // Contact log
    {
      id: 1637251234568,
      text: "Cliente llamó para consultar precios",
      timestamp: "2024-11-18T11:00:00Z"
    }
  ],
  reminders: [                          // Scheduled tasks
    {
      id: 1637251234569,
      date: "2024-11-19",
      time: "10:00",
      type: "llamada",
      notes: "Seguimiento cotización",
      completed: false
    }
  ]
}
```

### LocalStorage Schema

**Key**: `ayma_quotes`
**Format**: JSON array of quote objects
**Example**:
```javascript
localStorage.getItem('ayma_quotes') // Returns JSON string
JSON.parse(localStorage.getItem('ayma_quotes')) // Returns array
```

### Google Sheets Integration

**Apps Script URL**: `https://script.google.com/macros/s/AKfycby...5/exec`

**Expected Payload**:
```javascript
{
  quotes: [...], // Array of quote objects
  timestamp: "2024-11-18T10:30:00Z"
}
```

**Note**: Currently configured with `mode: 'no-cors'` for cross-origin compatibility

---

## Development Workflow

### Making Changes

#### 1. **Modifying the Landing Page**
```bash
# Edit index.html directly
# Changes are reflected immediately on page refresh
# Test both mobile and desktop views
```

#### 2. **Modifying the Admin Panel**
```bash
# Edit admin.html directly
# Refresh browser to see changes
# Ensure you're logged in to test functionality
```

#### 3. **Testing LocalStorage**
```javascript
// In browser console:
localStorage.getItem('ayma_quotes')
JSON.parse(localStorage.getItem('ayma_quotes'))

// Clear all data:
localStorage.removeItem('ayma_quotes')
```

### Git Workflow

**Current Branch**: `claude/claude-md-mi3twgghnxmxv5e6-011uXnG2SL3jXvKAgDn49SbB`
**Remote**: Local proxy on port 25792

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "Description of changes"

# Push to branch
git push -u origin claude/claude-md-mi3twgghnxmxv5e6-011uXnG2SL3jXvKAgDn49SbB
```

**Important**: Always use branches starting with `claude/` and ending with session ID

---

## Code Conventions

### React Patterns

#### 1. **Component Structure**
```javascript
const ComponentName = () => {
    // Hooks at the top
    const [state, setState] = useState(initialValue);
    const ref = useRef(null);

    // useEffect hooks
    useEffect(() => {
        // Side effects
    }, [dependencies]);

    // Helper functions
    const helperFunction = () => {
        // Logic
    };

    // Return JSX
    return (
        <div>...</div>
    );
};
```

#### 2. **State Management**
- Use `useState` for local component state
- Use `useRef` for DOM references and chart instances
- Use `useEffect` for side effects (data loading, intervals)

#### 3. **Naming Conventions**
- Components: PascalCase (`AymaLogo`, `AymaAdvisorsApp`)
- Functions: camelCase (`addBotMessage`, `sendToWhatsApp`)
- Constants: UPPER_SNAKE_CASE (`GOOGLE_SCRIPT_URL`)
- CSS classes: Tailwind utility classes

### SVG Icon Pattern

```javascript
const IconName = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         className={className}>
        {/* SVG paths */}
    </svg>
);
```

### CSS Patterns

#### 1. **Gradient Backgrounds**
```javascript
className="bg-gradient-to-br from-ayma-blue-dark via-ayma-blue to-ayma-blue-light"
```

#### 2. **Card Pattern**
```javascript
className="bg-white rounded-xl shadow-md p-6"
```

#### 3. **Button Pattern**
```javascript
className="bg-ayma-blue hover:bg-ayma-blue-dark text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
```

### WhatsApp Integration Pattern

```javascript
const message = `Formatted message text`;
const whatsappURL = `https://wa.me/5493416952259?text=${encodeURIComponent(message)}`;
window.open(whatsappURL, '_blank');
```

---

## Security Considerations

### ⚠️ Known Security Issues

#### 1. **Hardcoded Credentials**
- Location: `admin.html:103`
- Username: `ayma`
- Password: `Mimamamemima14`
- **Risk**: Client-side authentication is easily bypassed
- **Recommendation**: Implement backend authentication

#### 2. **Public Google Apps Script URL**
- Location: `admin.html:81`
- Visible in source code
- **Risk**: Could be abused for spam/data injection
- **Recommendation**: Implement authentication token

#### 3. **LocalStorage Data**
- All quote data stored in browser localStorage
- **Risk**: Accessible via browser console
- **Recommendation**: Encrypt sensitive data or use backend storage

#### 4. **No Input Sanitization**
- User inputs stored directly without sanitization
- **Risk**: Potential XSS if data is rendered as HTML elsewhere
- **Current Status**: Low risk (data only shown in admin panel)

### 🔒 Security Best Practices

When modifying code:
1. **Never commit real credentials** to git
2. **Validate all user inputs** before storage
3. **Escape HTML** when rendering user-provided content
4. **Use HTTPS** for all external API calls
5. **Implement rate limiting** for quote submissions

---

## Common Tasks

### Task 1: Add a New Form Field

**Example**: Add "Email" field to quote form

1. Update chatbot steps in `index.html`:
```javascript
case 'codigoPostal':
    setCurrentQuote(prev => ({ ...prev, codigoPostal: userInput }));
    setCurrentStep('email'); // NEW
    addBotMessage("¿Cuál es tu email?"); // NEW
    break;

case 'email': // NEW STEP
    setCurrentQuote(prev => ({ ...prev, email: userInput }));
    setCurrentStep('marca');
    addBotMessage("Ahora sobre tu auto. ¿Qué marca es?");
    break;
```

2. Update WhatsApp message template:
```javascript
const message = `*SOLICITUD DE COTIZACIÓN*
Nombre: ${currentQuote.nombre}
Email: ${currentQuote.email}
...`;
```

3. Update admin display in `admin.html`:
```javascript
<div><span className="text-gray-600">Email:</span> <span className="font-semibold">{q.email}</span></div>
```

### Task 2: Change Color Scheme

1. Update Tailwind config in both files:
```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                'ayma-blue': '#your-new-color',
                'ayma-blue-dark': '#your-dark-variant',
                'ayma-blue-light': '#your-light-variant',
            }
        }
    }
}
```

2. Update inline styles if any hex colors are hardcoded

### Task 3: Add New Quote Status

1. Update status buttons in `admin.html`:
```javascript
<button
    onClick={() => changeStatus(q.id, 'your-new-status')}
    className="bg-your-color-500 hover:bg-your-color-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
>
    🔔 Your Status
</button>
```

2. Update KPI calculations:
```javascript
const yourStatus = quotes.filter(q => q.status === 'your-new-status').length;
```

3. Add to dashboard metrics display

### Task 4: Modify Testimonials

Edit testimonials array in `index.html:171-193`:
```javascript
const testimonials = [
    {
        name: "New Customer Name",
        location: "Location",
        text: "Testimonial text",
        rating: 5,
        vehicle: "Vehicle details"
    },
    // ... more testimonials
];
```

### Task 5: Update Contact Information

Search for and replace in both files:
- Phone: `+54 9 341 695-2259` → your new number
- WhatsApp: `5493416952259` → your new number (no spaces/symbols)
- Location: `Rosario, Santa Fe, Argentina` → your location

### Task 6: Activate Google Sheets Backup

1. Create Google Apps Script:
```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  // Add row for each quote
  data.quotes.forEach(quote => {
    sheet.appendRow([quote.id, quote.nombre, quote.email, ...]);
  });
  return ContentService.createTextOutput('Success');
}
```

2. Deploy as web app, copy URL

3. Update URL in `admin.html:81`:
```javascript
const GOOGLE_SCRIPT_URL = 'YOUR_NEW_URL_HERE';
```

---

## Testing & Debugging

### Manual Testing Checklist

#### Landing Page (index.html)
- [ ] Page loads without console errors
- [ ] A/B test shows random headlines
- [ ] "Cotizar Gratis" button opens chat
- [ ] Chatbot flow works through all steps
- [ ] Year validation rejects invalid years
- [ ] WhatsApp button generates correct message
- [ ] Quote saves to localStorage
- [ ] Mobile responsive design works
- [ ] All links functional

#### Admin Panel (admin.html)
- [ ] Login works with correct credentials
- [ ] Login rejects incorrect credentials
- [ ] Dashboard shows correct quote counts
- [ ] Status change buttons work
- [ ] Notes can be added and saved
- [ ] Reminders can be created
- [ ] Calendar view displays reminders
- [ ] Overdue reminders show correctly
- [ ] Data persists after page refresh
- [ ] Logout clears session

### Browser Console Debugging

```javascript
// Check for quotes
console.log(JSON.parse(localStorage.getItem('ayma_quotes')));

// Clear all data
localStorage.clear();

// Monitor data changes
window.addEventListener('storage', (e) => {
    console.log('Storage changed:', e);
});

// Check React version
console.log(React.version);
```

### Common Issues & Solutions

#### Issue: Quotes not saving
- **Check**: Browser localStorage enabled
- **Check**: Console for errors
- **Fix**: Verify `saveQuoteToStorage` function executes

#### Issue: Charts not rendering (admin)
- **Check**: Chart.js loaded correctly
- **Check**: Canvas elements exist in DOM
- **Fix**: Ensure dashboard view is active

#### Issue: WhatsApp button not working
- **Check**: URL encoding of message
- **Check**: Phone number format (no spaces/dashes)
- **Fix**: Verify message template syntax

#### Issue: Admin login fails
- **Check**: Credentials exactly match (case-sensitive)
- **Fix**: Username: `ayma`, Password: `Mimamamemima14`

---

## Deployment

### Current Deployment

**Platform**: Mentioned as Netlify in notification messages
**URL Pattern**: `ayma-seguros.netlify.app` (inferred from code)

### Netlify Deployment

Since there's no build process, deployment is straightforward:

1. **Connect to Git Repository**
   - Login to Netlify
   - Import repository

2. **Build Settings**
   ```
   Build command: (leave empty)
   Publish directory: /
   ```

3. **Deploy Settings**
   - All files served as static assets
   - `index.html` as root
   - `admin.html` accessible at `/admin.html`

### Manual Deployment

If deploying elsewhere:

1. Upload all files to web server root
2. Ensure server serves HTML files
3. No server-side processing needed
4. HTTPS recommended (for geolocation API if used)

### Environment Variables

**None required** - all configuration is in-file

**For production**, consider:
- Moving credentials to environment variables
- Using server-side authentication
- Implementing backend for data storage

---

## Additional Context

### Business Rules

1. **Quote Flow**: User submits → Saved locally → WhatsApp notification → Admin follows up → Status updated
2. **Conversion Metric**: (Vendidas / Total) × 100
3. **Coverage Types**: RC, Terceros Completo, Terceros con Granizo, Todo Riesgo
4. **Vehicle Year Range**: 1980-2026
5. **Service Area**: Primarily Rosario, Santa Fe region

### Future Enhancements (Mentioned in Code)

- Email automation with EmailJS or SendGrid
- Active Google Sheets integration
- Backend API for data storage
- User authentication system
- Payment processing integration
- SMS notifications
- Advanced analytics dashboard

### Code Comments Philosophy

The codebase has minimal inline comments. Key logic is self-documenting through:
- Descriptive variable names
- Clear function names
- Logical code organization
- JSX structure mirrors UI

When adding features, maintain this pattern and update this CLAUDE.md file.

---

## Quick Reference

### Key File Locations

| Feature | File | Lines |
|---------|------|-------|
| A/B Test Headlines | `index.html` | 156-168 |
| Quote Data Structure | `index.html` | 198-206 |
| Chatbot Logic | `index.html` | 321-376 |
| WhatsApp Message | `index.html` | 378-397 |
| Testimonials | `index.html` | 171-193 |
| Admin Login | `admin.html` | 101-109 |
| Status Change | `admin.html` | 111-114 |
| Reminder System | `admin.html` | 134-155 |
| Google Sheets URL | `admin.html` | 81 |
| Dashboard KPIs | `admin.html` | 242-248 |

### External Dependencies

| Library | Version | CDN URL |
|---------|---------|---------|
| React | 18 | unpkg.com/react@18/umd/react.production.min.js |
| React DOM | 18 | unpkg.com/react-dom@18/umd/react-dom.production.min.js |
| Babel Standalone | Latest | unpkg.com/@babel/standalone/babel.min.js |
| Tailwind CSS | 3 | cdn.tailwindcss.com |
| Chart.js | 4.4.0 | cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js |

### Important URLs & Contacts

- **Business WhatsApp**: +54 9 341 695-2259
- **Admin Panel**: `/admin.html`
- **Google Apps Script**: `https://script.google.com/macros/s/AKfycby...`

---

## Version History

- **Latest Commit**: `8f0b332 - Update admin.html`
- **Recent Changes**: Multiple admin panel updates
- **Branch**: `claude/claude-md-mi3twgghnxmxv5e6-011uXnG2SL3jXvKAgDn49SbB`

---

*This document should be updated whenever significant changes are made to the codebase architecture, data structures, or development workflows.*
