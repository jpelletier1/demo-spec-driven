# Feature: Add Date of Hire Field to Payroll App

> Issue: #17
> Status: Draft

## Problem Statement

The Payroll Command Center currently tracks employee information including name, title, salary, home address, and manager relationships. However, it lacks a critical HR data point: the employee's date of hire.

Recording when an employee joined the organization is essential for:
- Calculating tenure and seniority
- Determining eligibility for benefits, promotions, or reviews
- Generating accurate workforce reports
- Compliance with employment record-keeping requirements

Without this field, administrators must track hire dates in separate systems, leading to fragmented data and potential inconsistencies.

## User Stories

1. As an **Admin**, I want to record the date of hire for each employee, so that I can maintain complete employment records in one place.

2. As an **Admin**, I want to edit an employee's date of hire at any time, so that I can correct errors or update records when needed.

3. As an **Admin**, I want a calendar date picker for selecting the hire date, so that I can quickly and accurately enter dates without formatting errors.

4. As an **Admin**, I want to see the date of hire displayed in the employee directory, so that I can quickly reference hire dates without opening the edit form.

## Functional Requirements

### Must Have

- [ ] **Database Field**: Add a `date_of_hire` column to the employees table
  - [ ] Column should store dates in a consistent format (ISO 8601: YYYY-MM-DD)
  - [ ] Field should be optional (nullable) to allow for existing records without hire dates
- [ ] **Add Employee Form**: Include a date of hire input in the "New payroll profile" form
  - [ ] Display a calendar dropdown/date picker for easy date selection
  - [ ] Field should be optional when adding new employees
- [ ] **Edit Employee Form**: Include date of hire in the employee edit card form
  - [ ] Display a calendar dropdown/date picker for easy date selection
  - [ ] Allow editing the date at any time (no restrictions on changing this field)
  - [ ] Pre-populate with existing value if one exists
- [ ] **Employee Directory Table**: Display the date of hire in the employee roster table
  - [ ] Add a "Date of Hire" column to the table header
  - [ ] Display dates in a user-friendly format (e.g., "Mar 15, 2023")
  - [ ] Display appropriate placeholder text for employees without a hire date
- [ ] **Data Validation**: Validate date input on the server
  - [ ] Accept valid date formats
  - [ ] Reject invalid date values (e.g., "not-a-date")

### Should Have

- [ ] **Employee Cards**: Show date of hire in the employee card summary or details
- [ ] **API Response**: Include `dateOfHire` in the `/api/employees` JSON response

### Nice to Have

- [ ] **Tenure Calculation**: Display calculated tenure (e.g., "2 years, 3 months") alongside the hire date
- [ ] **Date Constraints**: Optionally prevent future dates from being selected
- [ ] **Seed Data**: Update seed employees to include sample hire dates

## Acceptance Criteria

- [ ] Verify that the date of hire field appears in the "New payroll profile" form with a calendar date picker
- [ ] Verify that the date of hire field appears in the employee edit form with a calendar date picker
- [ ] Verify that clicking the date input opens a calendar dropdown for date selection
- [ ] Verify that the date of hire can be left empty when adding a new employee
- [ ] Verify that the date of hire is displayed in the employee directory table
- [ ] Verify that employees without a hire date show appropriate placeholder text in the table
- [ ] Verify that an existing hire date can be edited and saved
- [ ] Verify that an existing hire date can be cleared (set to empty)
- [ ] Verify that invalid date values are rejected with an appropriate error message
- [ ] Verify that the date is stored correctly in the database in ISO format
- [ ] Verify that the date is displayed in a user-friendly format in the UI

## Out of Scope

The following are explicitly NOT part of this feature:

- **Employment End Date**: Tracking when employees leave is a separate concern
- **Employment History**: Tracking multiple hire dates or re-hires
- **Date-based Filtering**: Filtering/searching employees by hire date range
- **Anniversary Notifications**: Automated notifications for work anniversaries
- **Probation Period Tracking**: Calculating or tracking probationary periods
- **Date Localization**: Displaying dates in different regional formats based on user locale

## Open Questions

1. **Date Format Display**: Should the UI display dates in "Mar 15, 2023" format, "03/15/2023" format, or allow user preference? (Recommendation: "Mar 15, 2023" for readability)

2. **Future Dates**: Should the system allow future hire dates (for pre-boarding new hires), or restrict to past/present dates only? (Recommendation: Allow future dates for flexibility)

3. **Existing Data Migration**: Should we backfill hire dates for the 6 existing seed employees, or leave them as null to demonstrate the optional nature of the field?
