# Feature: Add Phone number field to payroll app

> Issue: #14
> Status: Draft

## Problem Statement

The payroll app currently stores employee compensation, reporting lines, and home addresses, but it does not provide a way to record a phone number for each employee. Payroll administrators need quick access to employee phone numbers so they can contact employees during urgent or emergency situations without relying on separate systems or offline records.

Adding phone number capture to the payroll app keeps employee contact details in the same place as the rest of each payroll profile and reduces the risk of missing or outdated emergency contact information.

## User Stories

1. As a payroll admin, I want to enter an employee phone number when creating a payroll profile, so that I can store their primary contact number from the start.
2. As a payroll admin, I want to update an employee phone number later, so that I can keep contact information accurate over time.
3. As a payroll admin, I want to view the stored phone number within the payroll app, so that I can quickly find how to contact an employee in an emergency.

## Functional Requirements

### Must Have

- [ ] **Required phone field on create**: The add-employee workflow includes a required phone number field labeled `Phone`
- [ ] **Required phone field on update**: Existing employee records can be edited to add or change the stored phone number, and saving an employee record requires a phone number
- [ ] **Phone value persistence**: The employee record stores the phone number as part of the payroll profile and retains it across page reloads and app restarts
- [ ] **Digits-only validation**: The app accepts phone numbers composed of digits only
- [ ] **Length validation**: The app rejects phone numbers that exceed 10 digits
- [ ] **Validation feedback**: When a phone number is missing or invalid, the payroll admin receives a clear message explaining the validation failure
- [ ] **Visibility across the app**: Stored phone numbers are shown in employee forms, the roster table, and API responses so admins can reference them after saving

### Should Have

- [ ] **Graceful handling of existing records**: Existing employee records without a phone number continue to load, display a blank phone field, and remain editable until an admin fills in the value
- [ ] **Consistent presentation**: The app presents phone numbers consistently wherever they are displayed in the interface

### Nice to Have

- [ ] **Searchability**: Payroll admins can search or filter employees by phone number
- [ ] **Copy-friendly display**: Displayed phone numbers are easy to copy for calling or texting workflows

## Acceptance Criteria

- [ ] Verify the add employee form includes a required `Phone` field
- [ ] Verify each employee edit form includes a `Phone` field populated with the current saved value, when present
- [ ] Verify a payroll admin can save a valid digits-only phone number and see it in the employee forms, roster table, and API responses
- [ ] Verify a payroll admin can update an existing employee phone number
- [ ] Verify submitting a blank phone number for a create or update request does not save the change and shows a clear validation message
- [ ] Verify submitting non-digit characters in the phone field does not save the change and shows a clear validation message
- [ ] Verify submitting a phone number longer than 10 digits does not save the change and shows a clear validation message
- [ ] Verify existing employee records created before this feature still render successfully with a blank phone field until manually updated

## Out of Scope

The following are explicitly not part of this feature:

- Separate emergency contact people or alternate phone numbers
- International phone number support, extensions, or country-code handling
- SMS, calling, or notification integrations
- Phone number verification through third-party services
- Bulk import or export of phone numbers

## Open Questions

None at this time.
