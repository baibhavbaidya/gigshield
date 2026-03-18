# GigShield — Parametric Income Insurance for Q-Commerce Delivery Workers

> Guidewire DEVTrails 2026 | University Hackathon Submission

---

## Team — Smooth Operators

- Baibhav Baidya
- Shivam Kumar
- Ayush Chaudhari
- Adriti Sharma

---

## The Problem

India's Q-Commerce delivery workers — operating for platforms like Zepto, Blinkit, and Swiggy Instamart — work under extreme time pressure with zero financial safety net. When external disruptions occur, such as heavy rainfall, severe air quality, platform outages, or civic curfews, their ability to earn drops to zero. They bear the full financial loss with no recourse.

A Blinkit delivery worker in Mumbai earns approximately Rs. 700 per day. During the 2023 monsoon season, workers in flood-prone zones like Dharavi and Andheri reported losing 3 to 5 working days per month with no compensation. No existing insurance product in India covers this specific, measurable income loss.

GigShield solves this with a parametric income insurance platform — one that detects disruptions automatically through real-time data, initiates claims without any worker action, and processes payouts to UPI in under 8 minutes.

---

## Persona

**Name:** Ravi, 24 years old  
**Platform:** Blinkit delivery partner  
**Location:** Andheri East, Mumbai  
**Earnings:** Rs. 700 per day, paid weekly by the platform  
**Device:** Basic Android smartphone, active WhatsApp user  
**Financial buffer:** None — one disrupted week means skipped rent or skipped meals  

Ravi has never purchased insurance. He considers it inaccessible, confusing, and designed for someone else. GigShield is designed specifically for him — simple enough to understand in one screen, cheap enough to pay from last week's earnings, and automatic enough that he never has to file anything.

---

## What We Cover

GigShield covers **income loss only**. We do not cover health, life, accident, or vehicle repair costs. Every feature, trigger, and payout in this system is scoped exclusively to lost working hours caused by external, uncontrollable disruptions.

---

## Disruption Triggers

We identified nine disruption types across four categories, specific to the Q-Commerce persona. This goes beyond standard weather coverage because Q-Commerce workers face a uniquely diverse set of income threats.

### Category 1 — Environmental

| Trigger | Threshold | Data Source |
|---|---|---|
| Heavy Rainfall | Greater than 65 mm per hour | OpenWeatherMap API (real-time) |
| Extreme Heat Index | Greater than 43 degrees Celsius | OpenWeatherMap API (real-time) |
| Severe Air Quality | AQI greater than 300 micrograms per cubic metre | OpenAQ / CPCB API (real-time) |
| Road Waterlogging | Active IMD waterlogging advisory for zone | Mock IMD zone advisory API |

Rainfall above 65mm/hr makes 10-minute Q-Commerce deliveries physically impossible. Zepto and Blinkit have both issued mandatory delivery halts during extreme heat events in 2024. Waterlogging is distinct from flooding — it is far more frequent (40+ days per year in Mumbai) and directly causes platform-level delivery pauses.

### Category 2 — Social

| Trigger | Threshold | Data Source |
|---|---|---|
| Bandh or Strike | Declared in worker's active zone | Mock civic advisory API |
| Section 144 / Curfew | Police curfew active in zone | Mock government advisory API |
| Festival Zone Closure | Date and zone match from Indian festival calendar | Hardcoded festival calendar with zone mapping |

Maharashtra bandhs are declared with as little as 12 hours' notice. Section 144 orders have been imposed in Mumbai, Delhi, and Hyderabad multiple times in recent years, immediately halting all delivery activity. Festival closures such as Ganesh Visarjan in Mumbai block entire delivery zones for 12 to 18 hours — these are predictable but unavoidable.

### Category 3 — Platform

| Trigger | Threshold | Data Source |
|---|---|---|
| Darkstore Closure | Store status returns offline | Mock Zepto/Blinkit status API |
| Platform App Outage | Downtime exceeding 45 minutes | Mock platform health API |

In 2023, Delhi FSSAI raids shut down multiple Blinkit darkstores mid-shift. Workers assigned to those stores earned nothing for the remainder of the day. Platform outages are documented for both Zepto and Blinkit. These triggers are unique to Q-Commerce and invisible to any existing insurance product.

---

## Weekly Premium Model

Gig workers are paid weekly. Our premium model is structured on the same weekly cycle so workers never pay from savings — they pay from last week's earnings.

### Three Coverage Tiers

| Plan | Weekly Premium | Income Coverage | Maximum Daily Payout |
|---|---|---|---|
| Lite | Rs. 49 | 50 percent of daily income | Rs. 175 per day |
| Standard | Rs. 89 | 75 percent of daily income | Rs. 262 per day |
| Premium | Rs. 129 | 100 percent of daily income | Rs. 350 per day |

### Dynamic Zone Risk Multiplier

Base premiums are adjusted by a zone-specific risk multiplier computed by our XGBoost risk model, trained on historical IMD rainfall frequency, CPCB AQI data, and documented disruption events per zone.

| Zone | Risk Multiplier | Reason |
|---|---|---|
| Mumbai — Dharavi | 1.4x | Highest historical flood and waterlogging frequency |
| Mumbai — Andheri | 1.2x | Moderate flood and heat risk |
| Delhi — Saket | 1.1x | Elevated AQI and civic disruption risk |
| Bengaluru — Koramangala | 1.0x | Baseline reference zone |
| Hyderabad — Madhapur | 0.9x | Historically low disruption frequency |

### Surge Shield — Loyalty Pricing

Workers with clean claim histories receive progressive premium discounts. This rewards low-risk workers and improves pool margins simultaneously.

| Consecutive Weeks Without Claim | Discount Applied |
|---|---|
| 4 weeks | 5 percent off weekly premium |
| 8 weeks | 10 percent off weekly premium |
| 12 weeks | 15 percent off weekly premium (maximum) |

### Monday Forecast — Weekly Coverage Decision

Every Monday morning, GigShield's forecast model predicts the disruption probability for the worker's zone over the next 7 days. The app displays this as a clear risk indicator and suggests an appropriate coverage tier. The worker makes the final decision — the AI only advises.

A worker seeing a 78 percent rain risk forecast on Monday can upgrade to Premium for that week. A worker seeing a low-risk forecast can drop to Lite and save money. This creates genuine worker agency over their financial protection.

### Financial Model — Profitable for GigShield, Genuinely Valuable for Ravi

The premium structure is not arbitrary. It is reverse-engineered from historical disruption data to be simultaneously affordable for the worker and financially sustainable for the platform.

**Step 1 — How many disruption days does a Mumbai Q-Commerce worker actually face?**

Based on historical IMD rainfall records, CPCB AQI data, and documented civic disruption events in Mumbai:

```
Environmental disruption days per year (rainfall, heat, AQI, waterlogging): ~32 days
Social disruption days per year (bandh, curfew, festival closures):          ~10 days
Platform disruption days per year (darkstore closures, app outages):          ~6 days

Total potential disruption days per year: ~48 days
```

Not every disruption day results in a claim. Some workers brave the conditions anyway. Some are on a day off. Some disruptions are short enough that income loss is negligible. Accounting for these factors, the realistic claimable disruption rate is approximately 35 percent of all disruption days.

```
48 disruption days x 35 percent claim rate = ~17 claimable days per worker per year
```

**Step 2 — What does GigShield actually pay out per claim?**

Disruptions rarely last a full working day. Average disruption duration for our trigger types is 3 to 4 hours. Payout is calculated on hours actually lost, not a flat full-day amount.

```
Standard plan worker earning Rs. 700 per day across 8 working hours:
Hourly rate = Rs. 87.50

Average disruption duration = 3.5 hours
Hours lost payout = 3.5 x Rs. 87.50 x 75 percent coverage = Rs. 230 per claim
```

**Step 3 — Annual cost per Standard plan worker**

```
Expected annual claims:          17 days x Rs. 230 per claim = Rs. 3,910
Reinsurance buffer (8 percent):                               = Rs. 313
Total annual cost per worker:                                 = Rs. 4,223
```

**Step 4 — Annual premium collected per Standard plan worker**

```
Rs. 89 per week x 52 weeks = Rs. 4,628 per year
```

**Step 5 — Surplus per worker**

```
Annual premium collected:  Rs. 4,628
Annual cost:               Rs. 4,223
Annual surplus per worker: Rs.   405  (approximately 9 percent margin)
```

This is a conservative single-worker view. The margin improves significantly at scale because disruption events are not uniformly distributed — many weeks have zero claims across the entire pool, and the surplus from those weeks funds the weeks with concentrated claims.

**Pool-level view at 1,000 Standard plan workers in one Mumbai zone:**

```
Weekly premium collection:       1,000 x Rs. 89 = Rs. 89,000

Disruption weeks per year: approximately 7 out of 52
(weeks where at least one trigger fires in the zone)

Per disruption week, approximately 35 percent of workers claim:
350 workers x Rs. 230 average payout = Rs. 80,500 in claims

Non-disruption weeks (45 weeks): Rs. 0 in claims

Annual collection:    52 x Rs. 89,000 = Rs. 46,28,000
Annual claims:         7 x Rs. 80,500 = Rs.  5,63,500
Reinsurance buffer:                   = Rs.  3,70,240
Annual pool surplus:                  = Rs. 36,94,260  (~80 percent margin)
```

The pool surplus is healthy because the vast majority of weeks are disruption-free. Workers are paying for peace of mind on bad weeks — and the bad weeks are infrequent enough that the math works strongly in the platform's favour.

**Why this is genuinely good for Ravi (the worker's perspective):**

```
Ravi pays Rs. 89 per week on the Standard plan.
That is Rs. 12.70 per day — less than a single Swiggy delivery fee.

On a disruption day, Ravi receives Rs. 230.
That is an 18x return on his daily premium cost.

Over a year, Ravi pays Rs. 4,628 in premiums.
GigShield protects approximately Rs. 3,910 of income he would otherwise lose entirely.
His net annual benefit = Rs. 3,910 protected - Rs. 4,628 paid = -Rs. 718 in a normal year.

However: in a bad year (Mumbai monsoon, extended AQI crisis), claimable days can reach 25+.
25 days x Rs. 230 = Rs. 5,750 protected against Rs. 4,628 paid = net gain of Rs. 1,122.
```

The product is priced at the edge of break-even for the worker in an average year — which means it costs Ravi almost nothing for full income protection. In a bad year, it pays him back more than he spent. This is the right balance: affordable enough that workers don't hesitate, valuable enough that workers who experience a disruption immediately understand its worth.

**Reinsurance layer:**

Parametric insurance carries a specific risk called catastrophic correlation — when a city-wide event like a major flood triggers simultaneous claims from thousands of workers. A single-week event could generate claims far exceeding that week's premium collection. GigShield addresses this through a reinsurance arrangement where a Tier-1 reinsurer covers total weekly claims exceeding a defined threshold in exchange for a fixed percentage of collected premiums (the 8 percent buffer built into our cost model). This ensures GigShield can honour all claims even during extreme events without insolvency risk.

---

## Platform Choice — Web Application with PWA Support

We are building a web application using React, deployed on Vercel. The application is designed mobile-first so it renders correctly on a basic Android smartphone without requiring a Play Store installation.

In the final week of development, we will add PWA configuration — a web app manifest and service worker — which allows workers to install GigShield directly from their browser to their homescreen. The installed version runs fullscreen without a browser bar, behaving identically to a native app.

**Why not native mobile:** Building a React Native or Flutter application within a 6-week timeline while also building three ML models, a real-time trigger engine, fraud detection, and an admin dashboard is not realistic. A well-designed mobile-responsive web application delivers equivalent user experience for this use case, with the PWA layer providing homescreen installation at minimal additional effort.

**Two portals:**
- Worker portal — mobile-first, designed for a basic Android device
- Admin and insurer dashboard — desktop web, designed for operational oversight

---

## AI and ML Integration

### Model 1 — Zone Risk Engine (XGBoost Regression)

Computes the zone risk multiplier used in premium calculation.

- Inputs: Zone identifier, historical rainfall days per year, historical severe AQI days per year, flood event frequency, seasonal flag, platform outage frequency
- Output: Risk multiplier between 0.9 and 1.4
- Training data: Synthetic dataset generated from real IMD and CPCB historical patterns
- Runs on: Worker signup and every Monday morning recalculation

### Model 2 — Monday Disruption Forecast (Facebook Prophet)

Predicts disruption probability for each zone over the next 7 days.

- Inputs: OpenWeatherMap 7-day forecast, historical disruption calendar per zone, seasonal patterns
- Output: Daily disruption probability percentage per zone
- Displayed to worker as a simple risk meter every Monday
- Runs as an automated background job every Monday at 6 AM

### Model 3 — Fraud Detection Engine (Isolation Forest)

Scores every auto-initiated claim before payout is processed.

Checks performed:
- Worker's GPS coordinates versus the declared disruption zone boundary
- Claim initiation timestamp versus confirmed API event window
- Duplicate claim detection for the same event identifier
- Worker platform activity status in the hours preceding the disruption
- Corroboration check — proportion of workers in same zone claiming simultaneously

Output: Fraud score from 0 to 100

| Score Range | Action |
|---|---|
| 0 to 30 | Automatically approved, payout initiated |
| 31 to 60 | Flagged for admin review queue |
| 61 to 100 | Automatically rejected, worker notified with reason |

---

## End-to-End Workflow

**Monday — Coverage Selection**

The worker opens GigShield and sees the Monday forecast for their zone. The AI recommends a coverage tier based on predicted disruption risk. The worker selects a plan and pays the weekly premium via Razorpay UPI sandbox. The policy is active from Monday midnight to Sunday 11:59 PM and stored with worker ID, zone, plan tier, coverage amount, and validity window.

**Monday through Sunday — Real-Time Monitoring**

The backend polling engine runs every 15 minutes and checks OpenWeatherMap for rainfall and heat index, OpenAQ for AQI values, and all mock APIs for social and platform disruption statuses. Every reading is logged. If all values are below thresholds, no action is taken.

**Disruption Detected**

When a threshold is crossed, the event is logged with zone, trigger type, value, threshold, timestamp, and API source. All workers with an active policy in the affected zone are identified. A claim is automatically created for each — no worker action required.

**Fraud Check**

The Isolation Forest model runs within two minutes of claim creation. Based on the fraud score, the claim is automatically approved, flagged for review, or automatically rejected.

**Payout Processing**

For approved claims, the payout amount is calculated based on hours lost during the disruption window, the worker's registered daily earnings, and their coverage percentage. Razorpay test mode initiates a UPI transfer. A Twilio WhatsApp message is sent to the worker's registered number confirming the payout amount and transfer status. The full cycle from trigger detection to payout initiation takes under 8 minutes.

**Sunday — Weekly Summary**

The worker sees a summary screen showing total earnings for the week, income protected by GigShield, premium paid, net disruption loss, current loyalty streak, and a preview of next week's forecast.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| Machine Learning | scikit-learn, XGBoost, Facebook Prophet |
| Weather Data | OpenWeatherMap API (free tier) |
| AQI Data | OpenAQ API (free tier) |
| Social and Platform Triggers | Mock JSON APIs built in FastAPI |
| Festival Triggers | Hardcoded Indian festival calendar with zone mapping |
| Payment Processing | Razorpay test mode (UPI sandbox) |
| WhatsApp Notifications | Twilio WhatsApp sandbox |
| Authentication | Firebase Auth (phone OTP) |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

---

## Development Plan

### Phase 1 — March 4 to 20 — Ideation and Foundation

- GitHub repository and README
- PostgreSQL database schema design
- Synthetic training data generation for ML models
- React and FastAPI project scaffolding
- Worker onboarding UI
- Interactive premium calculator UI with zone selector
- Monday forecast UI with mock data
- Phase 1 video submission

### Phase 2 — March 21 to April 4 — Automation and Protection

- OpenWeatherMap and OpenAQ API integration
- All mock APIs built and running (waterlogging, bandh, curfew, darkstore, outage)
- Festival calendar trigger
- 15-minute background polling engine
- Auto claim initiation logic
- Policy create, renew, and expire logic
- XGBoost risk model trained and integrated into premium calculator
- Isolation Forest fraud detection live on every claim
- Razorpay test mode UPI payout working
- Twilio WhatsApp notification on claim approval
- Full claim-to-payout flow tested end to end
- Phase 2 video submission

### Phase 3 — April 5 to 17 — Scale and Optimise

- Admin dashboard with loss ratio charts and zone heatmap
- Fraud review queue UI with manual approve and reject
- Predictive analytics panel using forecast model output
- Worker earnings protection summary screen
- Surge Shield loyalty discount display
- Simulate Disruption button for demo purposes
- Mobile responsiveness and UI polish
- PWA manifest and service worker configuration
- Pitch deck PDF
- Final 5-minute demo video

---

## Unique Differentiators

**Nine triggers across four categories.** Most parametric insurance products cover weather only. GigShield covers environmental, social, platform, and infrastructure disruptions — all specific to the Q-Commerce delivery context in India.

**Monday Forecast with worker agency.** Workers see a 7-day disruption probability forecast every Monday and choose their coverage tier accordingly. No other parametric insurance product in India gives gig workers this kind of informed, weekly decision-making capability.

**Surge Shield loyalty pricing.** The premium model rewards consistent, low-claim workers with progressive discounts — improving affordability over time while maintaining pool margin health.

**Platform outage as an insurable event.** Zepto and Blinkit app outages directly halt worker income. No existing insurance product recognises this as an insurable disruption. GigShield does.

**WhatsApp-first communication.** Workers do not need to open the app to know their claim was approved. A WhatsApp message delivers the confirmation and payout status to where they already are.

---

## Repository Structure

```
gigshield/
├── frontend/                  React web application
│   ├── src/
│   │   ├── pages/             Worker portal and admin dashboard screens
│   │   ├── components/        Shared UI components
│   │   └── services/          API client and Firebase auth
├── backend/                   FastAPI application
│   ├── app/
│   │   ├── routers/           API route handlers
│   │   ├── models/            Database models
│   │   ├── services/          Trigger engine, claim logic, payout service
│   │   └── ml/                XGBoost, Prophet, and Isolation Forest models
│   ├── mock_apis/             Simulated social and platform disruption endpoints
│   └── data/                  Synthetic training data and festival calendar
├── scripts/                   Data generation and model training scripts
└── README.md
```

---

## Demo Scenario

The following scenario will be demonstrated in the Phase 3 video submission.

The admin panel is open showing live API readings for Andheri zone — all values currently below thresholds. The admin hits the Simulate Disruption button, injecting a rainfall reading of 71 mm per hour. Within seconds, the trigger fires, three demo worker accounts auto-initiate claims, the Isolation Forest model computes fraud scores live on screen, two claims are auto-approved and one is auto-rejected based on GPS mismatch, Razorpay initiates test UPI transfers for the approved claims, and a WhatsApp message arrives on a physical device held to the camera confirming the payout. The worker portal then shows the updated claim status and payout history. Total elapsed time from trigger to payout initiation is under 8 minutes.

This is consistent with the Phase 3 deliverable requirement to visually demonstrate a simulated external disruption and show automated AI claim approval and payout processing.

---

*GigShield — because one bad monsoon week should not mean a skipped meal.*
