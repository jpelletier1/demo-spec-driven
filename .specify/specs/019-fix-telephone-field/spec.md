# Feature: Fix Telephone Field

> Issue: #19
> Status: Draft

## Problem Statement

The employee management system currently lacks a telephone field for employee records. Users need the ability to store and manage employee phone numbers for contact purposes. The field must:
- Accept exactly 10-digit phone numbers (US format without country code)
- Be labeled consistently as "Phone" throughout the application

This enables HR and managers to maintain up-to-date contact information for employees.

## User Stories

1. As an **HR Administrator**, I want to add a phone number when creating a new employee, so that I have contact information on file for each team member.

2. As an **HR Administrator**, I want to edit an employee's phone number, so that I can keep contact information current when employees change their phone numbers.

3. As a **Manager**, I want to view an employee's phone number in the directory, so that I can quickly contact team members when needed.

## Functional Requirements

### Must Have

- [ ] **Phone Field in Database**: Add a `phone` column to the employees table
  - [ ] Phone numbers should be stored as a 10-digit string (digits only)
- [ ] **Phone Input on Create Form**: Add a "Phone" input field to the new employee form
  - [ ] Label the field "Phone"
  - [ ] Validate that the input contains exactly 10 digits
  - [ ] Strip any non-digit characters (spaces, dashes, parentheses) before validation and storage
- [ ] **Phone Input on Edit Form**: Add a "Phone" input field to the employee edit form
  - [ ] Label the field "Phone"
  - [ ] Apply the same 10-digit validation
  - [ ] Pre-populate with existing phone number
- [ ] **Phone Display in Directory**: Display phone numbers in the employee directory table
  - [ ] Add a "Phone" column to the table
  - [ ] Format displayed numbers in a readable format (e.g., (555) 123-4567)
- [ ] **Phone Display in Employee Cards**: Show phone numbers in the employee card view

### Should Have

- [ ] **Validation Error Messages**: Display clear error messages when phone number validation fails
  - [ ] "Phone number must be exactly 10 digits"
- [ ] **Input Formatting Hint**: Show placeholder text demonstrating expected format (e.g., "5551234567" or "(555) 123-4567")

### Nice to Have

- [ ] **Click-to-Call**: Make phone numbers clickable with `tel:` links on mobile devices
- [ ] **Input Masking**: Auto-format input as user types (e.g., showing dashes or parentheses)

## Acceptance Criteria

- [ ] Verify that the "Phone" label appears on both the create and edit forms
- [ ] Verify that a valid 10-digit phone number can be saved for a new employee
- [ ] Verify that a valid 10-digit phone number can be updated for an existing employee
- [ ] Verify that phone numbers appear in the employee directory table
- [ ] Verify that phone numbers appear in the employee card details
- [ ] Verify that submitting fewer than 10 digits shows a validation error
- [ ] Verify that submitting more than 10 digits shows a validation error
- [ ] Verify that phone numbers with formatting (e.g., "555-123-4567") are accepted and stored as digits only
- [ ] Verify that empty phone numbers are accepted (field is optional)

## Out of Scope

The following are explicitly NOT part of this feature:

- **International Phone Numbers**: Support for phone numbers outside the 10-digit US format
- **Country Code Selection**: Adding country code dropdowns or international dialing
- **Phone Number Type**: Differentiating between work, mobile, or home numbers
- **Multiple Phone Numbers**: Storing more than one phone number per employee
- **Phone Number Verification**: SMS verification or validation that the number is real/active
- **Extension Support**: Handling phone extensions for office lines

## Open Questions

1. **Required vs Optional**: Should the phone number be a required field, or optional? (Current assumption: optional)

2. **Existing Employees**: How should existing employee records be handled? Should they display "N/A" or be blank if no phone is on file?

3. **Display Format**: What format should be used for displaying phone numbers? Options:
   - `(555) 123-4567` (parentheses + dashes)
   - `555-123-4567` (dashes only)
   - `555.123.4567` (dots)
