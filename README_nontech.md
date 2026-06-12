# BAIO 2026-27 Portal Operations Manual (Non-Technical Guide)

Welcome to the Bharat AI Olympiad (BAIO) Portal Operations Manual. This guide provides step-by-step instructions for School Administrators and BAIO Operations Admins on how to use the School Dashboard and Company Admin Panels.

---

## 1. Accessing the Dashboards

### School Portal
* **URL:** `http://localhost:5175/school/login` (Local Developer Environment)
* **Access Level:** Verified School administrators/coordinators.
* **Seeded Development Login:**
  - **Contact Email:** `info@dpsrohtak.edu.in`
  - **Affiliation Number:** `CBSE999999`
* **How to login:** 
  1. Navigate to the school login page.
  2. Input the school's **Contact Email** and **Affiliation Number**.
  3. Click **Sign In to Dashboard**.

### Company Admin Dashboard
* **URL:** `http://localhost:5174/login` (Local Developer Environment)
* **Access Level:** BAIO Central Administrators.
* **Seeded Development Login:**
  - **Admin Email:** `admin@baio.in`
  - **Password:** `AdminPassword123!`
* **How to login:**
  1. Open the Admin login URL.
  2. Enter the admin credentials.
  3. Click **Access Admin Panel**.

---

## 2. Participant Enrollment & spreadsheet Templates

Once logged into the **School Portal**, go to the **Submit Students** tab to upload candidates.

### File Format Requirements
* Supported file types: `.xlsx`, `.xls`, `.csv` (Excel spreadsheets) and `.pdf` (text-copyable PDF tables).
* Maximum rows per upload: **200 rows**.
* Maximum file size: **10MB**.

### Spreadsheet Column Headers
Our parsing engine automatically maps columns using case-insensitive matches. Your spreadsheet must contain the following headers:

| Header Name (Case-Insensitive) | Description | Example / Allowed Values |
| :--- | :--- | :--- |
| **Student Name** | Full name of the candidate | `Aarav Sharma` or `Priyanshu Roy` |
| **Class** or **Grade** | Grade level of the student | `6`, `7`, `8`, `9`, `10`, `11`, `12` |
| **Section** *(Optional)* | Class division / section | `A`, `B`, `C`, etc. |
| **Roll No** *(Optional)* | Unique class roll number | `15`, `21`, etc. |
| **Gender** *(Optional)* | Student gender classification | `Male`, `Female`, `Other` |

> [!IMPORTANT]
> **Classes supported:** Grades 6 to 12 only.
> Make sure the PDF file contains copyable text rows; image-only scanned PDFs are not supported.

---

## 3. Operating the School Portal

### Verify Status
* Upon registration, your school status remains **Pending Verification**. A BAIO central coordinator will review your registry details.
* Once verified, you will see a green **School Account Verified** banner, unlocking participant uploads.

### Student List Management
* Under **Participants List**, you can search, inspect, and check details of all submitted students.
* Click **Export List to Excel** to download the enrolled students list as a spreadsheet.

### Performance Analytics & Scorecards
* Once results are published, open the **Reports & Analytics** tab.
* **Overview Cards:** Display school qualifiers, averages, total appeared, and registered counts.
* **Grade & Section Metrics:** Analyze grade averages, class toppers, and section score ranges.
* **Excel Exporting:**
  - Click **Excel** next to Class Reports or Section Reports to download summary tables.
  - **Export Filtered:** Type a student name or filter by Class/Section, then click **Export Filtered** to download the matching scorecards.
  - **Chunk Export:** Select candidate checkboxes in the scorecard table, then click **Export Selected Chunk (Excel)** to download a custom spreadsheet segment.

---

## 4. Central Admin Dashboard Operations

Central Administrators use the Admin Panel to verify schools, inspect reports, and publish results.

### Verifying Registered Schools
1. Navigate to the **Registered Schools** tab in the sidebar.
2. Select **Approve/Verify** next to a pending school to whitelist them, or **Revoke** to mark them pending.
3. Fill out optional verification remarks if needed.
4. Click **School Name** to inspect address, coordinator profile, and geographic location.

### School Performance Analytics
1. Navigate to **Registered Schools**.
2. Locate the school and click the **Performance** button under actions.
3. This opens the **School Performance Reports Modal**:
   - Inspect total appeared, qualifiers count, and school average.
   - Download class-wise and section-wise summary Excel sheets.
   - Search, filter, and multi-select students to export chunks or full candidate listings to Excel.

### Releasing and Publishing Results
1. Navigate to the **Olympiad Results** tab in the sidebar.
2. At the top of the Results list, locate the **Bulk Results Publishing Center**:
   - **School-wise Release:** Select a school from the dropdown list and click **Publish School** to release results exclusively to that school, or **Unpublish School** to retract them.
   - **Global Release:** Click **Release All** to instantly publish results for all schools across India, or **Hide All** to pull results back to draft status.
